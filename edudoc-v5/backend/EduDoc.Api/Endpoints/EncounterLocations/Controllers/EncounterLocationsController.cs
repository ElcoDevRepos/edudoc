using MediatR;
using EduDoc.Api.Endpoints.EncounterLocations.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.EncounterLocations.Models;
using EduDoc.Api.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using EduDoc.Api.Infrastructure.Controllers;

namespace EduDoc.Api.Endpoints.EncounterLocations.Controllers;

[Route("api/encounter-locations")]
public class EncounterLocationsController : BaseApiController
{
    private readonly IMediator mediator;

    public EncounterLocationsController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    /// <summary>
    /// Retrieves all available encounter locations
    /// </summary>
    /// <returns>A list of encounter locations with their IDs and names</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(GetMultipleResponse<EncounterLocationResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetMultipleResponse<EncounterLocationResponseModel>>> GetAllEncounterLocations()
    {
        var result = await mediator.Send(new GetAllEncounterLocationsQuery());
        return Ok(result);
    }
} 