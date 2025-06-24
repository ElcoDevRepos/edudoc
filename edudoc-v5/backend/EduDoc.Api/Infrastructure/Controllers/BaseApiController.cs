using System.Security.Claims;
using EduDoc.Api.Infrastructure.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace EduDoc.Api.Infrastructure.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        protected int GetAuthUserId()
        {
            var claim = User.FindFirst(JwtSettings.ClaimTypes.AuthUserId);
            return claim != null && int.TryParse(claim.Value, out var id) ? id : 0;
        }

        protected string? GetUsername()
        {
            return User.FindFirst(JwtSettings.ClaimTypes.AuthUsername)?.Value;
        }

        protected int GetUserRoleId()
        {
            var claim = User.FindFirst(JwtSettings.ClaimTypes.UserRoleId);
            return claim != null && int.TryParse(claim.Value, out var id) ? id : 0;
        }

        protected int GetUserRoleTypeId()
        {
            var claim = User.FindFirst(JwtSettings.ClaimTypes.UserRoleTypeId);
            return claim != null && int.TryParse(claim.Value, out var id) ? id : 0;
        }
    }
} 