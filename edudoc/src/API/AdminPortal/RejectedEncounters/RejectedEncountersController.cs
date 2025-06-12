using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using API.Claims;
using API.Core.Claims;
using API.Common;
using API.Common.SearchUtilities;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Enums;
using Service.Base;
using Service.RejectedEncounters;

namespace API.RejectedEncounters
{
    [Route("api/v1/rejected-encounters")]
    [Restrict(ClaimTypes.RejectedEncounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class RejectedEncountersController : CrudBaseController<ClaimsEncounter>
    {
        private readonly IRejectedEncountersService _rejectedEncounterService;

        public RejectedEncountersController(
            ICRUDService crudService,
            IRejectedEncountersService rejectedEncounterService
        )
            : base(crudService)
        {
            Getbyincludes = new[] { "ServiceCodes" };
            Searchchildincludes = new[]
            {
                "EncounterStudent",
                "EdiErrorCode",
                "EncounterStudent.Student",
                "EncounterStudent.Student.SchoolDistrict",
                "EncounterStudent.Student.School",
                "EncounterStudent.Encounter",
                "EncounterStudent.Encounter.Provider",
                "EncounterStudent.Encounter.Provider.ProviderUser",
                "EncounterStudent.Encounter.Provider.ProviderEscAssignments",
                "EncounterStudent.Encounter.Provider.ProviderEscAssignments.ProviderEscSchoolDistricts",
                "EncounterStudent.Encounter.Provider.ProviderEscAssignments.ProviderEscSchoolDistricts.SchoolDistrict",
            };
            _rejectedEncounterService = rejectedEncounterService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ClaimsEncounter>(csp);
            cspFull.Includes = Searchchildincludes;
            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(claimsEncounter =>
                    terms.All(t =>
                        claimsEncounter.EncounterStudent.EncounterNumber.StartsWith(t.ToLower())
                        || claimsEncounter.EncounterStudent.Student.LastName.StartsWith(t.ToLower())
                        || claimsEncounter.EncounterStudent.Student.FirstName.StartsWith(
                            t.ToLower()
                        )
                    )
                );
            }

            cspFull.AddedWhereClause.Add(claimsEncounter =>
                claimsEncounter.EncounterStudent.EncounterStatusId
                    == (int)EncounterStatuses.Invoiced_and_Denied
                && claimsEncounter.Response
                && !claimsEncounter.Rebilled
            );

            // Filters for EdierrorCode

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var ediErrorCodeIdParamList = SearchStaticMethods.GetIntListFromExtraParams(
                    csp.extraparams,
                    "EdiErrorCodeIds"
                );
                var ediErrorCodeIds = ediErrorCodeIdParamList["EdiErrorCodeIds"];
                if (ediErrorCodeIds.Any())
                    cspFull.AddedWhereClause.Add(claims =>
                        ediErrorCodeIds.Contains((int)claims.EdiErrorCodeId)
                    );

                var cptCodeParamList = SearchStaticMethods.GetStringListFromExtraParams(
                    csp.extraparams,
                    "CptCodes"
                );
                var cptCodeIds = cptCodeParamList["CptCodes"];
                if (cptCodeIds.Any())
                    cspFull.AddedWhereClause.Add(claims =>
                        cptCodeIds.Contains(claims.ProcedureIdentifier)
                    );

                var providerIdParam = SearchStaticMethods.GetIntParametersFromExtraParams(
                    csp.extraparams,
                    "providerId"
                );
                var providerId = providerIdParam["providerId"];
                if (providerId > 0)
                    cspFull.AddedWhereClause.Add(claims =>
                        claims.EncounterStudent.Encounter.ProviderId == providerId
                    );

                var schoolDistrictIdParam = SearchStaticMethods.GetIntParametersFromExtraParams(
                    csp.extraparams,
                    "districtId"
                );
                var schoolDistrictId = schoolDistrictIdParam["districtId"];
                if (schoolDistrictId > 0)
                    cspFull.AddedWhereClause.Add(claims =>
                        claims.EncounterStudent.Student.SchoolDistrict.Id == schoolDistrictId
                    );

                var extras = System.Web.HttpUtility.ParseQueryString(
                    WebUtility.UrlDecode(csp.extraparams)
                );
                if (extras["unRegisteredOnly"] == "1")
                {
                    cspFull.AddedWhereClause.Add(claims => !claims.EdiErrorCodeId.HasValue);
                }

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    cspFull.AddedWhereClause.Add(claims =>
                        DbFunctions.TruncateTime(claims.VoucherDate)
                        >= DbFunctions.TruncateTime(startDate)
                    );
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    cspFull.AddedWhereClause.Add(claims =>
                        DbFunctions.TruncateTime(claims.VoucherDate)
                        <= DbFunctions.TruncateTime(endDate)
                    );
                }
            }

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(csp.order, csp.orderdirection)
            );

            int ct;
            return Ok(
                Crudservice.Search(cspFull, out ct).AsQueryable().ToSearchResults(ct).Respond(this)
            );
        }

        [HttpPost]
        [Route("generate")]
        public IActionResult GenerateReBillingFile([FromBody] int[] rebillingIds)
        {
            _rejectedEncounterService.GenerateRebillingHealthCareClaim(
                rebillingIds,
                this.GetUserId()
            );
            return Ok();
        }
    }
}
