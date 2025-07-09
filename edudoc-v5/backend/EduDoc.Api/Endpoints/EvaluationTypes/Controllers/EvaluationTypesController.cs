using MediatR;
using EduDoc.Api.Endpoints.EvaluationTypes.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.EvaluationTypes.Models;
using EduDoc.Api.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using EduDoc.Api.Infrastructure.Controllers;

namespace EduDoc.Api.Endpoints.EvaluationTypes.Controllers;

[Route("api/evaluation-types")]
public class EvaluationTypesController : BaseApiController
{
    private readonly IMediator mediator;

    public EvaluationTypesController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    /// <summary>
    /// Retrieves all available evaluation types
    /// </summary>
    /// <returns>A list of evaluation types with their IDs and names</returns>
    [HttpGet("", Name = "GetAllEvaluationTypes")]
    [ProducesResponseType(typeof(GetMultipleResponse<EvaluationTypeResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetMultipleResponse<EvaluationTypeResponseModel>>> GetAllEvaluationTypes()
    {
        var result = await mediator.Send(new GetAllEvaluationTypesQuery());
        return Ok(result);
    }
} 