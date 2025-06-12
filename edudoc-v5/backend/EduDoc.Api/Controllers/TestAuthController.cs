using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduDoc.Api.Controllers
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
            return Ok(new
            {
                message = "You are authenticated!",
                userId = GetAuthUserId(),
                username = GetUsername(),
                roleId = GetUserRoleId(),
                roleTypeId = GetUserRoleTypeId()
            });
        }
    }
} 