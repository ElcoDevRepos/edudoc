using BreckServiceBase.Utilities.Interfaces;
using Model;
using Model.Custom;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;

namespace Service.ActivitySummaries
{
    public class ActivitySummaryService : Base.CRUDBaseService, IActivitySummaryService
    {
        private readonly IPrimaryContext _context;
        public ActivitySummaryService(
            IPrimaryContext context,
            IEmailHelper emailHelper
            ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }

        public DistrictSummaryResponseDTO SearchForActivitySummaries(Model.Core.CRUDSearchParams csp)
        {
            ActivityReportFilters filter = BuildFilter(csp);

            return GetSummaries(filter, csp);
        }

        public DistrictSummaryTotalsResponseDTO SearchForActivitySummariesTotals(Model.Core.CRUDSearchParams csp)
        {
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["activitySummaryServiceAreaId"] != null && extras["activitySummaryServiceAreaId"] != "0")
                {
                    var activitySummaryServiceAreaId = int.Parse(extras["activitySummaryServiceAreaId"]);
                    var totals = _context.ActivitySummaryServiceAreas.FirstOrDefault(assa => assa.Id == activitySummaryServiceAreaId);
                    return new DistrictSummaryTotalsResponseDTO()
                    {
                        TotalPendingReferrals = totals.ReferralsPending,
                        TotalReturnedEncounters = totals.EncountersReturned,
                        TotalEncountersReadyForFinalESign = totals.PendingSupervisorCoSign,
                        TotalScheduledEncounters = totals.OpenScheduledEncounters,
                        TotalPendingEvaluations = totals.PendingEvaluations,
                    };

                } else
                {
                    throw new ArgumentNullException("activitySummaryServiceAreaId");
                }
            }
            else
            {
                throw new Exception("Missing filter data.");
            }

        }

        private ActivityReportFilters BuildFilter(Model.Core.CRUDSearchParams csp)
        {
            ActivityReportFilters filter = new ActivityReportFilters();

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));


                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    filter.districtId = int.Parse(extras["districtId"]);
                }

                if (extras["serviceAreaId"] != null && extras["serviceAreaId"] != "0")
                {
                    filter.serviceAreaId = int.Parse(extras["serviceAreaId"]);
                }

                if (extras["providerId"] != null && extras["providerId"] != "0")
                {
                    filter.providerId = int.Parse(extras["providerId"]);
                }

                if (extras["studentId"] != null && extras["studentId"] != "0")
                {
                    filter.studentId = int.Parse(extras["studentId"]);
                }

                if (extras["serviceTypeId"] != null && extras["serviceTypeId"] != "0")
                {
                    filter.serviceTypeId = int.Parse(extras["serviceTypeId"]);
                }

                if (extras["month"] != null && extras["year"] != null)
                {
                    filter.month = int.Parse(extras["month"]);
                    filter.year = int.Parse(extras["year"]);
                    filter.monthSelected = true;
                }

                if (extras["startDate"] != null)
                {
                    filter.startDate = DateTime.Parse(extras["startDate"]);
                }

                if (extras["endDate"] != null)
                {
                    filter.endDate = DateTime.Parse(extras["endDate"]);
                }

                if (extras["isAdmin"] != null && extras["isAdmin"] != "0")
                {
                    filter.isAdmin = true;
                }

                if (extras["isCompleted"] != null && extras["isCompleted"] == "1")
                {
                    filter.isCompleted = true;
                }
            }

            return filter;
        }

        private DistrictSummaryResponseDTO GetSummaries(ActivityReportFilters filter, Model.Core.CRUDSearchParams csp)
        {

            IActivitySummaryLibrary library;
            (IEnumerable<DistrictSummaryDTO> data, int count) summaries;
            if (filter.districtId == 0)
            {
                library = new ByDistrictLibrary(_context);
                summaries = GetDistrictSummaries(library, filter, csp);
            }
            else if (filter.serviceAreaId > 0 || filter.providerId > 0)
            {
                library = new ByProviderLibrary(_context);
                summaries = GetProviderSummaries(library, filter, csp);
            }
            else
            {
                library = new ByServiceAreaLibrary(_context);
                summaries = GetServiceAreaSummaries(library, filter, csp);
            }

            var summaryResponse = new DistrictSummaryResponseDTO()
            {
                Summaries = summaries.data,
                Total = summaries.count,
            };

            return summaryResponse;
        }

        private DistrictSummaryTotalsResponseDTO GetSummaryTotals(ActivityReportFilters filter, Model.Core.CRUDSearchParams csp)
        {
            IActivitySummaryLibrary library;
            if (filter.serviceAreaId > 0 || (filter.providerId > 0 && filter.districtId == 0))
            {
                // Get totals by each service area
                library = new ByServiceAreaLibrary(_context);
            }
            else if (filter.providerId > 0)
            {
                library = new ByProviderLibrary(_context);
            }
            else
            {
                // Get totals by each district
                library = new ByDistrictLibrary(_context);
            }

            if (filter.providerId > 0)
            {
                return GetStudentSummaryTotals(library, filter);
            }
            else if (filter.serviceAreaId > 0)
            {
                return GetProviderSummaryTotals(library, filter);
            }
            else if (filter.districtId != 0 && filter.serviceAreaId == 0)
            {
                return GetServiceAreaSummaryTotals(library, filter);
            }
            else
            {
                return GetDistrictSummaryTotals();
            }

        }

        #region By District
        private (IEnumerable<DistrictSummaryDTO> data, int count) GetDistrictSummaries(IActivitySummaryLibrary library, ActivityReportFilters filter, Model.Core.CRUDSearchParams csp)
        {
            var query = _context.SchoolDistricts.Where(sd => !sd.Archived);
            var data = Enumerable.Empty<SchoolDistrict>();
            if (csp.take.GetValueOrDefault() > 0)
            {
                data = query
                    .OrderBy(ds => ds.Name)
                    .Skip(csp.skip.GetValueOrDefault())
                    .Take(csp.take.GetValueOrDefault())
                    .AsNoTracking()
                    .AsEnumerable();
            }
            else
            {
                data = query.OrderBy(ds => ds.Name).AsNoTracking().AsEnumerable();
            }
            var result = data
                .Select(sd =>
                    new DistrictSummaryDTO
                    {
                        Id = sd.Id,
                        Name = $"{sd.Name}",
                        OpenPendingReferrals = library.GetPendingReferralsCount(filter, sd.Id),
                        CompletedPendingReferrals = filter.monthSelected ? library.GetCompletedReferralsCount(filter, sd.Id) : 0,
                        OpenReturnedEncounters = library.GetReturnedEncountersCount(filter, sd.Id),
                        OpenEncountersReadyForFinalESign = library.GetPendingSupervisorEsignCount(filter, sd.Id),
                        OpenScheduledEncounters = 0,
                        CompletedEncounters = filter.monthSelected ? library.GetCompletedEncountersCount(filter, sd.Id) : 0,
                        PendingEvaluations = library.GetPendingEvaluationsCount(filter, sd.Id),
                    });
            return (result, query.Count());
        }

        private DistrictSummaryTotalsResponseDTO GetDistrictSummaryTotals()
        {
            var summaryResponse = new DistrictSummaryTotalsResponseDTO()
            {
                TotalPendingReferrals = GetPendingReferralsTotalCount(),
                TotalReturnedEncounters = GetReturnedEncountersTotalCount(),
                TotalEncountersReadyForFinalESign = GetPendingSupervisorEsignTotal(),
                TotalScheduledEncounters = 0,
                TotalPendingEvaluations = GetPendingEvaluationsTotal(),
            };
            return summaryResponse;
        }
        #endregion

        #region By District Summary Totals
        private int GetPendingReferralsTotalCount()
        {
            DateTime yearAgo = DateTime.UtcNow.AddYears(-1).Date;
            DateTime today = DateTime.UtcNow;
            var referralList = CommonFunctions.GetServiceCodesWithReferrals();

            var grp = _context.Students
                .Where(s => !s.Archived && s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived))
                .Select(s => new
                {
                    StudentId = s.Id,
                    GroupedEncounters = s.EncounterStudents
                        .Where(es => es.EncounterDate > yearAgo && !es.Archived
                        && !s.SchoolDistrict.Archived
                        && es.Encounter.Provider.ProviderEscAssignments.Any(pea =>
                                !pea.Archived && (pea.EndDate == null || pea.EndDate >= today) &&
                                pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == es.Student.DistrictId))
                        && referralList.Contains(es.Encounter.Provider.ProviderTitle.ServiceCodeId))
                        .GroupBy(es => new { serviceCodeId = es.Encounter.Provider.ProviderTitle.ServiceCodeId })
                        .Select(es => new
                        {
                            ServiceCodeId = es.Key.serviceCodeId,
                            HasReferral = s.SupervisorProviderStudentReferalSignOffs
                                      .Any(r => r.ServiceCodeId == es.Key.serviceCodeId
                                          && (!r.EffectiveDateTo.HasValue || r.EffectiveDateTo.Value >= today)
                                          && r.EffectiveDateFrom.HasValue && r.Supervisor.VerifiedOrp && r.Supervisor.OrpApprovalDate != null
                                          && r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1)),
                        })
                }).AsNoTracking();

            return grp.SelectMany(grp => grp.GroupedEncounters).Count(ge => !ge.HasReferral);
        }
        private int GetReturnedEncountersTotalCount()
        {
            return _context.EncounterStudents.Where(es =>
                !es.Archived && !es.Encounter.Archived
                && (es.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter ||
                es.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter)
            ).AsNoTracking().Count();
        }
        private int GetPendingSupervisorEsignTotal()
        {
            return _context.EncounterStudents.Where(es =>
                es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN &&
                !es.Archived && es.SupervisorESignedById != null && es.SupervisorDateESigned == null
                && es.Encounter.Provider.ProviderEscAssignments.Any(pea =>
                    !pea.Archived &&
                    pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == es.Student.DistrictId))
                && !es.Encounter.Archived).AsNoTracking().Count();
        }
        private int GetPendingEvaluationsTotal()
        {
            return _context.EncounterStudents
               .Where(es => !es.Archived && es.Encounter.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment
               && es.Encounter.Provider.ProviderEscAssignments.Any(pea =>
                        !pea.Archived && (pea.EndDate == null || pea.EndDate >= DateTime.Now) &&
                        pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == es.Student.DistrictId))
               && !es.Encounter.Archived && !es.DateESigned.HasValue).AsNoTracking().Count();
        }
        #endregion

        #region By Service Area
        private (IEnumerable<DistrictSummaryDTO> data, int count) GetServiceAreaSummaries(IActivitySummaryLibrary library, ActivityReportFilters filter, Model.Core.CRUDSearchParams csp)
        {
            var query = _context.ServiceCodes.Where(sc => sc.Id != (int)ServiceCodes.Non_Msp_Service).AsNoTracking();
            var data = query
                    .OrderBy(ds => ds.Name)
                    .Skip(csp.skip.GetValueOrDefault())
                    .Take(csp.take.GetValueOrDefault())
                    .AsEnumerable()
                    .Select(s =>
                        new DistrictSummaryDTO
                        {
                            Id = s.Id,
                            Name = s.Name,
                            OpenPendingReferrals = !filter.isCompleted && s.NeedsReferral ? library.GetPendingReferralsCount(filter, s.Id) : 0,
                            CompletedPendingReferrals = filter.isCompleted && filter.monthSelected && s.NeedsReferral ? library.GetCompletedReferralsCount(filter, s.Id) : 0,
                            OpenReturnedEncounters = !filter.isCompleted ? library.GetReturnedEncountersCount(filter, s.Id) : 0,
                            OpenEncountersReadyForFinalESign = !filter.isCompleted ? library.GetPendingSupervisorEsignCount(filter, s.Id) : 0,
                            OpenScheduledEncounters = !filter.isCompleted && !filter.isAdmin ? library.GetEncountersReadyForYouCount(filter, s.Id) : 0,
                            CompletedEncounters = filter.isCompleted && filter.monthSelected ? library.GetCompletedEncountersCount(filter, s.Id) : 0,
                            PendingEvaluations = !filter.isCompleted && filter.isAdmin ? library.GetPendingEvaluationsCount(filter, s.Id) : 0,
                        }
                    );

            return (data, query.Count());
        }

        private DistrictSummaryTotalsResponseDTO GetServiceAreaSummaryTotals(IActivitySummaryLibrary library, ActivityReportFilters filter)
        {
            var summaryResponse = new DistrictSummaryTotalsResponseDTO()
            {
                TotalPendingReferrals = library.GetPendingReferralsCount(filter, filter.districtId),
                TotalReturnedEncounters = library.GetReturnedEncountersCount(filter, filter.districtId),
                TotalEncountersReadyForFinalESign = library.GetPendingSupervisorEsignCount(filter, filter.districtId),
                TotalPendingEvaluations = library.GetPendingEvaluationsCount(filter, filter.districtId),
                TotalScheduledEncounters = 0,
                TotalMissingAddresses = 0,
                StudentMissingAddresses = new List<Student>()
            };
            return summaryResponse;
        }
        #endregion

        #region By Provider
        private (IEnumerable<DistrictSummaryDTO> data, int count) GetProviderSummaries(IActivitySummaryLibrary library, ActivityReportFilters filter, Model.Core.CRUDSearchParams csp)
        {
            var query = _context.Providers
                .Include(p => p.ProviderUser)
                .Include(p => p.ProviderTitle)
                .Where(p =>
                    (filter.providerId == 0 || p.Id == filter.providerId) &&
                    (filter.serviceAreaId == 0 || p.ProviderTitle.ServiceCodeId == filter.serviceAreaId) &&
                    p.ProviderEscAssignments.Any(pea =>
                        pea.ProviderEscSchoolDistricts.Any(districts =>
                            districts.SchoolDistrictId == filter.districtId) &&
                        (pea.EndDate == null || pea.EndDate >= DateTime.Now) &&
                        !pea.Archived)
                    );
            var data = query
                .OrderBy(p => p.ProviderUser.LastName)
                .Skip(csp.skip.GetValueOrDefault())
                .Take(csp.take.GetValueOrDefault())
                .AsNoTracking()
                .ToList()
                .Select(p =>
                    new DistrictSummaryDTO
                    {
                        Id = p.Id,
                        Name = $"{p.ProviderUser.LastName}, {p.ProviderUser.FirstName}",
                        ProviderTitle = $"{p.ProviderTitle.Name}",
                        OpenPendingReferrals = !filter.isCompleted ? library.GetPendingReferralsCount(filter, p.Id) : 0,
                        CompletedPendingReferrals = filter.isCompleted ? library.GetCompletedReferralsCount(filter, p.Id) : 0,
                        OpenReturnedEncounters = !filter.isCompleted ? library.GetReturnedEncountersCount(filter, p.Id) : 0,
                        OpenEncountersReadyForFinalESign = !filter.isCompleted ? library.GetPendingSupervisorEsignCount(filter, p.Id) : 0,
                        OpenScheduledEncounters = !filter.isCompleted && !filter.isAdmin ? library.GetEncountersReadyForYouCount(filter, p.Id) : 0,
                        CompletedEncounters = filter.isCompleted ? library.GetCompletedEncountersCount(filter, p.Id) : 0,
                        PendingEvaluations = !filter.isCompleted && filter.isAdmin ? library.GetPendingEvaluationsCount(filter, p.Id) : 0,
                    });

            return (data, query.Count());
        }

        private DistrictSummaryTotalsResponseDTO GetProviderSummaryTotals(IActivitySummaryLibrary library, ActivityReportFilters filter)
        {
            var summaryResponse = new DistrictSummaryTotalsResponseDTO()
            {
                TotalPendingReferrals = library.GetPendingReferralsCount(filter, filter.serviceAreaId),
                TotalReturnedEncounters = library.GetReturnedEncountersCount(filter, filter.serviceAreaId),
                TotalEncountersReadyForFinalESign = library.GetPendingSupervisorEsignCount(filter, filter.serviceAreaId),
                TotalPendingEvaluations = library.GetPendingEvaluationsCount(filter, filter.serviceAreaId),
            };
            return summaryResponse;
        }
        #endregion

        #region By Student
        private DistrictSummaryTotalsResponseDTO GetStudentSummaryTotals(IActivitySummaryLibrary library, ActivityReportFilters filter)
        {
            var summaryResponse = new DistrictSummaryTotalsResponseDTO()
            {
                TotalPendingReferrals = library.GetPendingReferralsCount(filter, filter.providerId),
                TotalReturnedEncounters = library.GetReturnedEncountersCount(filter, filter.providerId),
                TotalEncountersReadyForFinalESign = library.GetPendingSupervisorEsignCount(filter, filter.providerId),
                TotalPendingEvaluations = library.GetPendingEvaluationsCount(filter, filter.providerId),
            };
            return summaryResponse;
        }
        #endregion

        public (IEnumerable<ReadyForFinalESignDTO> summaries, int count) GetReadyForFinalESignActivitySummaries(Model.Core.CRUDSearchParams csp)
        {
            ActivityReportFilters filter = BuildFilter(csp);
            IActivitySummaryLibrary library = new ByProviderLibrary(_context);

            var baseQuery = library.GetPendingSupervisorEsign(filter, filter.providerId).AsQueryable();
            var count = baseQuery.Count();

            var encounters = baseQuery
               .Select(es =>
                    new ReadyForFinalESignDTO
                    {
                        Id = es.Id,
                        EncounterNumber = es.EncounterNumber,
                        StartTime = (DateTime)DbFunctions.AddMilliseconds(es.EncounterDate, DbFunctions.DiffMilliseconds(TimeSpan.Zero, es.EncounterStartTime)),
                        EndTime = (DateTime)DbFunctions.AddMilliseconds(es.EncounterDate, DbFunctions.DiffMilliseconds(TimeSpan.Zero, es.EncounterEndTime)),
                        ServiceType = es.Encounter.Provider.ProviderTitle.ServiceCode.Name,
                        SessionName = es.StudentTherapySchedule.StudentTherapy.TherapyGroup == null ? "" : es.StudentTherapySchedule.StudentTherapy.TherapyGroup.Name,
                        Student = es.Student.LastName + ", " + es.Student.FirstName,
                    });

            encounters = CommonFunctions.OrderByDynamic(encounters.AsQueryable(), csp.order ?? "Student", csp.orderdirection == "desc");

            if (csp.take.GetValueOrDefault() > 0)
            {
                encounters = encounters
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            };

            return (encounters, count);
        }

        public (IEnumerable<ReadyForSchedulingDTO> summaries, int count) GetReadyForSchedulingActivitySummaries(Model.Core.CRUDSearchParams csp)
        {
            ActivityReportFilters filter = BuildFilter(csp);
            IActivitySummaryLibrary library = new ByProviderLibrary(_context);

            var baseQuery = library.GetEncountersReadyForYou(filter, filter.providerId).AsQueryable();
            var count = baseQuery.Count();

            var therapyGroups = baseQuery
               .Select(st =>
                    new ReadyForSchedulingDTO
                    {
                        EndTime = st.EndTime,
                        GroupId = (int)st.GroupId,
                        ServiceType = st.TherapySchedules.FirstOrDefault().StudentTherapy.CaseLoad.ServiceCode.Name,
                        StartTime = st.StartTime,
                        Students = st.Students,
                        Name = st.Name,
                    });

            therapyGroups = CommonFunctions.OrderByDynamic(therapyGroups.AsQueryable(), csp.order ?? "GroupId", csp.orderdirection == "desc");

            if (csp.take.GetValueOrDefault() > 0)
            {
                therapyGroups = therapyGroups
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            };

            return (therapyGroups, count);
        }

        public (IEnumerable<EncountersReturnedDTO> summaries, int count) GetEncountersReturnedActivitySummaries(Model.Core.CRUDSearchParams csp)
        {
            ActivityReportFilters filter = BuildFilter(csp);
            IActivitySummaryLibrary library = new ByProviderLibrary(_context);

            var baseQuery = library.GetReturnedEncounters(filter, filter.providerId).AsQueryable();
            var count = baseQuery.Count();

            var encounters = baseQuery
                .Include(es => es.Encounter)
                .Include(es => es.Encounter.Provider)
                .Include(es => es.Encounter.Provider.ProviderTitle)
                .Include(es => es.Encounter.Provider.ProviderTitle.ServiceCode)
                .Include(es => es.StudentTherapySchedule)
                .Include(es => es.StudentTherapySchedule.StudentTherapy)
                .Include(es => es.StudentTherapySchedule.StudentTherapy.TherapyGroup)
                .Include(es => es.Student)
                .ToList()
                .Select(es =>
                    new EncountersReturnedDTO
                    {
                        Id = es.Id,
                        EncounterNumber = es.EncounterNumber,
                        StartTime = CommonFunctions.ApplyDaylightSavingsOffset(es.EncounterDate, DateTime.Parse((es.EncounterDate + es.EncounterStartTime).ToString("g"))),
                        EndTime = CommonFunctions.ApplyDaylightSavingsOffset(es.EncounterDate, DateTime.Parse((es.EncounterDate + es.EncounterEndTime).ToString("g"))),
                        ServiceType = es.Encounter.Provider.ProviderTitle.ServiceCode.Name,
                        SessionName = es.StudentTherapySchedule?.StudentTherapy?.TherapyGroup == null ? "" : es.StudentTherapySchedule.StudentTherapy.TherapyGroup.Name,
                        Student = es.Student.LastName + ", " + es.Student.FirstName,
                    });

            encounters = CommonFunctions.OrderByDynamic(encounters.AsQueryable(), csp.order ?? "Student", csp.orderdirection == "desc");

            if (csp.take.GetValueOrDefault() > 0)
            {
                encounters = encounters
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            };

            return (encounters, count);
        }

        public (IEnumerable<ReferralsPendingDTO> summaries, int count) GetReferralsPendingActivitySummaries(Model.Core.CRUDSearchParams csp)
        {
            ActivityReportFilters filter = BuildFilter(csp);
            IActivitySummaryLibrary library = new ByProviderLibrary(_context);

            var baseQuery = library.GetPendingReferrals(filter, filter.providerId).AsQueryable();
            var count = baseQuery.Count();

            var encounters = baseQuery
               .Select(s =>
                    new ReferralsPendingDTO
                    {
                        Id = s.Id,
                        FirstName = s.FirstName,
                        LastName = s.LastName,
                        StudentCode = s.StudentCode,
                        DateOfBirth = s.DateOfBirth,
                        Grade = s.Grade,
                        TotalBillableClaims = s.ClaimsStudents.Count(),
                    });

            encounters = CommonFunctions.OrderByDynamic(encounters.AsQueryable(), csp.order ?? "LastName", csp.orderdirection == "desc");

            if (csp.take.GetValueOrDefault() > 0)
            {
                encounters = encounters
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            };

            return (encounters, count);
        }

        private ActivitySummary AddActivitySummary()
        {
            var districtSummaryTotals = GetDistrictSummaryTotals();

            var activitySummary = new ActivitySummary()
            {
                ReferralsPending = districtSummaryTotals.TotalPendingReferrals,
                EncountersReturned = districtSummaryTotals.TotalReturnedEncounters,
                PendingSupervisorCoSign = districtSummaryTotals.TotalEncountersReadyForFinalESign,
                PendingEvaluations = districtSummaryTotals.TotalPendingEvaluations
            };
            _context.ActivitySummaries.Add(activitySummary);
            _context.SaveChanges();

            return activitySummary;
        }

        private (List<DistrictSummaryDTO> districtSummaryDTOs, List<ActivitySummaryDistrict> districtSummaries)
            AddActivitySummaryDistricts(Model.Core.CRUDSearchParams csp, int activitySummaryId)
        {
            var districtLibrary = new ByDistrictLibrary(_context);

            var districtFilter = new ActivityReportFilters()
            {
                isAdmin = true
            };

            var districtSummaryDTOs = GetDistrictSummaries(districtLibrary, districtFilter, csp) // TODO;
                                        .data
                                        .ToList();

            var districtSummaries = districtSummaryDTOs
                                        .Select(summary => new ActivitySummaryDistrict()
                                        {
                                            DistrictId = summary.Id,
                                            ReferralsPending = summary.OpenPendingReferrals,
                                            EncountersReturned = summary.OpenReturnedEncounters,
                                            PendingSupervisorCoSign = summary.OpenEncountersReadyForFinalESign,
                                            EncountersReadyForScheduling = summary.OpenScheduledEncounters,
                                            PendingEvaluations = summary.PendingEvaluations,
                                            ActivitySummaryId = activitySummaryId
                                        })
                                        .ToList();

            _context.ActivitySummaryDistricts.AddRange(districtSummaries);
            _context.SaveChanges();

            return (districtSummaryDTOs, districtSummaries);
        }

        private (List<DistrictSummaryDTO> serviceAreaSummaryDTOs, List<ActivitySummaryServiceArea> serviceAreaSummaries, List<int> districtIds)
            AddActivitySummaryServiceAreas(Model.Core.CRUDSearchParams csp, List<DistrictSummaryDTO> districtSummaryDTOs, List<ActivitySummaryDistrict> districtSummaries)
        {
            var serviceAreaLibrary = new ByServiceAreaLibrary(_context);

            var serviceAreaSummaryDTOs = new List<DistrictSummaryDTO>();
            var serviceAreaSummaries = new List<ActivitySummaryServiceArea>();
            var districtIds = new List<int>();

            for (var i = 0; i < districtSummaries.Count; i++)
            {
                var districtSummaryDTO = districtSummaryDTOs[i];
                var districtSummary = districtSummaries[i];

                var filter = new ActivityReportFilters()
                {
                    month = DateTime.Now.Month,
                    year = DateTime.Now.Year,
                    districtId = districtSummaryDTO.Id,
                    isAdmin = true,
                    isCompleted = false
                };

                var summariesForDistrict = GetServiceAreaSummaries(serviceAreaLibrary, filter, csp)
                                                .data
                                                .ToList();

                serviceAreaSummaryDTOs.AddRange(summariesForDistrict);
                serviceAreaSummaries.AddRange(
                    summariesForDistrict.Select(s => new ActivitySummaryServiceArea()
                    {
                        ServiceAreaId = s.Id,
                        ReferralsPending = s.OpenPendingReferrals,
                        EncountersReturned = s.OpenReturnedEncounters,
                        PendingSupervisorCoSign = s.OpenEncountersReadyForFinalESign,
                        PendingEvaluations = s.PendingEvaluations,
                        OpenScheduledEncounters = s.OpenScheduledEncounters,
                        ActivitySummaryDistrictId = districtSummary.Id
                    })
                    .ToList()
                );

                districtIds.AddRange(
                    Enumerable.Repeat(districtSummaryDTO.Id, summariesForDistrict.Count)
                );
            }

            _context.ActivitySummaryServiceAreas.AddRange(serviceAreaSummaries);
            _context.SaveChanges();

            return (serviceAreaSummaryDTOs, serviceAreaSummaries, districtIds);
        }

        private void AddActivitySummaryProviders(Model.Core.CRUDSearchParams csp, List<DistrictSummaryDTO> serviceAreaSummaryDTOs, List<ActivitySummaryServiceArea> serviceAreaSummaries, List<int> districtIds)
        {
            var providerLibrary = new ByProviderLibrary(_context);

            for (var i = 0; i < serviceAreaSummaries.Count; i++)
            {
                var serviceAreaSummaryDTO = serviceAreaSummaryDTOs[i];
                var serviceAreaSummary = serviceAreaSummaries[i];

                var filter = new ActivityReportFilters()
                {
                    serviceAreaId = serviceAreaSummaryDTO.Id,
                    districtId = districtIds[i],
                    isAdmin = true,
                    isCompleted = false
                };

                var providerSummaryDTOs = GetProviderSummaries(providerLibrary, filter, csp) // TODO csp
                                            .data;
                var providerSummaries = providerSummaryDTOs
                                            .Select(s => new ActivitySummaryProvider()
                                            {
                                                ProviderId = s.Id,
                                                ProviderName = s.Name,
                                                ReferralsPending = s.OpenPendingReferrals,
                                                EncountersReturned = s.OpenReturnedEncounters,
                                                PendingSupervisorCoSign = s.OpenEncountersReadyForFinalESign,
                                                PendingEvaluations = s.PendingEvaluations,
                                                ActivitySummaryServiceAreaId = serviceAreaSummary.Id
                                            });

                _context.ActivitySummaryProviders.AddRange(providerSummaries);
            }
            _context.SaveChanges();
        }

        public int UpdateActivitySummaryTables()
        {
            _context.Database.CommandTimeout = 600;

            var csp = new Model.Core.CRUDSearchParams()
            {
                skip = 0,
                take = int.MaxValue
            };

            // step 1: activity summaries
            var activitySummary = AddActivitySummary();

            // step 2: district summaries
            var activitySummaryId = activitySummary.Id;
            (var districtSummaryDTOs, var districtSummaries)
                = AddActivitySummaryDistricts(csp, activitySummaryId);

            // step 3: service area summaries
            (var serviceAreaSummaryDTOs, var serviceAreaSummaries, var districtIds)
                = AddActivitySummaryServiceAreas(csp, districtSummaryDTOs, districtSummaries);

            // step 4: provider summaries
            AddActivitySummaryProviders(csp, serviceAreaSummaryDTOs, serviceAreaSummaries, districtIds);

            return activitySummaryId;
        }

        public ActivitySummary GetMostRecentSummary() {
            return _context.ActivitySummaries
                            .OrderByDescending(summary => summary.DateCreated)
                            .First();
        }

        public ActivitySummaryDistrict GetActivitySummaryDistrictByDistrictId(int districtId)
        {
            return _context.ActivitySummaryDistricts.Where(asd => asd.DistrictId == districtId)
                .OrderByDescending(asd => asd.DateCreated).FirstOrDefault();
        }
    }
}
