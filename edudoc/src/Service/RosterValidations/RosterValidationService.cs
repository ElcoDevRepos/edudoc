using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Custom;
using Model.Enums;
using Service.Base;
using Service.EDIGenerators;
using Service.Students;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using API;
using DocumentFormat.OpenXml.InkML;

namespace Service.RosterValidations
{
    public class RosterValidationService : CRUDBaseService, IRosterValidationService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly IDocumentHelper _documentHelper;



        public RosterValidationService(IPrimaryContext context,
                                      IEmailHelper emailHelper,
                                      IConfigurationSettings configurationSettings,
                                      IConfiguration configuration,
                                      IDocumentHelper documentHelper
                                      ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _emailHelper = emailHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _documentHelper = documentHelper;
        }

        public async Task<bool> GenerateRosterValidation(int userId)
        {
            var newValidationId = 0;
            try
            {
                var startTime = DateTime.UtcNow;

                var rosterValidationJobToAdd = new JobsAudit()
                {
                    StartDate = startTime,
                    CreatedById = userId,
                    FileType = 270,
                };

                _context.JobsAudits.Add(rosterValidationJobToAdd);

                newValidationId = ProcessRosterValidation();

                var newValidation = _context.RosterValidations
                                        .Include(x => x.RosterValidationDistricts)
                                        .Include(x => x.RosterValidationDistricts.Select(y => y.RosterValidationStudents))
                                        .FirstOrDefault(x => x.Id == newValidationId);
                if (newValidation == null)
                    return true;

                await Task.Run(() => GenerateRosterValidationFiles(newValidation, userId));

                rosterValidationJobToAdd.EndDate = DateTime.UtcNow;
                _context.SaveChanges();

                return true;
            }
            catch (Exception e)
            {
                DiscardRosterValidation(newValidationId, e);
                return true;
            }

        }

        private void GenerateRosterValidationFiles(RosterValidation newValidation, int userId)
        {
            var today = DateTime.UtcNow;

            int chunkCount = GetChunk(newValidation);
            List<RosterValidationStudent[]> chunkedStudents = newValidation.RosterValidationDistricts.SelectMany(district => district.RosterValidationStudents).Chunk(chunkCount).ToList();

            foreach (var (chunk, chunkIndex) in chunkedStudents.WithIndex())
            {
                var districts = chunk.Select(x => x.RosterValidationDistrict).Distinct().ToList();

                var rosterValidationFileToAdd = new RosterValidationFile()
                {
                    RosterValidationId = newValidation.Id,
                    Name = $"HPC270Upload_{today.Month}_{today.Day}_{today.Year}_PG{chunkIndex + 1}",
                    DateCreated = today,
                    CreatedById = userId,
                    FilePath = $"HPC270Upload_{today.Month}_{today.Day}_{today.Year}_PG{chunkIndex + 1}.270",
                };

                _context.RosterValidationFiles.Add(rosterValidationFileToAdd);
                _context.SaveChanges();

                var absolutePath = _documentHelper.PrependDocsPath(rosterValidationFileToAdd.FilePath);

                var metaData = _context.EdiMetaDatas.OrderByDescending(data => data.Id).FirstOrDefault();

                // Grabs the ISA15 Usage Indicator based on Environment {Prod = "P", Test = "T"}
                var envUsageIndicator = _configuration["EdiUsageIndicator"];

                RosterValidationFileGenerator.Generate270(envUsageIndicator, rosterValidationFileToAdd, absolutePath, metaData, districts, chunk);

                _context.SaveChanges();
            }

            newValidation.PageCount = chunkedStudents.Count;
            _context.RosterValidations.Attach(newValidation);
            _context.SetEntityState(newValidation, EntityState.Modified);
            _context.SaveChanges();
        }

        private int GetChunk(RosterValidation validation)
        {
            // Limit file lines to 3000
            // Calculate how many students to chunk based on number of districts and fixed lines at top and bottom of 270 file
            int districtCount = validation.RosterValidationDistricts.Count;
            int maxLineCount = 3000;
            int topLineCount = 7;
            int bottomLineCount = 1;
            int districtLineCount = 4;
            int studentLineCount = 6;
            return (maxLineCount - topLineCount - bottomLineCount - (districtCount * districtLineCount)) / studentLineCount;
        }

