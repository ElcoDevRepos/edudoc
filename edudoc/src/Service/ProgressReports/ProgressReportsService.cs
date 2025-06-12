using Microsoft.AspNetCore.Http;
using Model;
using Model.Custom;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Timers;
using System.Web;

namespace Service.ProgressReports
{
    public class ProgressReportsService : BaseService, IProgressReportsService
    {
        private readonly IPrimaryContext _context;

        public ProgressReportsService(IPrimaryContext context) : base(context)
        {
            _context = context;
        }

            enum PendingOrCompleted {
                Pending = 1,
                Completed = 2
            }

        public ProgressReportSearch GetProgressReportsForList(CRUDSearchParams<Student> csp, int userId)
        {
            var extraparams = HttpUtility.ParseQueryString(csp.extraparams);

            var pendingOrCompleted = PendingOrCompleted.Pending;
            var pendingOrCompletedString = extraparams.Get("PendingOrCompleted");
            if(!string.IsNullOrWhiteSpace(pendingOrCompletedString)) {
                pendingOrCompleted = (PendingOrCompleted)int.Parse(pendingOrCompletedString);
            }

            var studentIdsString = extraparams.Get("StudentId");
            IEnumerable<int> studentIds = null;
            if(!string.IsNullOrWhiteSpace(studentIdsString)) {
                studentIds = studentIdsString.Split(',').Select(id => int.Parse(id));
            }

            return GetProgressReportsForList(userId, pendingOrCompleted, csp.skip, csp.take, studentIds);
        }

