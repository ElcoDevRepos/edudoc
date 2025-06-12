using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Linq;
using API.CRUD;
using Service.Encounters;
using System.Collections.Generic;
using Model.Enums;
using System;
using API.Common.SearchUtilities;
using System.Net;

namespace API.Common.DistrictAdminEncountersByTherapist
{
    [Route("api/v1/district-admin-encounters-by-therapist")]
    [Restrict(ClaimTypes.EncounterReportingByTherapist, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class DistrictAdminEncountersController : CrudBaseController<Encounter>
    {
        private readonly IEncounterService _encounterService;

        public DistrictAdminEncountersController(
                    ICRUDService crudService,
                    IEncounterService encounterService
        ) : base(crudService)
        {
            _encounterService = encounterService;
        }

        [Route("get-encounters/{districtId}")]
        [HttpGet]
        [Restrict(ClaimTypes.EncounterReportingByTherapist, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetEncounters(int districtId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Encounter>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Encounter>
            {
                encounter => encounter.EncounterStudents,
                encounter => encounter.EncounterStudents.Select(es => es.Student),
                encounter => encounter.EncounterStudents.Select(es => es.EncounterStatus),
                encounter => encounter.EncounterStudents.Select(es => es.EncounterLocation),
                encounter => encounter.EncounterStudents.Select(es => es.CaseLoad),
                encounter => encounter.EncounterStudents.Select(es => es.CaseLoad.CaseLoadScripts),
                encounter => encounter.ServiceType,
                encounter => encounter.EvaluationType,
                encounter => encounter.Provider.ProviderUser,
                encounter => encounter.Provider.ProviderTitle,
            }
            };

            cspFull.AddedWhereClause.Add(encounter => encounter.EncounterStudents.Where(es => !es.Archived).Any());

            cspFull.AddedWhereClause.Add(encounter => encounter.EncounterStudents.FirstOrDefault().Student.DistrictId == districtId
             || encounter.EncounterStudents.FirstOrDefault().Student.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrictId == districtId);

            cspFull.AddedWhereClause.Add(encounter => !encounter.Archived);

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                cspFull.AddedWhereClause.Add(p =>
                    terms.All(t => (p.EncounterStudents.Any(x => x.Student.FirstName.StartsWith(t) || (x.Student.LastName.StartsWith(t)))))
                    || terms.All(t => p.Provider.ProviderUser.FirstName.StartsWith(t) || p.Provider.ProviderUser.LastName.StartsWith(t)));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extraParamLists = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, new[] { "returnedOnly", "pendingEvaluationOnly" });

                var returnedOnlyList = extraParamLists["returnedOnly"];
                if (returnedOnlyList.Count > 0 && returnedOnlyList[0])
                    cspFull.AddedWhereClause.Add(encounter => encounter.EncounterStudents.Any(es => es.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter));

                var pendingEvaluationOnly = extraParamLists["pendingEvaluationOnly"];
                if (pendingEvaluationOnly.Count > 0 && pendingEvaluationOnly[0])
                    cspFull.AddedWhereClause.Add(encounter => encounter.EncounterStudents.Any(es => es.EncounterDate < DateTime.Now && !es.DateESigned.HasValue));

                #region non-bool parameters
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                #region Date range
                var minDateString = extras["minDate"];
                if (!string.IsNullOrEmpty(minDateString))
                {
                    var minDate = DateTime.Parse(minDateString);
                    cspFull.AddedWhereClause.Add(encounter => encounter.EncounterDate >= minDate);
                }
                var maxDateString = extras["maxDate"];
                if (!string.IsNullOrEmpty(maxDateString))
                {
                    var maxDate = DateTime.Parse(maxDateString);
                    cspFull.AddedWhereClause.Add(encounter => encounter.EncounterDate <= maxDate);
                }
                #endregion Date Range

                var providerIdString = extras["providerId"];
                if(!string.IsNullOrEmpty(providerIdString)) {
                    var providerId = Int32.Parse(providerIdString);
                    cspFull.AddedWhereClause.Add(encounter => encounter.ProviderId == providerId);
                }

                var titleIds = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "providerTitleIds")["providerTitleIds"];
                if(titleIds != null && titleIds.Count > 0) {
                    cspFull.AddedWhereClause.Add(encounter => titleIds.Contains(encounter.Provider.TitleId));
                }
                #endregion non-bool parameters
            }

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>("Id", "desc"));

            return Ok(Crudservice.Search(cspFull, out int count).AsQueryable()
                            .ToSearchResults(count)
                            .Respond(this));
        }
    }
}
