using Microsoft.AspNetCore.Authorization;

namespace EduDoc.Api.Infrastructure.Authorization.Requirements;

public class UserRoleRequirement : IAuthorizationRequirement
{
    public UserRoleRequirement(params int[] allowedRoleIds)
    {
        AllowedRoleIds = allowedRoleIds;
    }

    public int[] AllowedRoleIds { get; }
}

public static class UserRoles
{
    public const int Admin = 1;
    public const int Provider = 2;
    public const int SchoolDistrictAdmin = 3;
} 