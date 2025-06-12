using API.Core.Claims;
using API.Common;
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
    [Route("api/v1/diagnosis-code-associations")]
    [Restrict(ClaimTypes.DiagnosisCodes, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class DiagnosisCodeAssociationsController : CrudBaseController<DiagnosisCodeAssociation>
    {

        private readonly IDiagnosisCodeAssociationService _service;

        public DiagnosisCodeAssociationsController(ICRUDService crudservice, IDiagnosisCodeAssociationService service)
            : base(crudservice)
        {
            Getbyincludes = new[] { "DiagnosisCode", "ServiceCode", "ServiceType" };
            _service = service;
        }

        [HttpGet]
        [Route("search")]
        public IEnumerable<DiagnosisCodeAssociation> DiagnosisCodeAssociations([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<DiagnosisCodeAssociation>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<DiagnosisCodeAssociation>
            {
                dca => dca.ServiceCode,
                dca => dca.ServiceType,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);


                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(association =>
                                                      association.DiagnosisCode.Code.StartsWith(t) ||
                                                      association.ServiceCode.Name.StartsWith(t) ||
                                                      association.ServiceCode.Code.StartsWith(t) ||
                                                      association.ServiceType.Name.StartsWith(t) ||
                                                      association.ServiceType.Code.StartsWith(t)
                                                 );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(association => !association.Archived);
                }

                int diagnosisCodeId = Int32.Parse(extras["DiagnosisCodeId"]);
                cspFull.AddedWhereClause.Add(association => association.DiagnosisCodeId == diagnosisCodeId);
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this);
        }

    }
}
