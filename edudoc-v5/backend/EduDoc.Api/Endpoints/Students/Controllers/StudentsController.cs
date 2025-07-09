using MediatR;
using EduDoc.Api.Endpoints.Students.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using EduDoc.Api.Infrastructure.Controllers;
using EduDoc.Api.Endpoints.Students.Validators;

namespace EduDoc.Api.Endpoints.Students.Controllers;

[Route("api/students")]
public class StudentsController : BaseApiController
{
    private readonly IMediator mediator;

    public StudentsController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    /// <summary>
    /// Searches for students using a text string and optionally filters by district
    /// </summary>
    /// <param name="model">Search criteria including search text and optional district ID</param>
    /// <returns>A list of students matching the search criteria</returns>
    [HttpPost("search", Name = "SearchStudents")]
    [ProducesResponseType(typeof(GetMultipleResponse<StudentResponseModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<GetMultipleResponse<StudentResponseModel>>> SearchStudents([FromBody] StudentSearchRequestModel model)
    {
        var result = await mediator.Send(new SearchStudentsQuery
        {
            Model = model,
            Auth = this.Auth,
        });

        if(result.Success)
        {
            return this.Ok(result);
        }
        else
        {
            return this.UnprocessableEntity(result);
        }       
    }
} 