        private ProgressReportSearch GetProgressReportsForList(
            int userId,
            PendingOrCompleted pendingOrCompleted,
            int? skip,
            int? take,
            IEnumerable<int> studentIds = null
        )
        {
            var schoolDistrictIdsAndDates = _context
                .Providers.Where(p => p.ProviderUserId == userId)
                .Select(p =>
                    p.ProviderEscAssignments.Where(a =>
                            !a.Archived && (a.EndDate == null || a.EndDate >= DateTime.Now)
                        )
                        .SelectMany(a =>
                            a.ProviderEscSchoolDistricts.Select(sd => new
                            {
                                sd.SchoolDistrict.Id,
                                DistrictProgressReportDates = sd.SchoolDistrict.DistrictProgressReportDates.FirstOrDefault(),
                            })
                        )
                )
                .AsNoTracking()
                .FirstOrDefault()
                .DistinctBy(d => d.Id)
                .Select(idAndDates => {
                    if(idAndDates.DistrictProgressReportDates == null) {
                        return new {
                            idAndDates.Id,
                            // This district might be from before we made district dates required. If so we have to create them
                            DistrictProgressReportDates = GetOrCreateDistrictProgressReportDate(idAndDates.Id)
                        };
                    }
                    return idAndDates;
                })
                .ToList();

            var schoolDistrictIds = schoolDistrictIdsAndDates.Select(sd => sd.Id).ToList();

            var providerData = Context
                .Providers.Where(p => p.ProviderUserId == userId)
                .Select(p => new { p.ProviderTitle.ServiceCodeId, ProviderId = p.Id })
                .First();

            var studentsBase = _context.Students.AsQueryable();
            if (studentIds != null && studentIds.Any())
            {
                studentsBase = studentsBase.Where(s => studentIds.Contains(s.Id));
            }
            var studentsQuery = studentsBase
                .Where(s =>
                    (
                        s.ProviderStudents.Any(ps => ps.Provider.ProviderUserId == userId)
                        || s.ProviderStudentSupervisors.Any(s =>
                            s.Supervisor.ProviderUserId == userId
                        )
                        || s.ProviderStudentHistories.Any(psh =>
                            psh.Provider.ProviderUserId == userId
                            && psh.DateArchived > s.SchoolDistrict.DistrictProgressReportDates.FirstOrDefault().FirstQuarterStartDate
                        )
                    )
                    && schoolDistrictIds.Contains(s.DistrictId ?? 0)
                    && !s.Archived
                    && s.CaseLoads.Any(cl =>
                        cl.StudentTypeId == (int)StudentTypes.IEP && !cl.Archived
                    )
                )
                .Select(s => new
                {
                    Id = s.Id,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    DistrictId = s.DistrictId,
                    StartOfSchoolYear = s.SchoolDistrict.DistrictProgressReportDates.FirstOrDefault().FirstQuarterStartDate,
                    EncounterStudentDates = s
                        .EncounterStudents.Where(es =>
                            !es.Archived
                            && es.EncounterStatusId != (int)EncounterStatuses.Abandoned
                            && es.Encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy
                            && es.ESignedById != null
                            && (
                                es.Encounter.ProviderId == providerData.ProviderId
                                || s.ProviderStudentSupervisors.Any(pss =>
                                    pss.Assistant.ProviderUserId == es.ESignedById
                                    && pss.SupervisorId == providerData.ProviderId
                                    && pss.EffectiveStartDate <= es.EncounterDate
                                    && (pss.EffectiveEndDate == null || pss.EffectiveEndDate >= es.EncounterDate)
                                )
                            )
                            && es.EncounterDate >= s.SchoolDistrict.DistrictProgressReportDates.FirstOrDefault().FirstQuarterStartDate
                            && es.StudentDeviationReasonId == null
                        )
                        .Select(es => es.EncounterDate),
                    SupervisorId = s
                        .ProviderStudentSupervisors.Where(pss =>
                            pss.SupervisorId == providerData.ProviderId
                        )
                        .Select(pss => pss.SupervisorId)
                        .FirstOrDefault(),
                })
                .Where(s => s.EncounterStudentDates.Any()).OrderBy(s => s.LastName).ThenBy(s => s.FirstName).AsQueryable();

            var count = studentsQuery.Count();
            if(take.HasValue && take > 0) {
                studentsQuery = studentsQuery.Skip(skip ?? 0).Take(take.Value);
            } else {
                // This improves the performance by TEN TIMES.
                // Even just setting the take to 100 makes it infinitely faster than leaving it blank
                // in a situation where there are only 7 records. (????)
                studentsQuery = studentsQuery.Take(count);
            }

            var students = studentsQuery
                .AsNoTracking()
                .ToList();


            studentIds = students.Select(s => s.Id);

            var progressReports = Context
                .ProgressReports.Where(pr =>
                    studentIds.Contains(pr.StudentId) &&
                    pr.CreatedBy.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ServiceCodeId == providerData.ServiceCodeId
                )
                .AsNoTracking()
                .ToList();

            var prsByStudent = progressReports.ToLookup(pr => pr.StudentId);

            var districtDatesById = schoolDistrictIdsAndDates.ToDictionary(
                sd => sd.Id,
                sd => new List<DateTime>
                {
                    sd.DistrictProgressReportDates.FirstQuarterStartDate,
                    sd.DistrictProgressReportDates.SecondQuarterStartDate,
                    sd.DistrictProgressReportDates.ThirdQuarterStartDate,
                    sd.DistrictProgressReportDates.FourthQuarterStartDate,
                }
            );

            var studentsWithPRs = students.Select(s => new
            {
                Student = s,
                Quarters = s
                    .EncounterStudentDates.Select(d =>
                        districtDatesById[s.DistrictId.Value]
                            .FindLastIndex(quarterDate => d >= quarterDate)
                        + 1 // Frontend is expecting an offset by one.
                    )
                    .ToHashSet(),
                OldProgressReports = progressReports.Where(pr =>
                    pr.StudentId == s.Id && pr.EndDate < s.StartOfSchoolYear
                ),
                CurrentProgressReports = progressReports.Where(pr =>
                    pr.StudentId == s.Id && pr.EndDate >= s.StartOfSchoolYear
                ),
            });


            if (pendingOrCompleted == PendingOrCompleted.Pending)
            {
                studentsWithPRs = studentsWithPRs.Where(s =>
                    s.Quarters.Any(q => !s.CurrentProgressReports.Any(pr => pr.Quarter.HasValue && pr.Quarter.Value == q))
                );
            }
            else
            {
                studentsWithPRs = studentsWithPRs.Where(s =>
                    s.Quarters.Any(q => s.CurrentProgressReports.Any(pr => pr.Quarter.HasValue && pr.Quarter.Value == q))
                );
            }

            return new ProgressReportSearch
            {
                Count = count,
                ProgressReports = studentsWithPRs.Select(student => new ProgressReportDto
                {
                    FirstName = student.Student.FirstName,
                    LastName = student.Student.LastName,
                    DateRanges = schoolDistrictIdsAndDates
                        .First(sd => sd.Id == student.Student.DistrictId)
                        .DistrictProgressReportDates,
                    StudentId = student.Student.Id,
                    ProgressReports = student.CurrentProgressReports,
                    FirstQuarterProgressReports = student.CurrentProgressReports.Where(pr =>
                        pr.Quarter == (int)Quarters.First
                    ),
                    SecondQuarterProgressReports = student.CurrentProgressReports.Where(pr =>
                        pr.Quarter == (int)Quarters.Second
                    ),
                    ThirdQuarterProgressReports = student.CurrentProgressReports.Where(pr =>
                        pr.Quarter == (int)Quarters.Third
                    ),
                    FourthQuarterProgressReports = student.CurrentProgressReports.Where(pr =>
                        pr.Quarter == (int)Quarters.Fourth
                    ),
                    Quarters = student.Quarters,
                    PreviousProgressReports = student.OldProgressReports,
                    SupervisorId = student.Student.SupervisorId,
                }),
            };

        }

