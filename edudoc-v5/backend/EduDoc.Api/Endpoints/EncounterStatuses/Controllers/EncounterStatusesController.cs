using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.EncounterStatuses.Models;
using EduDoc.Api.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using EduDoc.Api.Infrastructure.Controllers;
using EduDoc.Api.Endpoints.EncounterStatuses.Queries;

namespace EduDoc.Api.Endpoints.EncounterStatuses.Controllers;

[Route("api/encounter-statuses")]
public class EncounterStatusesController : BaseApiController
{
    private readonly IMediator mediator;

    public EncounterStatusesController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    /// <summary>
    /// Retrieves all available encounter statuses
    /// </summary>
    /// <returns>A list of encounter statuses with their IDs and names</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(GetMultipleResponse<EncounterStatusResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetMultipleResponse<EncounterStatusResponseModel>>> GetAllEncounterStatuses()
    {
        var result = await mediator.Send(new GetAllEncounterStatusesQuery());
        return Ok(result);
    }
} 