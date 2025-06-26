using MediatR;
using EduDoc.Api.Endpoints.Districts.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.Districts.Models;
using EduDoc.Api.Infrastructure.Responses;
using Microsoft.AspNetCore.Authorization;
using EduDoc.Api.Infrastructure.Controllers;

namespace EduDoc.Api.Endpoints.Districts.Controllers;

[Route("api/districts")]
public class DistrictsController : BaseApiController
{
    private readonly IMediator mediator;

    public DistrictsController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    /// <summary>
    /// Retrieves districts based on user permissions:
    /// - Administrators (user type 1): All districts
    /// - Providers (user type 2): Only districts they are associated with via ProviderEscs
    /// - District Admins (user type 3): Only their assigned district
    /// </summary>
    /// <returns>A list of districts the user has access to</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(GetMultipleResponse<DistrictResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<GetMultipleResponse<DistrictResponseModel>>> GetAllDistricts()
    {
        var auth = Auth;
        var result = await mediator.Send(new GetAllDistrictsQuery
        {
            CurrentUserRoleType = auth.UserRoleTypeId,
            CurrentUserId = auth.UserId
        });
        return Ok(result);
    }
} 