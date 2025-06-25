using EduDoc.Api.Infrastructure.Authorization.Requirements;
using EduDoc.Api.Infrastructure.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace EduDoc.Api.Infrastructure.Authorization.Handlers;

public class UserRoleHandler : AuthorizationHandler<UserRoleRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRoleRequirement requirement)
    {
        var userRoleTypeClaim = context.User.FindFirst(JwtSettings.ClaimTypes.UserRoleTypeId);
        
        if (userRoleTypeClaim != null && int.TryParse(userRoleTypeClaim.Value, out var userRoleTypeId))
        {
            if (requirement.AllowedRoleIds.Contains(userRoleTypeId))
            {
                context.Succeed(requirement);
            }
        }

        return Task.CompletedTask;
    }
} 