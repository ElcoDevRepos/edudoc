using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.NursingGoalResults
{
    [Route("api/v1/nursing-goal-results")]
    public class NursingGoalResultsController : CrudBaseController<NursingGoalResult>
    {
        public NursingGoalResultsController(ICRUDService crudService)
            : base(crudService)
        {
            Getbyincludes = new[] { "NursingGoalResponses" };
            Searchchildincludes = new[] { "NursingGoalResponses" };
        }
    }
}
