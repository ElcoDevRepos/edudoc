using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace API.EvaluationTypes
{
    [Route("api/v1/evaluation-types")]
    [Restrict(ClaimTypes.AppSettings, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EvaluationTypeController : CrudBaseController<EvaluationType>
    {
        public EvaluationTypeController(ICRUDBaseService crudService) : base(crudService)
        {
            Getbyincludes = new[] { "EvaluationTypesDiagnosisCodes", "EvaluationTypesDiagnosisCodes.DiagnosisCode" };
            Searchchildincludes = new[] { "EvaluationTypesDiagnosisCodes", "EvaluationTypesDiagnosisCodes.DiagnosisCode" };
        }

        /// <summary>
        /// Gets all evaluation types and non-archived diagnosis code assocations 
        /// </summary>
        /// <returns></returns>
        public override IActionResult GetAll()
        {
            var csp = new Model.Core.CRUDSearchParams<EvaluationType>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<EvaluationType>
                   {
                       e => e.EvaluationTypesDiagnosisCodes,
                   }
            };
            return Ok(Crudservice.GetAll(csp)
                .Select(e =>
                {
                    e.EvaluationTypesDiagnosisCodes = e.EvaluationTypesDiagnosisCodes.Where(d => !d.Archived).ToList();
                    return e;
                }));
        }

    }
}
