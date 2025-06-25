using System.Security.Claims;
using EduDoc.Api.Infrastructure.Configuration;
using EduDoc.Api.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace EduDoc.Api.Infrastructure.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        public AuthModel Auth
        {
            get
            {
                return new AuthModel()
                {
                    UserId = int.Parse(User.FindFirst(JwtSettings.ClaimTypes.AuthUserId)?.Value ?? "0"),
                    Username = User.FindFirst(JwtSettings.ClaimTypes.AuthUsername)?.Value ?? "",
                    UserRoleId = int.Parse(User.FindFirst(JwtSettings.ClaimTypes.UserRoleId)?.Value ?? "0"),
                    UserRoleTypeId = int.Parse(User.FindFirst(JwtSettings.ClaimTypes.UserRoleTypeId)?.Value ?? "0")
                };
            }
        }
    }
} 