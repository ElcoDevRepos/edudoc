using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.EDIGenerators;
using Service.HealthCareClaims;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.BillingSchedules
{
    public class BillingScheduleService : CRUDBaseService, IBillingScheduleService
    {
        private readonly IPrimaryContext _context;
        private readonly IHealthCareClaimService _healthCareclaimService;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly IDocumentHelper _documentHelper;
        private readonly IEmailHelper _emailHelper;
        private readonly ILogger _logger;

        public BillingScheduleService(IPrimaryContext context,
                                      IEmailHelper emailHelper,
                                      IDocumentHelper documentHelper,
                                      IConfigurationSettings configurationSettings,
                                      IConfiguration configuration,
                                      IHealthCareClaimService healthCareclaimService,
                                      ILogger<BillingScheduleService> logger
                                      ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _emailHelper = emailHelper;
            _documentHelper = documentHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _healthCareclaimService = healthCareclaimService;
            _logger = logger;
        }

        public int GenerateHealthCareClaim(int billingScheduleId, int userId)
        {
            var newClaimId = 0;
            try
            {
                var startTime = DateTime.UtcNow;

                var billingJobToAdd = new JobsAudit()
                {
                    BillingScheduleId = billingScheduleId,
                    StartDate = startTime,
                    CreatedById = userId,
                    FileType = 837,
                };

                _context.JobsAudits.Add(billingJobToAdd);

                var schedule = _context.BillingSchedules
                                       .Include(bs => bs.BillingScheduleExcludedProviders.Select(p => p.Provider))
                                       .Include(bs => bs.BillingScheduleExcludedCptCodes.Select(cpt => cpt.CptCode))
                                       .Include(bs => bs.BillingScheduleExcludedServiceCodes.Select(sc => sc.ServiceCode))
                                       .FirstOrDefault(x => x.Id == billingScheduleId);

                if (schedule.IsReversal)
                {
                    newClaimId = _healthCareclaimService.GenerateReversalHealthCareClaim(billingScheduleId, userId);
                }
                else
                {
                    newClaimId = _healthCareclaimService.GenerateHealthCareClaim(billingScheduleId, new int[0], userId);
                }
                _context.SaveChanges();

                var newClaim = new HealthCareClaim();

                if (schedule.IsReversal)
                {
                    newClaim = _context.HealthCareClaims
                        .Include(x => x.ClaimsEncounters) // Get ReversedClaims
                        .Include(x => x.ClaimsEncounters.Select(y => y.ClaimsStudent))
                        .Include(x => x.ClaimsEncounters.Select(y => y.ClaimsStudent).Select(z => z.ClaimsDistrict))
                        .Include(x => x.ClaimsEncounters.Select(y => y.EncounterStudent))
                        .FirstOrDefault(x => x.Id == newClaimId);
                }
                else
                {
                    newClaim = _context.HealthCareClaims
                        .Include(x => x.BillingFiles)
                        .Include(x => x.ClaimsDistricts)
                        .Include(x => x.ClaimsDistricts.Select(y => y.ClaimsStudents))
                        .Include(x => x.ClaimsDistricts.Select(y => y.ClaimsStudents.Select(z => z.ClaimsEncounters)))
                        .Include(x => x.ClaimsDistricts.Select(y => y.ClaimsStudents.Select(z => z.ClaimsEncounters.Select(ce => ce.EncounterStudent))))
                        .FirstOrDefault(x => x.Id == newClaimId);
                }

                if (newClaim == null)
                    return 0;

                GenerateBillingFiles(newClaim, schedule, userId);

                billingJobToAdd.EndDate = DateTime.UtcNow;

                if (newClaim.BillingFiles.Any())
                {
                    var claimsEncounters = schedule.IsReversal ?
                    _context.ClaimsEncounters
                        .Where(ce => ce.ReversedClaimId == newClaimId) :
                    _context.ClaimsEncounters
                        .Where(ce => ce.ClaimsStudent.ClaimsDistrict.HealthCareClaimsId == newClaim.Id);

                    foreach (var claimsEncounter in claimsEncounters)
                    {
                        var encounterStudent = _context.EncounterStudents.FirstOrDefault(es => es.Id == claimsEncounter.EncounterStudentId);

                        if (Convert.ToInt32(claimsEncounter.BillingUnits) > 0)
                        {
                            encounterStudent.EncounterStatusId = schedule.IsReversal ? (int)EncounterStatuses.PENDING_REVERSAL : (int)EncounterStatuses.Invoiced;
                            _context.EncounterStudentStatus.Add(UpdateEncounterStudentStatusLog(encounterStudent.EncounterStatusId, encounterStudent.Id, userId));
                            _context.EncounterStudents.Attach(encounterStudent);
                            _context.SetEntityState(encounterStudent, EntityState.Modified);
                        }
                        if (Convert.ToInt32(claimsEncounter.BillingUnits) == 0)
                        {
                            encounterStudent.EncounterStatusId = schedule.IsReversal ? (int)EncounterStatuses.PENDING_REVERSAL : (int)EncounterStatuses.Invoice_0_service_units;
                            _context.EncounterStudentStatus.Add(UpdateEncounterStudentStatusLog(encounterStudent.EncounterStatusId, encounterStudent.Id, userId));
                            _context.EncounterStudents.Attach(encounterStudent);
                            _context.SetEntityState(encounterStudent, EntityState.Modified);
                        }

                        var aggregates = _context.ClaimsEncounters.Where(ce => ce.AggregateId == claimsEncounter.EncounterStudentCptCodeId).Select(ce => ce.EncounterStudent);

                        foreach (var aggregate in aggregates)
                        {
                            aggregate.EncounterStatusId = encounterStudent.EncounterStatusId;
                            _context.EncounterStudentStatus.Add(UpdateEncounterStudentStatusLog(aggregate.EncounterStatusId, aggregate.Id, userId));
                            _context.EncounterStudents.Attach(aggregate);
                            _context.SetEntityState(aggregate, EntityState.Modified);
                        }

                    }
                    _context.SaveChanges();
                }
                _context.SaveChanges();

                return newClaimId;
            }
            catch (Exception e)
            {
                this._logger.LogError(e, "Exception in GenerateHealthCareClaim");
                DiscardBillingSchedule(newClaimId, billingScheduleId, e);
                return 0;
            }

        }

        /// <summary>
        /// Creates a StatusLog object to be  added to context. this is necessary instead of the public function to avoid multiple threads
        /// </summary>
        /// <param name="statusLog"></param>
        /// <returns>EncounterStudentStatus for updating context</returns>
        private EncounterStudentStatus UpdateEncounterStudentStatusLog(int statusId, int encounterStudentId, int userId)
        {
            var statusLog = new EncounterStudentStatus()
            {
                EncounterStatusId = statusId,
                EncounterStudentId = encounterStudentId,
                CreatedById = userId,
            };

            return statusLog;
        }

        private void GenerateBillingFiles(HealthCareClaim newClaim, BillingSchedule schedule, int userId)
        {
            var excludedProviderNpis = schedule.BillingScheduleExcludedProviders.Select(p => p.Provider.Npi);
            var excludedCptCodes = schedule.BillingScheduleExcludedCptCodes.Select(cpt => cpt.CptCode.Code);
            var excludedServiceCodes = schedule.BillingScheduleExcludedServiceCodes.Select(c => c.ServiceCode.Code);

            var groupedClaimsByStudentId = new Dictionary<int, List<ClaimsEncounter>>();
            if (schedule.IsReversal)
            {
                groupedClaimsByStudentId = newClaim.ClaimsEncounters
                    .Where(ce => !excludedProviderNpis.Contains( ce.ReferringProviderId) && !excludedProviderNpis.Contains(ce.PhysicianId))
                    .Where(ce => !excludedCptCodes.Contains(ce.ProcedureIdentifier))
                    // .Where(ce => !excludedServiceCodes.Contains(ce.ReasonForServiceCode))
                    .GroupBy(ce => ce.ClaimsStudent.StudentId)
                    .ToDictionary(g => g.Key, g => g.ToList());
            }
            else
            {
                groupedClaimsByStudentId = newClaim.ClaimsDistricts
                    .SelectMany(cd => cd.ClaimsStudents)
                    .SelectMany(cs => cs.ClaimsEncounters)
                    .Where(ce => ce.AggregateId == null)
                    .Where(ce => !excludedProviderNpis.Contains( ce.ReferringProviderId) && !excludedProviderNpis.Contains(ce.PhysicianId))
                    .GroupBy(ce => ce.ClaimsStudent.StudentId)
                    .ToDictionary(g => g.Key, g => g.ToList());
            }
            const int MaxClaimPerStudent = 100; // Each file can only have max 100 claims per student
            const int MaxClaimPerFile = 5000;
            int currentClaimsCount = 0;
            int fileCount = 0;
            List<ClaimsEncounter> claims = new List<ClaimsEncounter>();

            while (groupedClaimsByStudentId.Any())
            {
                foreach (var groupedClaims in groupedClaimsByStudentId)
                {
                    if (currentClaimsCount < MaxClaimPerFile)
                    {
                        int availableClaimsLeftInFile = MaxClaimPerFile - currentClaimsCount;
                        if (groupedClaims.Value.Count() <= MaxClaimPerStudent)
                        {
                            if (groupedClaims.Value.Count() > availableClaimsLeftInFile)
                            {
                                claims.AddRange(groupedClaims.Value.Take(availableClaimsLeftInFile));
                                currentClaimsCount += availableClaimsLeftInFile;
                                groupedClaimsByStudentId[groupedClaims.Key] = groupedClaims.Value.Skip(availableClaimsLeftInFile).ToList();
                            }
                            else
                            {
                                claims.AddRange(groupedClaims.Value);
                                currentClaimsCount += groupedClaims.Value.Count;
                                groupedClaimsByStudentId.Remove(groupedClaims.Key);
                            }
                        }
                        else
                        {
                            if (MaxClaimPerStudent > availableClaimsLeftInFile)
                            {
                                claims.AddRange(groupedClaims.Value.Take(availableClaimsLeftInFile));
                                currentClaimsCount += availableClaimsLeftInFile;
                                groupedClaimsByStudentId[groupedClaims.Key] = groupedClaims.Value.Skip(availableClaimsLeftInFile).ToList();
                            }
                            else
                            {
                                claims.AddRange(groupedClaims.Value.Take(MaxClaimPerStudent));
                                currentClaimsCount += MaxClaimPerStudent;
                                groupedClaimsByStudentId[groupedClaims.Key] = groupedClaims.Value.Skip(MaxClaimPerStudent).ToList();
                            }
                        }
                    }
                    else
                    {
                        break;
                    }
                }
                if (currentClaimsCount <= MaxClaimPerFile)
                {

                    var fileName = schedule.Name.Replace("/", "_").Replace("\\", "_").Replace(" ", "_");

                    var billingFileToAdd = new BillingFile()
                    {
                        HealthCareClaimId = newClaim.Id,
                        Name = $"{fileName}_{newClaim.Id}_PG{fileCount + 1}_837",
                        DateCreated = DateTime.UtcNow,
                        CreatedById = userId,
                        FilePath = $"{fileName}_{newClaim.Id}_PG{fileCount + 1}_837.837",
                        ClaimsCount = claims.Count(),
                        PageNumber = fileCount + 1,
                    };

                    _context.BillingFiles.Add(billingFileToAdd);
                    _context.SaveChanges();

                    var absolutePath = _documentHelper.PrependDocsPath(billingFileToAdd.FilePath);

                    var metaData = _context.EdiMetaDatas.OrderByDescending(data => data.Id).FirstOrDefault();

                    // Grabs the ISA15 Usage Indicator based on Environment {Prod = "P", Test = "T"}
                    var envUsageIndicator = _configuration["EdiUsageIndicator"];

                    if (schedule.IsReversal)
                    {
                        var groupedDistricts = claims.Select(x => x.ClaimsStudent.ClaimsDistrict)
                          .GroupBy(d => new { d.IdentificationCode, d.DistrictOrganizationName, d.Address, d.City, d.State, d.PostalCode, d.EmployerId })
                          .ToList();

                        var districts = groupedDistricts.Select(gd => new ReversalClaimsDistrictDTO()
                        {
                            IdentificationCode = gd.First().IdentificationCode,
                            DistrictOrganizationName = gd.First().DistrictOrganizationName,
                            Address = gd.First().Address,
                            City = gd.First().City,
                            State = gd.First().State,
                            PostalCode = gd.First().PostalCode,
                            EmployerId = gd.First().EmployerId,
                            ClaimsDistrictIds = gd.Select(x => x.Id).Distinct().ToList(),
                        }).ToList();


                        var groupedStudents = claims.Select(x => x.ClaimsStudent)
                          .GroupBy(s => new { s.LastName, s.FirstName, s.IdentificationCode, s.Address, s.City, s.State, s.PostalCode, s.InsuredDateTimePeriod})
                          .ToList();

                        var students = groupedStudents.Select(gs => new ReversalClaimsStudentDTO()
                        {
                            LastName = gs.First().LastName,
                            FirstName = gs.First().FirstName,
                            IdentificationCode = gs.First().IdentificationCode,
                            Address = gs.First().Address,
                            City = gs.First().City,
                            State = gs.First().State,
                            PostalCode = gs.First().PostalCode,
                            InsuredDateTimePeriod = gs.First().InsuredDateTimePeriod,
                            ClaimsDistrictIds = gs.Select(x => x.ClaimsDistrictId).Distinct().ToList(),
                            ClaimsStudentIds = gs.Select(x => x.Id).Distinct().ToList(),
                        }).ToList();

                        ReversedClaimFileGenerator.GenerateReversed837P(envUsageIndicator, billingFileToAdd, absolutePath, metaData, districts, students, claims.ToArray());
                    }
                    else
                    {
                        var districts = claims.Select(x => x.ClaimsStudent.ClaimsDistrict).Distinct().ToList();
                        var students = claims.Select(x => x.ClaimsStudent).Distinct().ToList();

                        HealthCareClaimFileGenerator.Generate837P(envUsageIndicator, billingFileToAdd, absolutePath, metaData, districts, students, claims.ToArray());
                    }
                    fileCount++;
                    // Reset variables for new file generation
                    currentClaimsCount = 0;
                    claims = new List<ClaimsEncounter>();
                }
            }

            newClaim.PageCount = fileCount;
            _context.SaveChanges();
        }

        public void GenerateScheduledBillingSchedules()
        {
            // Grab all schedules that have scheduled date of today
            // And have not been processed in this billing job cycle
            // Mark them as InQueue
            List<BillingSchedule> schedulesToday = _context.BillingSchedules.Where(x =>
                DbFunctions.TruncateTime(x.ScheduledDate) == DbFunctions.TruncateTime(DateTime.UtcNow)
                && !x.InQueue && !x.Archived
                && !x.JobsAudits.Any(j => DbFunctions.TruncateTime(j.StartDate) == DbFunctions.TruncateTime(x.ScheduledDate)))
            .ToList();

            foreach (BillingSchedule schedule in schedulesToday)
            {
                schedule.InQueue = true;
            }
            _context.SaveChanges();

            // Check if there are more schedules to process compared to hours left in the job
            List<BillingSchedule> schedules = _context.BillingSchedules.Where(x => x.InQueue && !x.Archived).ToList();
            int currentHour = DateTime.UtcNow.Hour;
            // Get hour in EST
            currentHour -= 5;
            if(currentHour < 0) {
                currentHour = 24 + currentHour; // if it's in the early AM UTC it's night EST
            }

            // How many hours left from current time until 5am EST/ 10am UTC
            int hoursRemaining = currentHour > 5 ? 29 - currentHour : 5 - currentHour;
            const int entriesPerHour = 4;

            int maxRemainingEntries = hoursRemaining * entriesPerHour;

            int take = entriesPerHour;

            if(schedules.Count > maxRemainingEntries) {
                take += 1; // When there are more entries than we're scheduled to run, try and fit more per hour
            }

            foreach (BillingSchedule billingSchedule in schedules.Take(take))
            {
                int newClaimId = GenerateHealthCareClaim(billingSchedule.Id, 1);
                billingSchedule.InQueue = false;
                if (billingSchedule.IsSchedule)
                {
                    DateTime date = billingSchedule.ScheduledDate;
                    if (billingSchedule.ScheduledDate.Day > 28)
                    {
                        // Set schedule date to end of next month
                        billingSchedule.ScheduledDate = new DateTime(date.Year, date.Month + 1, DateTime.DaysInMonth(date.Year, date.Month + 1));
                    }
                    else
                    {
                        billingSchedule.ScheduledDate = date.AddMonths(1);
                    }
                }
                _context.SaveChanges();
                if (newClaimId > 0)
                {
                    SuccessNotification(newClaimId);
                }
            }
        }

        private void SuccessNotification(int newClaimId)
        {
            var newClaim = _context.HealthCareClaims.Include(x => x.BillingFiles).FirstOrDefault(claim => claim.Id == newClaimId);
            var adminNotifications = _context.BillingScheduleAdminNotifications
                   .Include(bill => bill.Admin)
                   .Where(bill => bill.BillingScheduleId == newClaim.BillingScheduleId);

            if (newClaim.BillingFiles.Any())
            {
                foreach (var admin in adminNotifications)
                {
                    if (admin != null && admin.Admin.Email != null)
                    {
                        _emailHelper.SendEmail(new Utilities.Models.EmailParams()
                        {
                            From = _configurationSettings.GetDefaultEmailFrom(),
                            To = admin.Admin.Email,
                            Subject = "HealthCareClaim 837 Generated",
                            Body = "HealthCareClaimId: " + newClaim.Id + Environment.NewLine +
                                "File: " + newClaim.BillingFiles.FirstOrDefault().Name,
                            IsHtml = false
                        });
                    }
                }
            }
        }

        public void DiscardBillingSchedule(int newClaimId, int billingScheduleId, Exception error)
        {
            // Log error time
            var log = new ConsoleJobLog
            {
                ConsoleJobTypeId = (int)ConsoleJobTypes.BILLING_SCHEDULE,
                Date = DateTime.Now,
                RelatedEntityId = billingScheduleId,
                StackTrace = error.StackTrace,
                ErrorMessage = error.Message,
                IsError = true,
            };


            if (newClaimId > 0)
            {
                var encountersToRemove = _context.HealthCareClaims.FirstOrDefault(claim => claim.Id == newClaimId).ClaimsDistricts?.SelectMany(district => district.ClaimsStudents).SelectMany(student => student.ClaimsEncounters);

                foreach (var claimsEncounter in encountersToRemove)
                {
                    var encounterStudent = _context.EncounterStudents.FirstOrDefault(es => es.Id == claimsEncounter.EncounterStudentId);


                    encounterStudent.EncounterStatusId = (int)EncounterStatuses.READY_FOR_BILLING;
                    _context.EncounterStudentStatus.Add(UpdateEncounterStudentStatusLog(encounterStudent.EncounterStatusId, encounterStudent.Id, 1));
                    _context.EncounterStudents.Attach(encounterStudent);
                    _context.SetEntityState(encounterStudent, EntityState.Modified);

                    var aggregates = _context.ClaimsEncounters.Where(ce => ce.AggregateId == claimsEncounter.EncounterStudentCptCodeId).Select(ce => ce.EncounterStudent);

                    foreach (var aggregate in aggregates)
                    {
                        aggregate.EncounterStatusId = encounterStudent.EncounterStatusId;
                        _context.EncounterStudentStatus.Add(UpdateEncounterStudentStatusLog(aggregate.EncounterStatusId, aggregate.Id, 1));
                        _context.EncounterStudents.Attach(aggregate);
                        _context.SetEntityState(aggregate, EntityState.Modified);
                    }
                }

                _context.ClaimsEncounters.RemoveRange(encountersToRemove);

                var studentsToRemove = _context.HealthCareClaims.FirstOrDefault(claim => claim.Id == newClaimId).ClaimsDistricts?.SelectMany(district => district.ClaimsStudents);
                _context.ClaimsStudents.RemoveRange(studentsToRemove);

                var districtsToRemove = _context.HealthCareClaims.FirstOrDefault(claim => claim.Id == newClaimId).ClaimsDistricts;
                _context.ClaimsDistricts.RemoveRange(districtsToRemove);
            }
            _context.ConsoleJobLogs.Add(log);
            _context.SaveChanges();

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _configurationSettings.GetDefaultEmailFrom(),
                To = _configuration["SystemErrorEmails"],
                Subject = "Billing Schedule Error",
                Body = "Billing Schedule Id: " + billingScheduleId + Environment.NewLine +
                        "HealthCareClaimId: " + newClaimId + Environment.NewLine +
                        "Message: " + error.Message + Environment.NewLine +
                        "Inner Exception: " + error.InnerException + Environment.NewLine +
                        "Stack Trace: " + error.StackTrace.ToString(),
                IsHtml = false
            });

        }

        public int ArchiveBillingSchedule(int id)
        {
            var billingSchedule = _context.BillingSchedules.FirstOrDefault(billSchedule => billSchedule.Id == id);
            ThrowIfNull(billingSchedule);
            billingSchedule.Archived = true;
            _context.SaveChanges();
            return id;
        }

    }
}
