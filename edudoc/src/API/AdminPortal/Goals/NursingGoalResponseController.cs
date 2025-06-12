using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.NursingGoalResponses
{
    [Route("api/v1/nursing-goal-responses")]
    [Restrict(ClaimTypes.ProviderGoals, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class NursingGoalResponseController : CrudBaseController<NursingGoalResponse>
    {

        public NursingGoalResponseController(ICRUDBaseService crudservice) : base(crudservice)
        {
        }

    }
}
