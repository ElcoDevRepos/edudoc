using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.DeviationReasons.Models;
using EduDoc.Api.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using EduDoc.Api.Infrastructure.Controllers;
using EduDoc.Api.Endpoints.DeviationReasons.Queries;

namespace EduDoc.Api.Endpoints.DeviationReasons.Controllers;

[Route("api/deviation-reasons")]
public class DeviationReasonsController : BaseApiController
{
    private readonly IMediator mediator;

    public DeviationReasonsController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    /// <summary>
    /// Retrieves all available deviation reasons
    /// </summary>
    /// <returns>A list of deviation reasons with their IDs and names</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(GetMultipleResponse<DeviationReasonResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetMultipleResponse<DeviationReasonResponseModel>>> GetAllDeviationReasons()
    {
        var result = await mediator.Send(new GetAllDeviationReasonsQuery());
        return Ok(result);
    }
} 