        private void DiscardRosterValidation(int newValidationId, Exception error)
        {
            var studentValidationsToRemove = _context.RosterValidations.FirstOrDefault(validation => validation.Id == newValidationId).RosterValidationDistricts.SelectMany(district => district.RosterValidationStudents);
            _context.RosterValidationStudents.RemoveRange(studentValidationsToRemove);
            _context.SaveChanges();

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _configurationSettings.GetDefaultEmailFrom(),
                To = _configuration["SystemErrorEmails"],
                Subject = "Roster Validation Error",
                Body = "RosterValidationId: " + newValidationId + Environment.NewLine +
                        "Message: " + error.Message + Environment.NewLine +
                        "Stack Trace: " + error.StackTrace.ToString(),
                IsHtml = false
            });

        }


        private int ProcessRosterValidation()
            {

                var newValidation = new RosterValidation
                {
                    DateCreated = DateTime.UtcNow,
                };

            var rosterValidationDistricts = GenerateRosterValidationDistricts(newValidation);

            var rosterValidationStudents = GenerateRosterValidationStudents(rosterValidationDistricts);

            if (!rosterValidationStudents.Any()) return 0;

            _context.Configuration.AutoDetectChangesEnabled = false;
            _context.Configuration.ValidateOnSaveEnabled = false;
            using (var dbContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {

                    Console.WriteLine("-----Bulk Inserting Data-----");

                    _context.RosterValidations.Add(newValidation);
                    _context.SaveChanges();

                    var RosterValidationDistrictsData = CommonFunctions.ToDataTable(rosterValidationDistricts.Select((x, i) => new
                                                                                {
                                                                                    IdentificationCode = x.IdentificationCode,
                                                                                    DistrictOrganizationName = x.DistrictOrganizationName,
                                                                                    Address = x.Address,
                                                                                    City = x.City,
                                                                                    State = x.State,
                                                                                    PostalCode = x.PostalCode,
                                                                                    EmployerId = x.EmployerId,
                                                                                    Index = x.Index,
                                                                                    RosterValidationsId = x.RosterValidation.Id,
                                                                                    SchoolDistrictId = x.SchoolDistrictId,
                                                                                    BulkIndex = i,
                    }).ToList());

                    var sqlParameter = new SqlParameter("@RosterValidationDistrictsData", RosterValidationDistrictsData);
                    sqlParameter.SqlDbType = SqlDbType.Structured;
                    sqlParameter.TypeName = "dbo.RosterValidationDistrictData";
                    var execString = "EXEC dbo.SP_Bulk_Insert_RosterValidationDistricts @RosterValidationDistrictsData;";

                    var rosterValidationDistrictsResults = _context.Database.SqlQuery<SpResults>(execString, sqlParameter).ToList();

                    rosterValidationDistrictsResults = rosterValidationDistrictsResults.OrderBy(x => x.InsertedId).ToList();

                    foreach (var (district, districtIndex) in rosterValidationDistricts.WithIndex())
                    {
                        district.Id = rosterValidationDistrictsResults[districtIndex].InsertedId;
                    }


                    foreach (var student in rosterValidationStudents)
                    {
                        student.RosterValidationDistrictId = student.RosterValidationDistrict.Id;
                    }

                var rosterValidationStudentsData = CommonFunctions.ToDataTable(rosterValidationStudents.Select((x, i) => new
                                                                                {
                                                                                    IdentificationCode = x.IdentificationCode,
                                                                                    ReferenceId = x.ReferenceId,
                                                                                    LastName = x.LastName,
                                                                                    FirstName = x.FirstName,
                                                                                    Address = x.Address,
                                                                                    City = x.City,
                                                                                    State = x.State,
                                                                                    PostalCode = x.PostalCode,
                                                                                    InsuredDateTimePeriod = x.InsuredDateTimePeriod,
                                                                                    RosterValidationDistrictId = x.RosterValidationDistrictId,
                                                                                    StudentId = x.Student.Id,
                                                                                    BulkIndex = i
                                                                                }).ToList());

                    sqlParameter = new SqlParameter("@RosterValidationStudentsData", rosterValidationStudentsData);
                    sqlParameter.SqlDbType = SqlDbType.Structured;
                    sqlParameter.TypeName = "dbo.RosterValidationStudentData";
                    execString = "EXEC dbo.SP_Bulk_Insert_RosterValidationStudents @RosterValidationStudentsData;";

                    var rosterValidationStudentsResults = _context.Database.SqlQuery<SpResults>(execString, sqlParameter).ToList();

                    rosterValidationStudentsResults = rosterValidationStudentsResults.OrderBy(x => x.InsertedId).ToList();

                    foreach (var (student, studentIndex) in rosterValidationStudents.WithIndex())
                    {
                        student.Id = rosterValidationStudentsResults[studentIndex].InsertedId;
                    }

                   
                    Console.WriteLine("-----Bulk Inserting Data (DONE) -----");

                    dbContextTransaction.Commit();

                    return newValidation.Id;

                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    Console.WriteLine($"Error occurred: {ex}");

                    _emailHelper.SendEmail(new Utilities.Models.EmailParams()
                    {
                        From = _configurationSettings.GetDefaultEmailFrom(),
                        To = _configuration["SystemErrorEmails"],
                        Subject = "RosterValidation Data Error",
                        Body = "RosterValidationId: " + newValidation.Id + Environment.NewLine +
                                "Message: " + ex.Message + Environment.NewLine +
                                "Inner Exception: " + ex.InnerException.Message + Environment.NewLine +
                                "Stack Trace: " + ex.StackTrace.ToString(),
                        IsHtml = false
                    });

                    return 0;
                }
            }

        }

        private IQueryable<RosterValidationDistrict> GenerateRosterValidationDistricts(RosterValidation newValidation)
        {
            var yearAgo = DateTime.UtcNow.AddYears(-1).Date;

            // List of active school districts to exclude when generating 270 files
            var excludedDistricts = new List<int> {
                303, // Carroll High School
                290, // Cedar Cliff Local Schools
                283, // DECA Prep
                285, // Friends Preschool
                278, // HPC ERROR TESTING DISTRICT
                136, // HPC TEST DISTRICT ONE
                173, // HPC TERST DISTRICT TWO
                309, // Legacy Christian Academy
                284, // Miami Valley School
                262, // NPESC _ DISTRICT NOT WITH HPC
                292, // St. Brigid - Xenia
                293, // St Luke - Beavercreek
                291, // Yellow Springs Schools
            };

            var districts = _context.SchoolDistricts
                .Where(sd => !excludedDistricts.Contains(sd.Id) && sd.ActiveStatus)
                .Include(x => x.Address)
                .Where(x => x.Students.Any(s => (s.MedicaidNo == null || s.MedicaidNo.Length < 12) &&
                    s.EncounterStudents.Any(es => es.EncounterDate > yearAgo) && !s.Archived) &&
                    !x.Archived);

            var rosterValidationDistrictsToAdd = new List<RosterValidationDistrict>();
            foreach (var district in districts)
            {
                var rosterValidationDistrictToAdd = new RosterValidationDistrict
                {
                    IdentificationCode = CommonFunctions.TrimStringValue(80, CommonFunctions.PadStringValue(2, true, district.NpiNumber)),
                    DistrictOrganizationName = CommonFunctions.TrimStringValue(60, district.Name),
                    Address = district.Address != null ? CommonFunctions.TrimStringValue(55, district.Address.Address1) : "",
                    City = district.Address != null && district.Address.City.Length >= 2 ? CommonFunctions.TrimStringValue(30, CommonFunctions.PadStringValue(2, false, district.Address.City)) : "NA",
                    State = district.Address != null && district.Address.StateCode.Length >= 2 ? CommonFunctions.TrimStringValue(2, CommonFunctions.PadStringValue(2, false, district.Address.StateCode)) : "NA",
                    PostalCode = district.Address != null ? CommonFunctions.TrimStringValue(5, CommonFunctions.PadStringValue(3, true, district.Address.Zip)) : "00000",
                    EmployerId = CommonFunctions.TrimStringValue(50, district.EinNumber),
                    SchoolDistrictId = district.Id,
                    RosterValidation = newValidation,
                };

            rosterValidationDistrictsToAdd.Add(rosterValidationDistrictToAdd);
            }

            return rosterValidationDistrictsToAdd.AsQueryable();
        }

        private IQueryable<RosterValidationStudent> GenerateRosterValidationStudents(IQueryable<RosterValidationDistrict> rosterValidationDistricts)
        {
            var rosterValidationStudentsToAdd = new List<RosterValidationStudent>();
            var yearAgo = DateTime.UtcNow.AddYears(-1).Date;

            foreach (var district in rosterValidationDistricts)
            {
                var rosterValidationStudents = _context.Students.Include(x => x.Address).Distinct()
                    .Where(x => x.DistrictId == district.SchoolDistrictId && !x.Archived &&
                    (x.MedicaidNo == null || x.MedicaidNo.Length < 12) &&
                    x.EncounterStudents.Any(es => es.EncounterDate > yearAgo));

                foreach (var student in rosterValidationStudents)
                {
                    var rosterValidationStudentToAdd = new RosterValidationStudent
                    {
                        IdentificationCode = CommonFunctions.TrimStringValue(12, CommonFunctions.PadStringValue(12, true, student.MedicaidNo)),
                        ReferenceId = CommonFunctions.PadStringValue(7, true, student.Id.ToString()),
                        FirstName = CommonFunctions.TrimStringValue(35, student.FirstName),
                        LastName = CommonFunctions.TrimStringValue(60, student.LastName),
                        Address = student.Address != null ? CommonFunctions.TrimStringValue(55, student.Address.Address1) : "",
                        City = student.Address != null && student.Address.City.Length >= 2 ? CommonFunctions.TrimStringValue(30, student.Address.City) : "NA",
                        State = student.Address != null && student.Address.StateCode.Length >= 2 ? CommonFunctions.TrimStringValue(2, student.Address.StateCode) : "NA",
                        PostalCode = student.Address != null ? CommonFunctions.TrimStringValue(5, CommonFunctions.PadStringValue(3, true, student.Address.Zip)) : "00000",
                        InsuredDateTimePeriod = student.DateOfBirth.ToString("yyyyMMdd"),
                        RosterValidationDistrict = district,
                        Student = student,
                    };

                    rosterValidationStudentsToAdd.Add(rosterValidationStudentToAdd);
                }

            }

            return rosterValidationStudentsToAdd.AsQueryable();
        }

        public (IEnumerable<RosterValidationStudent> student, int count, DateTime? latestUploadDate) Get271UploadedStudents(Model.Core.CRUDSearchParams csp)
        {
            var mostRecentRosterValidation = _context.RosterValidations.OrderByDescending(roster => roster.DateCreated).FirstOrDefault(r => r.RosterValidationFiles.All(f => f.RosterValidationResponseFiles.Any()));
            var rosterValidationId = 0;
            if (mostRecentRosterValidation != null)
            {
                rosterValidationId = mostRecentRosterValidation.Id;
            }
            var cspFull = new Model.Core.CRUDSearchParams<RosterValidationStudent>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<RosterValidationStudent>
                {
                    roster => roster.Student
                }
            };

            cspFull.AddedWhereClause.Add(roster => roster.RosterValidationDistrict.RosterValidationId == rosterValidationId);

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query);
                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(d =>
                        d.LastName.StartsWith(t) ||
                        d.FirstName.StartsWith(t) ||
                        d.Student.MedicaidNo.ToString().StartsWith(t)
                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["isSuccessfullyProcessedOnly"] == "1")
                {
                    cspFull.AddedWhereClause.Add(d => d.IsSuccessfullyProcessed);
                }
            }

            cspFull.DefaultOrderBy = "FirstName";
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            var latestUploadDate = mostRecentRosterValidation?.RosterValidationFiles?.SelectMany(f => f.RosterValidationResponseFiles)?.OrderByDescending(v => v.DateUploaded).FirstOrDefault()?.DateUploaded ?? null;
            return (Search(cspFull, out int count), count, latestUploadDate);
        }
    }
}
