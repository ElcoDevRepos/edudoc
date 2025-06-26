using EduDoc.Api.Infrastructure.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduDoc.Api.Endpoints.Test.Controllers
{
    public class TestAuthController : BaseApiController
    {
        [HttpGet("public")]
        [AllowAnonymous]
        public IActionResult PublicEndpoint()
        {
            return Ok(new { message = "This endpoint is public" });
        }

        [HttpGet("authenticated")]
        [Authorize]
        public IActionResult AuthenticatedEndpoint()
        {
            var auth = Auth;
            return Ok(new
            {
                message = "You are authenticated!",
                userId = auth.UserId,
                username = auth.Username,
                roleId = auth.UserRoleId,
                roleTypeId = auth.UserRoleTypeId
            });
        }
    }
} 