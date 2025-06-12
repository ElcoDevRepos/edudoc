using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Encounters;
using Service.Encounters.StudentTherapies.TherapyCaseNotes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.ProviderPortal.EncounterStudents
{

    [Route("api/v1/encounter-student-cpt-codes")]
    [Restrict(ClaimTypes.Revise, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class EncounterStudentCptCodesController : CrudBaseController<EncounterStudentCptCode>
    {
        private readonly IEncounterStudentCptCodeService _cptService;

        public EncounterStudentCptCodesController(IEncounterStudentCptCodeService cptService, ICRUDService crudService) : base(crudService)
        {
            _cptService = cptService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<EncounterStudentCptCode>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<EncounterStudentCptCode>
            {
                ecpt => ecpt.CptCode,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(encounterStudentCptCode => !encounterStudentCptCode.Archived);
                }

                int encounterStudentId = Int32.Parse(extras["EncounterStudentId"]);
                cspFull.AddedWhereClause.Add(encounterStudentCptCode => encounterStudentCptCode.EncounterStudentId == encounterStudentId);

            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

        

        [HttpGet]
        [Route("cptCodeOptions/{serviceTypeId:int}")]
        public IEnumerable<CptCode> GetCPTCodes(int serviceTypeId)
        {
            return _cptService.GetCPTCodes(serviceTypeId, this.GetUserId());
        }

        [HttpPost]
        [Route("{encounterId:int}/group-status-change")]
        [Restrict(ClaimTypes.Revise, ClaimValues.FullAccess)]
        public IActionResult UpdateGroupCptCodes(int encounterId)
        {
            return Ok(_cptService.UpdateGroupCptCodes(encounterId, this.GetUserId()));
        }

        [HttpPost]
        [Route("{encounterId:int}/get-individual")]
        [Restrict(ClaimTypes.Revise, ClaimValues.FullAccess)]
        public IActionResult UpdateIndividualCptCodes(int encounterId)
        {
            return Ok(_cptService.UpdateIndividualCptCodes(encounterId, this.GetUserId()));
        }

        [HttpPost]
        [Route("bulk-update")]
        public IActionResult BulkUpdate([FromBody] EncounterStudentCptCodeBulkUpdateDto dto)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_cptService.BulkUpdate(dto.EncounterStudentId, dto.SelectedCptCodeIds, dto.EncounterStudentMinutes, this.GetUserId()));
            });
        }
    }
}
