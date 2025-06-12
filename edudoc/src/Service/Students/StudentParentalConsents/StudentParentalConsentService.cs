
using BreckServiceBase.Utilities.Interfaces;
using Humanizer;
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

namespace Service.StudentParentalConsents
{
    public class StudentParentalConsentService : CRUDBaseService, IStudentParentalConsentService
    {
        private readonly IPrimaryContext _context;
        public StudentParentalConsentService(IPrimaryContext context, IEmailHelper emailHelper)
            : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }

        public ClaimsSummaryDTO GetClaimsSummary(int schoolDistrictId, int userId)
        {
            var user = GetById<User>(userId, new string[] { "AuthUser", "AuthUser.UserRole" });

            var sdId = user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.DistrictAdmin && user.SchoolDistrictId != null ? user.SchoolDistrictId : schoolDistrictId;

            var encounters = _context.EncounterStudents
                .Where(es => !es.Archived && es.Student.DistrictId == sdId && !es.CaseLoad.Archived && es.CaseLoad.StudentType.IsBillable)
                .Select(es => es.Encounter.Provider.ProviderTitle.ServiceCodeId).AsEnumerable();

            var dto = new ClaimsSummaryDTO
            {
                SchoolDistrictAdminId = userId,
                SpeechTherapy = encounters.Count(e => e == (int)ServiceCodes.Speech_Therapy),
                Psychology = encounters.Count(e => e == (int)ServiceCodes.Psychology),
                OccupationalTherapy = encounters.Count(e => e == (int)ServiceCodes.Occupational_Therapy),
                PhysicalTherapy = encounters.Count(e => e == (int)ServiceCodes.Physical_Therapy),
                Nursing = encounters.Count(e => e == (int)ServiceCodes.Nursing),
                NonMSPService = encounters.Count(e => e == (int)ServiceCodes.Non_Msp_Service),
                Counseling = encounters.Count(e => e == (int)ServiceCodes.Counseling_Social_Work),
                Audiology = encounters.Count(e => e == (int)ServiceCodes.Audiology),
            };
            return dto;
        }

