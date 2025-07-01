using MediatR;
using EduDoc.Api.Endpoints.Encounters.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using EduDoc.Api.Infrastructure.Controllers;

namespace EduDoc.Api.Endpoints.Encounters.Controllers;

[Route("api/encounters")]
public class EncountersController : BaseApiController
{
    private readonly IMediator mediator;

    public EncountersController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    /// <summary>
    /// Retrieves a specific encounter by ID
    /// </summary>
    /// <param name="id">The encounter ID</param>
    /// <returns>The encounter details if found</returns>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(GetSingleResponse<EncounterResponseModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetSingleResponse<EncounterResponseModel>>> GetEncounterById(int id)
    {
        var result = await mediator.Send(new GetEncounterByIdQuery { Id = id });

        // little unsure how we want the contract to the api to look here this is thrown together. We want to define what our wrappers look like

        if (result == null)
        {
            return NotFound();
        }

        return Ok(new GetSingleResponse<EncounterResponseModel>(result));
    }

}