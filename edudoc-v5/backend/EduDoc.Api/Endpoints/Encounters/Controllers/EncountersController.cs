using MediatR;
using EduDoc.Api.Endpoints.Encounters.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Infrastructure.Responses;

namespace EduDoc.Api.Endpoints.Encounters.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EncountersController : ControllerBase
{
    private readonly IMediator mediator;

    public EncountersController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    [HttpGet("{id}")]
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