        public StudentParentalConsentSearch SearchStudentParentalConsents(Model.Core.CRUDSearchParams csp, int userId)
        {

            var user = GetById<User>(userId, new string[] { "AuthUser", "AuthUser.UserRole" });
            var withEncountersOnly = false;

            var baseQuery = _context.Students
                .Include(s => s.StudentParentalConsents.Select(spc => spc.StudentParentalConsentType))
                .Include(s => s.School)
                .Where(student =>
                !student.Archived &&
                student.StudentParentalConsents.Any(c =>
                    c.ParentalConsentEffectiveDate < DateTime.UtcNow)
            );

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query);
                baseQuery = baseQuery.Where(s =>
                                                                terms.Any(t => s.FirstName.StartsWith(t)) ||
                                                                terms.Any(t => s.LastName.StartsWith(t)) ||
                                                                terms.Any(t => s.StudentCode.StartsWith(t))
                                                            );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["ConsentTypeIds"] != null)
                {
                    var consentTypeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ConsentTypeIds");
                    var consentTypeIds = consentTypeIdsParamsList["ConsentTypeIds"];

                    if (consentTypeIds.Count > 0)
                        baseQuery = baseQuery.Where(student => consentTypeIds.Any(ct => student.StudentParentalConsents.OrderByDescending(c => c.DateCreated).ThenByDescending(c => c.ParentalConsentDateEntered).FirstOrDefault(x => x.ParentalConsentEffectiveDate < DateTime.Now).ParentalConsentTypeId == ct));
                }

                if (extras["GradeIds"] != null)
                {
                    var gradeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "GradeIds");
                    var gradeIds = gradeIdsParamsList["GradeIds"];

                    if (gradeIds.Count > 0)
                        baseQuery = baseQuery.Where(student => gradeIds.Any(g => student.Grade == g.ToString()));
                }

                if (extras["SchoolIds"] != null)
                {
                    var schoolIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "SchoolIds");
                    var schoolIds = schoolIdsParamsList["SchoolIds"];

                    if (schoolIds.Count > 0)
                        baseQuery = baseQuery.Where(student => schoolIds.Any(s => student.School.Id == s));
                }

                if (extras["DistrictIds"] != null)
                {
                    var districtIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "DistrictIds");
                    var districtIds = districtIdsParamsList["DistrictIds"];

                    if (districtIds.Count > 0)
                    {
                        baseQuery = baseQuery.Where(student => districtIds.Contains((int)student.DistrictId));
                    }
                    else if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.DistrictAdmin)
                    {
                        baseQuery = baseQuery.Where(student => student.SchoolDistrict.Id == user.SchoolDistrictId);
                    }
                }
                else if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.DistrictAdmin)
                {
                    baseQuery = baseQuery.Where(student => student.SchoolDistrict.Id == user.SchoolDistrictId);
                }

                if (extras["WithEncountersOnly"] == "1")
                {
                    baseQuery = baseQuery.Where(student => student.EncounterStudents.Any(es => !es.Archived));
                }

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(student => student.DateOfBirth >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(student => student.DateOfBirth <= DbFunctions.TruncateTime(endDate));
                }

                if (extras["WithEncountersOnly"] == "1")
                {
                    baseQuery = baseQuery.Where(student => student.EncounterStudents.Any(es => !es.Archived));
                    withEncountersOnly = true;
                }

            }

            if (csp.order != "ConsentStatus" && csp.order != "SchoolBuilding" && csp.order != "EffectiveDate")
            {
                baseQuery = CommonFunctions.OrderByDynamic(baseQuery, csp.order ?? "LastName", csp.orderdirection == "desc");
            }

            if (csp.order == "Grade")
            {
                if (csp.orderdirection == "desc")
                {
                    baseQuery = baseQuery.OrderByDescending(s => s.Grade.Length).ThenByDescending(s => s.Grade);
                }
                else
                {
                    baseQuery = baseQuery.OrderBy(s => s.Grade.Length).ThenBy(s => s.Grade);
                }
            }

            if (csp.order == "ConsentStatus")
            {
                if (csp.orderdirection == "desc")
                {
                    baseQuery = baseQuery.OrderByDescending(s => s.StudentParentalConsents.FirstOrDefault()
                        .StudentParentalConsentType.Name);
                }
                else
                {
                    baseQuery = baseQuery.OrderBy(s => s.StudentParentalConsents.FirstOrDefault()
                        .StudentParentalConsentType.Name);
                }
            }

            if (csp.order == "SchoolBuilding")
            {
                if (csp.orderdirection == "desc")
                {
                    baseQuery = baseQuery.OrderByDescending(s => s.School.Name);
                }
                else
                {
                    baseQuery = baseQuery.OrderBy(s => s.School.Name);
                }
            }

            if (csp.order == "EffectiveDate")
            {
                if (csp.orderdirection == "desc")
                {
                    baseQuery = baseQuery
                                    .OrderByDescending(s => s.StudentParentalConsents
                                                                .Where(c => c.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent)
                                                                .OrderByDescending(c => c.DateCreated)
                                                                .ThenByDescending(c => c.ParentalConsentDateEntered)
                                                                .FirstOrDefault(c => c.ParentalConsentEffectiveDate <= DateTime.UtcNow)
                                                                .ParentalConsentEffectiveDate);
                }
                else
                {
                    baseQuery = baseQuery
                                    .OrderBy(s => s.StudentParentalConsents
                                                                .Where(c => c.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent)
                                                                .OrderByDescending(c => c.DateCreated)
                                                                .ThenByDescending(c => c.ParentalConsentDateEntered)
                                                                .FirstOrDefault(c => c.ParentalConsentEffectiveDate <= DateTime.UtcNow)
                                                                .ParentalConsentEffectiveDate);
                }
            }

            if (withEncountersOnly)
            {
                baseQuery = baseQuery.Where(q =>
                    q.EncounterStudents.Any(es =>
                            !es.Archived &&
                            !es.CaseLoad.Archived &&
                            es.CaseLoad.StudentType.IsBillable &&
                            es.EncounterStudentCptCodes.Any()
                    )
                );
            }

            var count = baseQuery.Count();

            if (csp.take.GetValueOrDefault() > 0)
            {
                baseQuery = baseQuery
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            }

            return new StudentParentalConsentSearch
            {
                StudentParentalConsents = baseQuery.AsNoTracking()
                    .Select(q => new StudentWithParentalConsentDTO
                    {
                        Id = q.Id,
                        LastName = q.LastName,
                        FirstName = q.FirstName,
                        StudentCode = q.StudentCode,
                        School = q.School,
                        Grade = q.Grade,
                        DateOfBirth = q.DateOfBirth,
                        Consent = q.StudentParentalConsents.Any()
                                    ? q.StudentParentalConsents
                                        .OrderByDescending(c => c.DateCreated)
                                        .ThenByDescending(c => c.ParentalConsentDateEntered)
                                        .FirstOrDefault() // can be sure of data
                                        .StudentParentalConsentType
                                    : null,
                        TotalBillableClaims = q.EncounterStudents.Any() ? q.EncounterStudents.Where(es =>
                            !es.Archived && !es.CaseLoad.Archived && es.CaseLoad.StudentType.IsBillable)
                                .Select(es => es.EncounterStudentCptCodes).Count() : 0,
                        EffectiveDate = q.StudentParentalConsents
                                            .Any(c => c.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent)
                                            ? q.StudentParentalConsents
                                                .Where(c => c.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent)
                                                .OrderByDescending(c => c.DateCreated)
                                                .ThenByDescending(c => c.ParentalConsentDateEntered)
                                                .FirstOrDefault() // can be sure of data
                                                .ParentalConsentEffectiveDate
                                            : null,
                    }),
                Count = count,
            };

        }

        public StudentParentalConsentDistrictSearch SearchStudentParentalConsentsByDistrict(Model.Core.CRUDSearchParams csp, int userId)
        {
            var selectedConsentTypeIds = new List<int>();

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["ConsentTypeIds"] != null)
                {
                    var consentTypeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ConsentTypeIds");
                    selectedConsentTypeIds = consentTypeIdsParamsList["ConsentTypeIds"];
                }
            }

            var filteredData = _context.SchoolDistricts
                .Where(sd => !sd.Archived)
                .Select(sd => new
                {
                    sd.Id,
                    sd.Name,
                    Students = sd.Students
                        .Where(st => st.StudentParentalConsents
                        .Any(c => c.ParentalConsentEffectiveDate < DateTime.UtcNow))
                        .Select(st => new
                        {
                            Student = st,
                            ConsentTypeId = st.StudentParentalConsents
                                .OrderByDescending(c => c.ParentalConsentDateEntered)
                                .FirstOrDefault(x => x.ParentalConsentEffectiveDate < DateTime.Now).ParentalConsentTypeId
                        })
                        .Where(st =>  !selectedConsentTypeIds.Any() ||
                                     selectedConsentTypeIds.Contains(st.ConsentTypeId))
                })
                .AsNoTracking();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query);
                filteredData = filteredData
                    .Where(s => terms.Any(t => s.Name.StartsWith(t)));
            }

            var total = filteredData.Count();

            if (csp.take.GetValueOrDefault() > 0 && csp.orderdirection == "asc")
            {
                filteredData = filteredData
                    .OrderBy(sd => sd.Name)
                    .Skip(csp.skip.GetValueOrDefault())
                    .Take(csp.take.GetValueOrDefault());
            }
            else if (csp.take.GetValueOrDefault() > 0 && csp.orderdirection == "desc")
            {
                filteredData = filteredData
                    .OrderByDescending(sd => sd.Name)
                    .Skip(csp.skip.GetValueOrDefault())
                    .Take(csp.take.GetValueOrDefault());
            }

            var result = filteredData.ToList();

            return new StudentParentalConsentDistrictSearch
            {
                StudentParentalConsents = result
                    .Select(sd => new StudentWithParentalConsentDistrictDTO
                    {
                        Id = sd.Id,
                        DistrictName = sd.Name,
                        TotalEncounters = sd.Students.Count()
                    }),
                Count = total,
            };
        }

    }
}
