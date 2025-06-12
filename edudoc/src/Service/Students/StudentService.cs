
using BreckServiceBase.Utilities.Interfaces;
using FluentValidation;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;

namespace Service.Students
{
    public class StudentService : CRUDBaseService, IStudentService
    {
        private readonly IPrimaryContext _context;
        public StudentService(IPrimaryContext context, IEmailHelper emailHelper)
            : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }

        public StudentSearch SearchStudents(Model.Core.CRUDSearchParams csp, int userId)
        {
            var user = GetById<User>(userId, new string[] { "AuthUser", "AuthUser.UserRole" });
            var cspFull = new Model.Core.CRUDSearchParams<Student>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Student>
                {
                    student => student.School,
                    student => student.School.SchoolDistrictsSchools,
                    student => student.School.SchoolDistrictsSchools.Select(x=> x.SchoolDistrict),
                    student => student.Address,
                    student => student.CaseLoads.Select(s => s.StudentType),
                    student => student.CaseLoads.Select(s => s.StudentTherapies),
                    student => student.EncounterStudents,
                },
                AsNoTrackingGetList = true
            };
            cspFull.AddedWhereClause.Add(student => !student.Archived);

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query);
                if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.Admin)
                {
                    foreach (string t in terms)
                    {
                        cspFull.AddedWhereClause.Add(d =>
                            d.LastName.StartsWith(t) ||
                            d.FirstName.StartsWith(t) ||
                            d.StudentCode.ToString().StartsWith(t) ||
                            d.MedicaidNo.ToString().StartsWith(t)
                        );
                    }

                }
                else
                {
                    foreach (string t in terms)
                    {
                        cspFull.AddedWhereClause.Add(d =>
                            d.LastName.StartsWith(t) ||
                            d.FirstName.StartsWith(t) ||
                            d.StudentCode.ToString().StartsWith(t)
                        );
                    }
                }

            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["schoolId"] != null)
                {
                    int schoolId = int.Parse(extras["schoolId"]);
                    cspFull.AddedWhereClause.Add(student => student.SchoolId == schoolId);
                }
                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);
                    cspFull.AddedWhereClause.Add(student => student.DistrictId == districtId);
                }
                else if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.DistrictAdmin)
                {
                    cspFull.AddedWhereClause.Add(student => student.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) ||
                        student.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId)));
                }
                if (extras["missingAddresses"] != null && extras["missingAddresses"] == "1")
                {
                    DateTime oneYearBefore = DateTime.Today.AddYears(-1);
                    cspFull.AddedWhereClause.Add(student =>
                        student.AddressId == null &&
                        student.EncounterStudents.Any(s => !s.Archived && s.EncounterDate >= oneYearBefore && s.DateESigned != null) &&
                        student.CaseLoads.Any(c => c.StudentTypeId == (int)StudentTypes.IEP)
                    );
                }
                if (extras["noMedicaidId"] != null && (extras["noMedicaidId"] == "1" || extras["noMedicaidId"] == "true"))
                {
                    // student has at least one encounter within last year and has no medicaid id
                    DateTime oneYearBefore = DateTime.Today.AddYears(-1);
                    cspFull.AddedWhereClause.Add(student => (student.MedicaidNo == null || student.MedicaidNo.Length == 0) && student.EncounterStudents.Any(s => s.EncounterDate >= oneYearBefore));
                }
                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    cspFull.AddedWhereClause.Add(student => student.DateOfBirth >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    cspFull.AddedWhereClause.Add(student => student.DateOfBirth <= DbFunctions.TruncateTime(endDate));
                }
                if (extras["noAddressId"] != null && extras["noAddressId"] == "1")
                {
                    cspFull.AddedWhereClause.Add(student => student.AddressId == null || student.Address == null);
                }
                if (extras["providerId"] != null && extras["providerId"] != "0")
                {
                    int providerId = int.Parse(extras["providerId"]);
                    cspFull.AddedWhereClause.Add(student => student.ProviderStudents.Any(y => y.ProviderId == providerId));
                }
                if (extras["districtId"] != null && extras["noMedicaidId"] != null && extras["noAddressId"] != null)
                {
                    cspFull.AddedWhereClause.Add(student => student.EncounterStudents.Any(es => es.ESignedById != null));
                }
            }

            cspFull.DefaultOrderBy = "LastName";
            csp.order = csp.order.Substring(csp.order.IndexOf(".") + 1);
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            var baseQuery = addOrderByList(this.GenerateSearchQuery(cspFull), cspFull);
            var count = baseQuery.Count();
            if(cspFull.skip.HasValue) {
                baseQuery = baseQuery.Skip(cspFull.skip.Value);
            }
            if(cspFull.take.HasValue && cspFull.take.Value > 0) {
                baseQuery = baseQuery.Take(cspFull.take.Value);
            }

            var result = baseQuery.Select(s => new StudentDto {
                Student = s,
                SignedEncounterCount = s.EncounterStudents.Count(es => !es.Archived && es.DateESigned != null && es.StudentDeviationReasonId == null)
            }).ToList();

            var studentsWhoCanBeArchived = baseQuery
                                                   .Where(s => !s.EncounterStudents.Any(es => !es.Archived))
                                                   .Where(s => !s.ProviderStudents.Any())
                                                   .Where(s => !s.SupervisorProviderStudentReferalSignOffs.Any())
                                                   .Where(s => !s.CaseLoads.SelectMany(c => c.StudentTherapies).Any(st => !st.Archived))
                                                   .Where(s => !s.StudentParentalConsents.Any(pc => pc.ParentalConsentTypeId != (int)StudentParentalConsentTypes.PendingConsent))
                                                   .Select(s => s.Id)
                                                   .ToHashSet();

            foreach(var student in result) {
                student.CanBeArchived = studentsWhoCanBeArchived.Contains(student.Student.Id);
            }

            return new StudentSearch
            {
                Student = result,
                Count = count
            };
        }

        public IEnumerable<SelectOptions> GetStudentOptions(string searchQuery, int providerId, int userId, bool fromCaseLoad)
        {
            searchQuery = String.IsNullOrEmpty(searchQuery) ? "" : searchQuery.ToLower();
            return _context.Students
                            .Include(student => student.School)
                            .Include(student => student.School.SchoolDistrictsSchools)
                            .Include(student => student.School.SchoolDistrictsSchools.Select(x => x.SchoolDistrict))
                            .Where(student => ((fromCaseLoad && student.ProviderStudents.Any(y => y.ProviderId == providerId)) || !fromCaseLoad) &&
                                                         (student.School.SchoolDistrictsSchools.Any
                                                                (y => y.SchoolDistrict.ProviderEscSchoolDistricts.Any(z => z.ProviderEscAssignment.Provider.ProviderUserId == userId && z.ProviderEscAssignment.ProviderId == providerId)))
                                                         && (student.FirstName.ToLower().StartsWith(searchQuery) || student.LastName.ToLower().StartsWith(searchQuery))
                                            ).AsEnumerable()
                                            .OrderBy(x => x.LastName)
                                            .Select(x => new SelectOptions
                                            {
                                                Id = x.Id,
                                                Name = $"{x.LastName}, {x.FirstName} - {x.DateOfBirth.Date.ToShortDateString()} - {x.StudentCode}"
                                            });
        }

        public IEnumerable<SelectOptionsWithProviderId> GetStudentSelectOptionsByAssistant(int userId)
        {
            var providerId = _context.Providers.FirstOrDefault(p => p.ProviderUserId == userId).Id;
            var assistants = _context.ProviderStudentSupervisors
                                .Where(p => p.SupervisorId == providerId)
                                .Select(p => p.AssistantId)
                                .ToList();
            return _context.Students
                        .Where(student => (student.ProviderStudents.Any(y => assistants.Contains(y.ProviderId))))
                        .OrderBy(x => x.LastName)
                        .Select(x => new SelectOptionsWithProviderId
                        {
                            Id = x.Id,
                            Name = x.LastName + ", " + x.FirstName,
                            ProviderIds = x.ProviderStudents.Select(st => st.ProviderId).ToList()
                        });
        }

        public Student GetStudentById(int studentId, int userId)
        {
            // Will return Aug 01 of last year if today is past July or 2 years ago if it is before
            var endOfPreviousSchoolYear = DateTime.Now.Month > 7 ? new DateTime(DateTime.Now.Year - 1, 08, 01) : new DateTime(DateTime.Now.Year - 2, 08, 01);

            var student = _context.Students.Where(student =>
                    student.Id == studentId
                    &&
                    (
                        // Student is in Provider's assigned school Districts or out of District/unknown
                        (student.School.SchoolDistrictsSchools
                            .Any(y =>
                                y.SchoolDistrict.ProviderEscSchoolDistricts
                                    .Any(z =>
                                        z.ProviderEscAssignment.Provider.ProviderUserId == userId &&
                                        !z.ProviderEscAssignment.Archived
                                    )
                                ) ||
                        student.SchoolId <= (int)DefaultSchools.OUT_OF_DISTRICT
                        ) ||
                        // Student is being supervised by Provider
                        (student.SupervisorProviderStudentReferalSignOffs
                            .Any(referral =>
                                referral.Supervisor.ProviderUserId == userId &&
                                referral.SignOffDate == null
                            ) ||
                        student.ProviderStudentSupervisors
                            .Any(z =>
                                z.Supervisor.ProviderUserId == userId &&
                                z.EffectiveEndDate == null
                            )
                        )
                    )
                );

            var user = _context.Users
                        .Include(user => user.Providers_ProviderUserId)
                        .Include(user => user.Providers_ProviderUserId.Select(provider => provider.ProviderTitle))
                        .Include(user => user.AuthUser)
                        .Include(user => user.AuthUser.UserRole)
                        .FirstOrDefault(user => user.Id == userId);

            int providerServiceAreaId = 0;

            if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.Provider)
                providerServiceAreaId = user.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ServiceCodeId;

            student.Select(x => x.CaseLoads.OrderByDescending(caseLoad => caseLoad.Id).Where(x => x.StudentId == studentId && (x.ServiceCodeId == providerServiceAreaId || providerServiceAreaId == 0))).Load();

            student.Select(x => x.CaseLoads.SelectMany(y => y.CaseLoadMethods.Select(z => z.Method))).Load();
            student.Select(x => x.CaseLoads.SelectMany(y => y.CaseLoadCptCodes.Select(z => z.CptCode))).Load();
            student.Select(x => x.CaseLoads.Select(y => y.StudentType)).Load();
            student.Select(x => x.CaseLoads.Select(y => y.DiagnosisCode)).Load();
            student.Select(x => x.CaseLoads.Select(y => y.DisabilityCode)).Load();
            student.Select(x => x.CaseLoads.Select(y => y.StudentTherapies.Where(st => st.Archived == false))).Load();
            student.Select(x => x.ProviderStudentSupervisors.Where(x => x.StudentId == studentId && (x.Assistant.ProviderUserId == userId || x.Supervisor.ProviderUserId == userId)).OrderByDescending(x => x.EffectiveStartDate)).Load();
            student.Select(x => x.ProviderStudentSupervisors.Select(x => x.Supervisor)).Load();
            student.Select(x => x.ProviderStudentSupervisors.Select(x => x.Supervisor.ProviderUser)).Load();
            student.Select(x => x.ProviderStudentSupervisors.Select(x => x.Assistant)).Load();
            student.Select(x => x.ProviderStudentSupervisors.Select(x => x.Assistant.ProviderUser)).Load();
            student.Select(x => x.Esc).Load();
            student.Select(x => x.SchoolDistrict).Load();
            student.Select(x => x.School).Load();
            student.Select(x => x.School.SchoolDistrictsSchools).Load();
            student.Select(x => x.School.SchoolDistrictsSchools.Select(x => x.SchoolDistrict)).Load();
            student.Select(x => x.StudentDistrictWithdrawals).Load();
            student.Select(x => x.StudentDistrictWithdrawals.Select(y => y.SchoolDistrict)).Load();
            student.Select(x => x.IepServices).Load();

            var actualStudent = student.FirstOrDefault();

			// Date of birth is usually set to midnight day of, which can cause problems with time zones. Setting it to noon will fix this.
            // However for some reason some dates of birth have a time component. So we want to offset it so that it's actually noon.
            actualStudent.DateOfBirth = actualStudent.DateOfBirth.AddHours(12 - actualStudent.DateOfBirth.Hour);
            return actualStudent;
        }

        public ProviderCaseLoadSearch ProviderSearchCaseLoads(Model.Core.CRUDSearchParams csp, int userId)
        {
            var user = GetById<User>(userId, new string[] { "AuthUser", "AuthUser.UserRole", "Providers_ProviderUserId",
                "Providers_ProviderUserId.ProviderTitle", "Providers_ProviderUserId.ProviderEscAssignments",
                "Providers_ProviderUserId.ProviderEscAssignments.ProviderEscSchoolDistricts"});

            Provider provider = user.Providers_ProviderUserId.FirstOrDefault();
            ThrowIfNull(provider);
            var isOrp = provider.VerifiedOrp && provider.OrpApprovalDate != null;
            var orpDate = provider.OrpApprovalDate != null ? ((DateTime)provider.OrpApprovalDate).AddYears(-1) : new DateTime();

            int providerServiceAreaId = provider.ProviderTitle.ServiceCodeId;
            var today = DateTime.Now;
            var isAssistantCaseload = false;

            var referralSignature = _context.ESignatureContents.Where(ec => ec.Id == (int)EncounterSignatures.Referral);

            var studentsQuery = _context.Students
                .Include("SupervisorProviderStudentReferalSignOffs")
                .Where(s => !s.Archived)
                .AsQueryable();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    studentsQuery = studentsQuery.Where(s =>
                                                        s.FirstName.ToLower().StartsWith(t) ||
                                                        s.LastName.ToLower().StartsWith(t) ||
                                                        s.StudentCode.ToLower().StartsWith(t)
                                                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                // If a district is selected filter by that district else filter bt districts assigned to the logged in user
                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);

                    studentsQuery = studentsQuery.Where(student => student.DistrictId == districtId);
                }
                else
                {
                    studentsQuery = studentsQuery.Where(student =>
                        student.SchoolDistrict.ProviderEscSchoolDistricts.Any(x =>
                                    x.ProviderEscAssignment.ProviderId == provider.Id && !x.ProviderEscAssignment.Archived &&
                                    (x.ProviderEscAssignment.EndDate == null || x.ProviderEscAssignment.EndDate >= today)
                        )
                    );
                }

                // If only getting your own caseload
                if (extras["myCaseLoadOnly"] == "1")
                {
                    studentsQuery = studentsQuery.Where(student => student.ProviderStudents.Any(y => y.ProviderId == provider.Id));
                }
                // Get assistant's caseload for students in provider's school district
                else if (extras["assistantId"] != null)
                {
                    isAssistantCaseload = true;
                    int assistantId = int.Parse(extras["assistantId"]);
                    studentsQuery = studentsQuery.Where(student =>
                            student.SchoolDistrict.ProviderEscSchoolDistricts.Any(
                                x => x.ProviderEscAssignment.ProviderId == assistantId && !x.ProviderEscAssignment.Archived && (x.ProviderEscAssignment.EndDate == null || x.ProviderEscAssignment.EndDate >= today)
                        ) && student.ProviderStudents.Any(y => y.ProviderId == assistantId)
                    );
                }

                // Get all students in provider's school district that do not have them assigned as a supervisor
                if (extras["noAssistantsOnly"] == "1")
                {
                    studentsQuery = studentsQuery.Where(student =>
                        !student.ProviderStudentSupervisors.Any(assignment => assignment.Supervisor.ProviderUserId == user.Id)
                    );
                }

                if (extras["referralsOnly"] == "1" && isOrp)
                {
                    studentsQuery = studentsQuery.Where(student =>
                        !student.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                            (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                            referral.EffectiveDateFrom.HasValue &&
                            referral.EffectiveDateFrom.Value >= orpDate &&
                            referral.ServiceCodeId == providerServiceAreaId) &&
                        student.CaseLoads.Any(c =>
                            c.StudentType.IsBillable &&
                            !c.Archived &&
                            c.ServiceCodeId == providerServiceAreaId));
                }
            }

            var schoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();
            var results = studentsQuery
                .Select(s => new ProviderCaseLoad
                {
                    Id = s.Id,
                    LastName = s.LastName,
                    FirstName = s.FirstName,
                    StudentCode = s.StudentCode,
                    DateOfBirth = s.DateOfBirth,
                    School = s.School,
                    SchoolDistrict = s.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict,
                    ESC = s.Esc,
                    TherapyGroups = s.CaseLoads.SelectMany(cl => cl.StudentTherapies.Where(st => st.TherapyGroup != null && !st.Archived && st.TherapyGroup.Provider.ProviderUserId == userId)).Select(st => st.TherapyGroup),
                    Assistants = s.ProviderStudentSupervisors.Where(assignment => assignment.Supervisor.ProviderUserId == user.Id && (assignment.EffectiveEndDate == null || today <= assignment.EffectiveEndDate)).Select(assignment => assignment.Assistant.ProviderUser),
                    Supervisor = s.ProviderStudentSupervisors.FirstOrDefault(assignment => assignment.Assistant.ProviderUserId == user.Id &&
                                    (assignment.EffectiveEndDate == null ||
                                    today <= assignment.EffectiveEndDate)).Supervisor.ProviderUser ?? null,
                    EffectiveStartDate = s.ProviderStudentSupervisors.FirstOrDefault(assignment => assignment.Assistant.ProviderUserId == user.Id && assignment.EffectiveEndDate == null).EffectiveStartDate,
                    NeedsReferral = !s.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                        referral.ServiceCodeId == providerServiceAreaId &&
                        referral.Supervisor.VerifiedOrp && referral.Supervisor.OrpApprovalDate != null &&
                        (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                        referral.EffectiveDateFrom.HasValue &&
                        referral.EffectiveDateFrom.Value >= (referral.Supervisor.OrpApprovalDate != null
                            ? DbFunctions.AddYears(referral.Supervisor.OrpApprovalDate, -1) : DateTime.Now)
                        ) &&
                        s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived && c.ServiceCodeId == providerServiceAreaId),
                    LatestReferralId =
                        s.SupervisorProviderStudentReferalSignOffs
                            .OrderByDescending(x => x.EffectiveDateFrom)
                            .FirstOrDefault(referral =>
                                referral.ServiceCodeId == providerServiceAreaId &&
                                referral.Supervisor.VerifiedOrp && referral.Supervisor.OrpApprovalDate != null &&
                                (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                                referral.EffectiveDateFrom.HasValue &&
                                referral.EffectiveDateFrom.Value >= (referral.Supervisor.OrpApprovalDate != null
                            ? DbFunctions.AddYears(referral.Supervisor.OrpApprovalDate, -1) : DateTime.Now)
                            ).Id,
                    CanBeArchived = s.ProviderStudents.Any(ps => ps.Provider.ProviderUserId == user.Id),
                    ProgressReports = s.ProgressReports.Where(pr => pr.DateESigned.HasValue
                        && pr.StartDate.Value >= schoolYearStart.Date
                        && pr.CreatedBy.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ServiceCodeId == providerServiceAreaId)
                        .OrderBy(pr => pr.StartDate),
                    HasIEP = s.CaseLoads.Any(cl => cl.StudentTypeId == (int)StudentTypes.IEP),
                    IsBillable = s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived && c.ServiceCodeId == providerServiceAreaId),
                    HasIncompleteProfile = !s.CaseLoads.Any(c => !c.Archived && c.ServiceCodeId == providerServiceAreaId)
                });

            if (csp.order == "SchoolDistrict")
            {
                if (csp.orderdirection == "desc")
                {
                    results = results.OrderByDescending(s => s.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict.Name)
                        .ThenBy(s => s.LastName).ThenBy(s => s.FirstName);
                }
                else
                {
                    results = results.OrderBy(s => s.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict.Name)
                        .ThenBy(s => s.LastName).ThenBy(s => s.FirstName);
                }

            }
            else if (csp.order == "SessionName")
            {
                if (csp.orderdirection == "desc")
                {
                    results = results.OrderByDescending(s => s.TherapyGroups.Select(tg => tg.Name).Distinct().FirstOrDefault())
                        .ThenBy(s => s.LastName).ThenBy(s => s.FirstName);
                }
                else
                {
                    results = results.OrderBy(s => s.TherapyGroups.Select(tg => tg.Name).Distinct().FirstOrDefault())
                        .ThenBy(s => s.LastName).ThenBy(s => s.FirstName);
                }

            }
            else
            {
                results = CommonFunctions.OrderByDynamic(results, csp.order ?? "LastName", csp.orderdirection == "desc");
            }
            var count = results.Count();


            if (csp.take.GetValueOrDefault() > 0)
            {
                results = results
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            }

            // if provider is an assistant, students with referral reminders should show up first
            if (user.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitleId != null)
            {
                results = results.OrderByDescending(r => r.NeedsReferral && r.IsBillable);
            }

            return new ProviderCaseLoadSearch
            {
                Student = results
                    .Select(s => new ProviderCaseLoadDTO
                    {
                        Id = s.Id,
                        LastName = s.LastName,
                        FirstName = s.FirstName,
                        StudentCode = s.StudentCode,
                        DateOfBirth = s.DateOfBirth,
                        School = s.School.Name,
                        SchoolDistrict = s.SchoolDistrict.Name ?? "",
                        ESC = s.ESC.Name ?? "",
                        SortingName = s.TherapyGroups.Select(tg => tg.Name).Distinct(),
                        ProgressReports = s.ProgressReports.Where(pr => s.HasIEP),
                        Assistants = s.Assistants,
                        Supervisor = (s.Supervisor.LastName + ", " + s.Supervisor.FirstName) ?? "",
                        EffectiveStartDate = s.EffectiveStartDate,
                        NeedsReferral = s.NeedsReferral,
                        LatestReferralId = s.LatestReferralId ?? 0,
                        CanBeArchived = s.CanBeArchived,
                        IsBillable = s.IsBillable,
                        HasIncompleteProfile = s.HasIncompleteProfile,
                        IsAssistantCaseload = isAssistantCaseload,
                        ReferralSignature = referralSignature
                    }),
                Count = count,
            };
        }

        public ProviderCaseLoadSearch ProviderSearchMissingReferrals(Model.Core.CRUDSearchParams csp, int userId)
        {
            var user = GetById<User>(userId, new string[] {  "Providers_ProviderUserId",
                "Providers_ProviderUserId.ProviderTitle", "Providers_ProviderUserId.ProviderEscAssignments",
                "Providers_ProviderUserId.ProviderEscAssignments.ProviderEscSchoolDistricts"});

            Provider provider = user.Providers_ProviderUserId.FirstOrDefault();
            ThrowIfNull(provider);
            var isOrp = provider.VerifiedOrp && provider.OrpApprovalDate != null;
            var orpDate = provider.OrpApprovalDate != null ? ((DateTime)provider.OrpApprovalDate).AddYears(-1) : new DateTime();

            int providerServiceAreaId = provider.ProviderTitle.ServiceCodeId;
            var today = DateTime.Now;
            var referralSignature = _context.ESignatureContents.Where(ec => ec.Id == (int)EncounterSignatures.Referral);

            var studentsQuery = _context.Students
                .Include("SupervisorProviderStudentReferalSignOffs")
                .Where(s => !s.Archived)
                .AsNoTracking()
                .AsQueryable();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    studentsQuery = studentsQuery.Where(s =>
                                                        s.FirstName.ToLower().StartsWith(t) ||
                                                        s.LastName.ToLower().StartsWith(t) ||
                                                        s.StudentCode.ToLower().StartsWith(t)
                                                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["providerId"] != null)
                {
                    int providerId = int.Parse(extras["providerId"]);
                    int caseloadProviderId = providerId > 0 ? providerId : provider.Id;


                    if (providerId > 0)
                    {
                        studentsQuery = studentsQuery.Where(student =>
                                student.SchoolDistrict.ProviderEscSchoolDistricts.Any(x => x.ProviderEscAssignment.ProviderId == caseloadProviderId && !x.ProviderEscAssignment.Archived
                                    && (x.ProviderEscAssignment.EndDate == null || x.ProviderEscAssignment.EndDate >= DateTime.Now)) ||
                                student.ProviderStudentSupervisors.Any(pss => pss.SupervisorId == provider.Id && (pss.EffectiveEndDate == null || today <= pss.EffectiveEndDate)));

                        // Not rerestricting search to caseloads just districts
                        studentsQuery = studentsQuery.Where(student => student.ProviderStudents.Any(y => y.ProviderId == providerId));
                    }
                    else if (providerId == 0)
                    {
                        // Get missing referrals for all providers
                        studentsQuery = studentsQuery.Where(student => student.ProviderStudents.Any());
                    }
                    else if (providerId == -1)
                    {
                        // Get students not on any caseload
                        studentsQuery = studentsQuery.Where(student => !student.ProviderStudents.Any());
                    }
                }

                if (extras["missingReferrals"] == "1" && isOrp)
                {
                    var schoolDistrictIds = user.Providers_ProviderUserId.FirstOrDefault().ProviderEscAssignments
                        .Where(esc => !esc.Archived)
                        .SelectMany(p => p.ProviderEscSchoolDistricts.Select(sd => sd.SchoolDistrictId)).Distinct();

                    studentsQuery = studentsQuery.Where(s =>
                        s.DistrictId.HasValue && schoolDistrictIds.Contains(s.DistrictId.Value) &&
                        !s.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                        (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                        referral.EffectiveDateFrom.HasValue &&
                        referral.EffectiveDateFrom.Value >= orpDate &&
                        referral.ServiceCodeId == providerServiceAreaId));
                }
            }

            var results = studentsQuery.AsNoTracking()
                .Select(s => new ProviderCaseLoad
                {
                    Id = s.Id,
                    LastName = s.LastName,
                    FirstName = s.FirstName,
                    StudentCode = s.StudentCode,
                    DateOfBirth = s.DateOfBirth,
                    School = s.School,
                    SchoolDistrict = s.SchoolDistrict,
                    ESC = s.Esc,
                    Assistants = s.ProviderStudentSupervisors.Where(assignment => assignment.Supervisor.ProviderUserId == user.Id && (assignment.EffectiveEndDate == null || today <= assignment.EffectiveEndDate)).Select(assignment => assignment.Assistant.ProviderUser),
                    Supervisor = s.ProviderStudentSupervisors.FirstOrDefault(assignment => assignment.Assistant.ProviderUserId == user.Id &&
                                    (assignment.EffectiveEndDate == null ||
                                    today <= assignment.EffectiveEndDate)).Supervisor.ProviderUser ?? null,
                    NeedsReferral = !s.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                        referral.ServiceCodeId == providerServiceAreaId &&
                        referral.Supervisor.VerifiedOrp && referral.Supervisor.OrpApprovalDate != null &&
                        (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                        referral.EffectiveDateFrom.HasValue &&
                        referral.EffectiveDateFrom.Value >= (referral.Supervisor.OrpApprovalDate != null
                            ? DbFunctions.AddYears(referral.Supervisor.OrpApprovalDate, -1) : DateTime.Now)
                        ) &&
                        s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived && c.ServiceCodeId == providerServiceAreaId),
                    LatestReferralId =
                        s.SupervisorProviderStudentReferalSignOffs
                            .OrderByDescending(x => x.EffectiveDateFrom)
                            .FirstOrDefault(referral =>
                                referral.ServiceCodeId == providerServiceAreaId &&
                                referral.Supervisor.VerifiedOrp && referral.Supervisor.OrpApprovalDate != null &&
                                (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                                referral.EffectiveDateFrom.HasValue &&
                                referral.EffectiveDateFrom.Value >= (referral.Supervisor.OrpApprovalDate != null
                            ? DbFunctions.AddYears(referral.Supervisor.OrpApprovalDate, -1) : DateTime.Now)
                            ).Id,
                    ProgressReports = s.ProgressReports.Where(pr => pr.DateESigned.HasValue &&
                        pr.CreatedBy.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ServiceCodeId == providerServiceAreaId)
                        .OrderBy(pr => pr.StartDate),
                    HasIEP = s.CaseLoads.Any(cl => cl.StudentTypeId == (int)StudentTypes.IEP),
                    IsBillable = s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived && c.ServiceCodeId == providerServiceAreaId),
                    HasIncompleteProfile = !s.CaseLoads.Any(c => !c.Archived && c.ServiceCodeId == providerServiceAreaId)
                });
            var count = results.Count();

            if (csp.order == "SchoolDistrict")
            {
                var keySelector = new Func<ProviderCaseLoad, string>(s => s.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict.Name);

                results = (IQueryable<ProviderCaseLoad>)((csp.orderdirection == "desc")
                    ? results.OrderByDescending(keySelector)
                    : results.OrderBy(keySelector));

            }
            else if (csp.order == "ProgramName")
            {
                if (csp.orderdirection == "desc")
                {
                    results = results.OrderByDescending(s => s.ESC.Name)
                        .ThenBy(s => s.LastName).ThenBy(s => s.FirstName);
                }
                else
                {
                    results = results.OrderBy(s => s.ESC.Name)
                        .ThenBy(s => s.LastName).ThenBy(s => s.FirstName);
                }

            }
            else
            {
                results = CommonFunctions.OrderByDynamic(results, csp.order ?? "LastName", csp.orderdirection == "desc");
            }

            if (csp.take.GetValueOrDefault() > 0)
            {
                results = results
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            }

            // if provider is an assistant, students with referral reminders should show up first
            if (user.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitleId != null)
            {
                results = results.OrderByDescending(r => r.NeedsReferral && r.IsBillable);
            }

            return new ProviderCaseLoadSearch
            {
                Student = results
                    .Select(s => new ProviderCaseLoadDTO
                    {
                        Id = s.Id,
                        LastName = s.LastName,
                        FirstName = s.FirstName,
                        StudentCode = s.StudentCode,
                        SchoolDistrict = s.SchoolDistrict.Name ?? "",
                        ESC = s.ESC.Name ?? "",
                        ProgressReports = s.ProgressReports.Where(pr => s.HasIEP),
                        Assistants = s.Assistants,
                        Supervisor = (s.Supervisor.LastName + ", " + s.Supervisor.FirstName) ?? "",
                        NeedsReferral = s.NeedsReferral,
                        LatestReferralId = s.LatestReferralId ?? 0,
                        IsBillable = s.IsBillable,
                        ReferralSignature = referralSignature
                    }),
                Count = count,
            };
        }

        public int AssignStudentEsc(int studentId, int escId, int userId)
        {
            var student = _context.Students.FirstOrDefault(student => student.Id == studentId);

            student.ModifiedById = userId;
            student.DateModified = DateTime.UtcNow;
            if (escId > 0)
            {
                student.EscId = escId;

            }
            else
            {
                student.EscId = null;

            }

            return _context.SaveChanges();
        }

        public int AssignStudentSchool(int studentId, int districtId, int schoolId, int userId)
        {
            var student = _context.Students.Include(student => student.StudentDistrictWithdrawals).FirstOrDefault(student => student.Id == studentId);

            var newWithdrawal = new StudentDistrictWithdrawal()
            {
                DistrictId = districtId,
                StudentId = studentId,
                EnrollmentDate = student.EnrollmentDate,
                WithdrawalDate = DateTime.UtcNow,
                CreatedById = userId,
                DateCreated = DateTime.UtcNow,
            };

            ValidateAndThrow(newWithdrawal, new StudentDistrictWithdrawalValidator(_context));

            _context.StudentDistrictWithdrawals.Add(newWithdrawal);

            student.SchoolId = schoolId;
            student.DistrictId = districtId;
            student.EnrollmentDate = DateTime.UtcNow;
            student.ModifiedById = userId;
            student.DateModified = DateTime.UtcNow;

            student.DistrictId = _context.SchoolDistrictsSchools.FirstOrDefault(sds => sds.SchoolId == schoolId)?.SchoolDistrictId;

            return _context.SaveChanges();
        }
        public int CreateStudentWithConsent(Student student, int userId, bool addToCaseload)
        {
            student.CreatedById = userId;

            var provider = _context.Providers.FirstOrDefault(p => p.ProviderUserId == userId);
            if (provider != null && addToCaseload)
            {
                var data = new ProviderStudent()
                {
                    ProviderId = provider.Id,
                    Student = student,
                };

                _context.ProviderStudents.Add(data);
            }

            var newConsent = new StudentParentalConsent()
            {
                CreatedById = userId,
                ParentalConsentTypeId = (int)StudentParentalConsentTypes.PendingConsent,
                ParentalConsentDateEntered = DateTime.UtcNow,
                ParentalConsentEffectiveDate = DateTime.UtcNow
            };

            student.StudentParentalConsents = new List<StudentParentalConsent> { newConsent };
            _context.Students.Add(student);
            _context.SaveChanges();
            return student.Id;
        }

        public IEnumerable<SelectOptions> GetStudentSelectOptionsByDistricts(Model.Core.CRUDSearchParams csp, int userId)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Student>(csp) { };

            var districtIds = new List<int>();
            var serviceCodeIds = new List<int>();
            var provider = _context.Providers.Include(provider => provider.ProviderTitle).FirstOrDefault(p => p.ProviderUserId == userId);
            var providerIds = new List<int>();
            if (provider != null) { providerIds.Add(provider.Id); }
            var startDate = DateTime.MinValue;
            var endDate = DateTime.MaxValue;

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(cspFull.extraparams));

                var districtIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "districtIds");
                var serviceCodeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceCodeIds");
                districtIds = districtIdsParamsList["districtIds"];
                serviceCodeIds = serviceCodeIdsParamsList["ServiceCodeIds"];
                if (serviceCodeIds.Count == 0)
                {
                    serviceCodeIds = _context.ServiceCodes.Select(sc => sc.Id).ToList();
                }

                var isDistrictAdminReport = extras["IsDistrictAdminReport"] == "1";

                if (districtIds.Count == 0 && !isDistrictAdminReport)
                {
                    districtIds = _context.SchoolDistricts.Where(schoolDistrict => !schoolDistrict.Archived
                        && schoolDistrict.ProviderEscSchoolDistricts.Any(psd =>
                            psd.ProviderEscAssignment.Provider.ProviderUserId == userId
                            && !psd.ProviderEscAssignment.Archived
                            && (psd.ProviderEscAssignment.EndDate == null || psd.ProviderEscAssignment.EndDate >= DateTime.Now)))
                        .AsNoTracking()
                        .Select(schoolDistrict => schoolDistrict.Id)
                        .ToList();
                }
                if (isDistrictAdminReport)
                {
                    districtIds = new List<int>() { _context.Users.Where(u => u.Id == userId).Select(u => u.SchoolDistrictId).Single().Value };
                    providerIds = _context.Providers
                                    .Where(p => serviceCodeIds.Contains(p.ProviderTitle.ServiceCodeId))
                                    .Select(p => p.Id)
                                    .ToList();
                }

                if (extras["StartDate"] != null)
                {
                    startDate = DateTime.Parse(extras["StartDate"]);
                }

                if (extras["EndDate"] != null)
                {
                    endDate = DateTime.Parse(extras["EndDate"]);
                }

                if (extras["OtherProviders"] == "1")
                {
                    providerIds = _context.Providers.Where(p =>
                        p.ProviderTitle.ServiceCodeId == provider.ProviderTitle.ServiceCodeId &&
                        p.Id != provider.Id)
                        .Select(p => p.Id)
                        .ToList();
                }
            };

            cspFull.AddedWhereClause.Add(student =>
                student.EncounterStudents.Any(es =>
                    providerIds.Contains(es.Encounter.ProviderId) &&
                    DbFunctions.TruncateTime(es.EncounterDate) >= DbFunctions.TruncateTime(startDate) &&
                    DbFunctions.TruncateTime(es.EncounterDate) <= DbFunctions.TruncateTime(endDate)
                ) &&
                districtIds.Count > 0 &&
                (
                    districtIds.Contains((int)student.DistrictId) ||
                    student.School.SchoolDistrictsSchools.Any(sds => districtIds.Contains(sds.SchoolDistrictId))
                )
            );

            cspFull.DefaultOrderBy = "LastName";
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int count;
            return Search(cspFull, out count)
                .Select(student =>
                            new SelectOptions
                            {
                                Id = student.Id,
                                Name = student.LastName + " " + student.FirstName
                            });
        }

        public int DeleteStudent(int studentId)
        {
            if (_context.StudentParentalConsents.Any(spc => spc.StudentId == studentId &&
                spc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent))
            {
                throw new ValidationException("Student has parental consent and cannot be deleted.");
            }
            if (_context.EncounterStudents.Any(es => es.StudentId == studentId && !es.Archived))
            {
                throw new ValidationException("Student has encounter(s) and cannot be deleted.");
            }
            if (_context.SupervisorProviderStudentReferalSignOffs.Any(r => r.StudentId == studentId))
            {
                throw new ValidationException("Student has referrals and cannot be deleted.");
            }
            if (_context.StudentTherapies.Any(st => !st.Archived && st.CaseLoad.StudentId == studentId)) {
                throw new ValidationException("Student has scheduled sessions and cannot be deleted.");
            }
            var student = _context.Students.FirstOrDefault(s => s.Id == studentId);
            student.Archived = true;
            _context.SaveChanges();
            return student.Id;
        }

        public void PruneStudents21AndOver() {
            var studentsOver21 = _context.Students.Where(s => DbFunctions.DiffYears(DateTime.Now, s.DateOfBirth) >= 21);
            foreach(var student in studentsOver21) {
                student.Archived = true;
            }
            _context.SaveChanges();
        }
    }
}