        public DistrictProgressReportDate GetOrCreateDistrictProgressReportDate(int districtId)
        {
            var existing = _context.DistrictProgressReportDates.FirstOrDefault(d => d.DistrictId == districtId);
            if (existing != null)
            {
                return existing;
            }
            else
            {
                var report = _context.DistrictProgressReportDates.Add(new DistrictProgressReportDate { DistrictId = districtId
                 });
                _context.SaveChanges();

                return report;
            }
        }

        public DistrictProgressReportDate GetDistrictProgressReportDateByDistrictId(int districtId)
        {
            return _context.DistrictProgressReportDates.FirstOrDefault(d => d.DistrictId == districtId);
        }

        public int GetLateProgressReportsCount(int userId)
        {
            var reports = GetProgressReportsForList(userId, PendingOrCompleted.Pending, null, null).ProgressReports;
            return reports.Sum(r => {
                var currentDate = DateTime.Now;
                var previousQuarter = 0;
                if(currentDate > r.DateRanges.ThirdQuarterEndDate) {
                    previousQuarter = 3;
                } else if(currentDate > r.DateRanges.SecondQuarterEndDate) {
                    previousQuarter = 2;
                } else if(currentDate > r.DateRanges.FirstQuarterEndDate) {
                    previousQuarter = 1;
                } else {
                    previousQuarter = 0;
                }
                var lateQuartersWithEncounters = r.Quarters.Where(q => q <= previousQuarter);
                var lateQuartersWithoutProgressReports = lateQuartersWithEncounters.Where(q => !r.ProgressReports.Any(pr => pr.Quarter == q));
                return lateQuartersWithoutProgressReports.Count();
            });
        }

        public IEnumerable<ProgressReportCaseNotesDto> GetProgressReportCaseNotes(int studentId, int userId, Model.Core.CRUDSearchParams csp)
        {

            var baseQuery = _context.EncounterStudents
                .Where(es => es.StudentId == studentId
                            && es.EncounterDate >= es.Student.SchoolDistrict.DistrictProgressReportDates.FirstOrDefault().FirstQuarterStartDate
                    && !es.Archived && !es.Encounter.Archived
                    && es.EncounterStatusId != (int)EncounterStatuses.DEVIATED && es.EncounterStatusId != (int)EncounterStatuses.Abandoned
                    );


            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                // filter by providerId if present
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["ProviderId"] != null)
                {
                    var providerId = int.Parse(extras["ProviderId"]);
                    baseQuery = baseQuery.Where(es => es.Encounter.ProviderId == providerId);
                }
                else
                {
                    baseQuery = baseQuery.Where(es => es.Encounter.Provider.ProviderUserId == userId);
                }
                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) <= DbFunctions.TruncateTime(endDate));
                }
            }
            return baseQuery.Select(es => new ProgressReportCaseNotesDto
            {
                Date = es.EncounterDate,
                Notes = es.StudentDeviationReason != null ? "Deviated - " + es.StudentDeviationReason.Name : (es.TherapyCaseNotes.Length > 0 ? es.TherapyCaseNotes : "N/A"),
            }).OrderBy(e => e.Date).AsEnumerable();
        }


        public IEnumerable<ProgressReport> GetForProviderStudentAndQuarter(int providerUserId, int studentId, int quarter) {
            var providerServiceAreaId = _context.Providers.Where(p => p.ProviderUserId == providerUserId).Select(p => p.ProviderTitle.ServiceCodeId).FirstOrDefault();

            var progressReports = _context.ProgressReports
            .Include(pr => pr.ESignedBy.Providers_ProviderUserId.Select(u => u.ProviderTitle))
            .Include(pr => pr.SupervisorESignedBy.Providers_ProviderUserId.Select(u => u.ProviderTitle))
            .Where(pr => pr.Quarter == quarter
            && pr.StudentId == studentId
            && (pr.CreatedById == providerUserId
                        || pr.CreatedBy.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ServiceCodeId == providerServiceAreaId
                        || pr.Student.ProviderStudentSupervisors.Any(ps => ps.Assistant.ProviderUserId == pr.CreatedById &&
                            ps.Supervisor.ProviderUserId == providerUserId))
            );

            return progressReports.ToList();
        }
        public ProgressReportPermissionsData GetProgressReportPermissions(int userId)
        {
            return _context
                .Providers.Where(p => p.ProviderUserId == userId)
                .Select(p => new ProgressReportPermissionsData
                {
                    CanCosignProgressReports = p.ProviderTitle.ServiceCode.CanCosignProgressReports,
                    CanHaveMultipleProgressReportsPerStudent = p.ProviderTitle.ServiceCode.CanHaveMultipleProgressReportsPerStudent
                })
                .FirstOrDefault();
        }
    }
}

