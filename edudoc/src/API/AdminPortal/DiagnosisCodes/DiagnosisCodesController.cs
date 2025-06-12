using API.Core.Claims;
using API.Common;
using API.Common.SearchUtilities;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.DiagnosisCodes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using ClaimTypes = API.Core.Claims.ClaimTypes;

namespace API.DiagnosisCodes
{
    [Route("api/v1/diagnosiscodes")]
    [Restrict(ClaimTypes.DiagnosisCodes, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class DiagnosisCodesController : CrudBaseController<DiagnosisCode>
    {

        private readonly IDiagnosisCodeService _service;

        public DiagnosisCodesController(ICRUDService crudservice, IDiagnosisCodeService service)
            : base(crudservice)
        {
            Getbyincludes = new[] { "DiagnosisCodeAssociations", "DiagnosisCodeAssociations.ServiceCode", "DiagnosisCodeAssociations.ServiceType" };
            _service = service;
        }

        // Need to override GetAll to provided a sort order because DiagnosisCode does not
        // have the default "Name" property used by GetAll.
        public override IActionResult GetAll()
        {
            var csp = new Model.Core.CRUDSearchParams<DiagnosisCode> { order = "Code" };
            return Ok(Crudservice.GetAll(csp));
        }

        public override IActionResult Update([FromRoute] int id, [FromBody] DiagnosisCode data)
        {
            return base.Update(id, data);
        }

        [HttpGet]
        [Route("search")]
        public IEnumerable<DiagnosisCode> DiagnosisCodes([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<DiagnosisCode>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<DiagnosisCode>
            {
                dc => dc.DiagnosisCodeAssociations,
                dc => dc.DiagnosisCodeAssociations.Select(da => da.ServiceCode),
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);


                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(d =>
                                                      d.Code.StartsWith(t)
                                                 );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(d => !d.Archived);
                }
                
                var serviceCodeIdsParamsList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "servicecodeids");
                var serviceCodeIds = serviceCodeIdsParamsList["servicecodeids"];

                var serviceTypeIdsParamsList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "servicetypeids");
                var serviceTypeIds = serviceTypeIdsParamsList["servicetypeids"];

                if (serviceCodeIds.Count > 0 && serviceTypeIds.Count == 0)
                    cspFull.AddedWhereClause.Add(diagnosisCode => diagnosisCode.DiagnosisCodeAssociations.Any(association => serviceCodeIds.Contains(association.ServiceCodeId)));

                if (serviceTypeIds.Count > 0 && serviceCodeIds.Count == 0)
                    cspFull.AddedWhereClause.Add(diagnosisCode => diagnosisCode.DiagnosisCodeAssociations.Any(association => serviceTypeIds.Contains(association.ServiceTypeId)));

                if (serviceCodeIds.Count > 0 && serviceTypeIds.Count > 0)
                    cspFull.AddedWhereClause.Add(diagnosisCode => diagnosisCode.DiagnosisCodeAssociations.Any(association => serviceCodeIds.Contains(association.ServiceCodeId) && serviceTypeIds.Contains(association.ServiceTypeId)));


            }

            cspFull.DefaultOrderBy = "Code";
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this);
        }

        public override IActionResult Create(DiagnosisCode diagnosisCode)
        {
            if (diagnosisCode == null) return BadRequest();
            var userId = this.GetUserId();

            foreach (var dca in diagnosisCode.DiagnosisCodeAssociations)
            {
                dca.CreatedById = userId;
            }

            return base.Create(diagnosisCode);
        }

    }
}
