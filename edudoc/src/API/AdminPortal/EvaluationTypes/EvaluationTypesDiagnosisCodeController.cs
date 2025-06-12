using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.EvaluationTypes
{
    [Route("api/v1/evaluation-types-diagnosis-code")]
    [Restrict(ClaimTypes.DiagnosisCodes, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EvaluationTypesDiagnosisCodeController : CrudBaseController<EvaluationTypesDiagnosisCode>
    {
        public EvaluationTypesDiagnosisCodeController(ICRUDBaseService crudService) : base(crudService)
        {

        }
    }
}
