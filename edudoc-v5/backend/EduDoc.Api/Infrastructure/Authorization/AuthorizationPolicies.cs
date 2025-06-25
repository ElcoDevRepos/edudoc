using EduDoc.Api.Infrastructure.Authorization.Requirements;
using Microsoft.AspNetCore.Authorization;

namespace EduDoc.Api.Infrastructure.Authorization;

public static class AuthorizationPolicies
{
    public const string AdminOnly = "AdminOnly";
    public const string ProviderOnly = "ProviderOnly";
    public const string SchoolDistrictAdminOnly = "SchoolDistrictAdminOnly";
    public const string AdminOrProvider = "AdminOrProvider";
    public const string AdminOrSchoolDistrictAdmin = "AdminOrSchoolDistrictAdmin";
    public const string SchoolDistrictAdminOrProvider = "SchoolDistrictAdminOrProvider";

    public static void ConfigurePolicies(AuthorizationOptions options)
    {
        // Admin only policies
        options.AddPolicy(AdminOnly, policy =>
            policy.Requirements.Add(new UserRoleRequirement(UserRoles.Admin)));
            
        // Provider only policies  
        options.AddPolicy(ProviderOnly, policy =>
            policy.Requirements.Add(new UserRoleRequirement(UserRoles.Provider)));
            
        // School District Admin only policies
        options.AddPolicy(SchoolDistrictAdminOnly, policy =>
            policy.Requirements.Add(new UserRoleRequirement(UserRoles.SchoolDistrictAdmin)));
            
        // Admin or Provider (e.g., for clinical operations)
        options.AddPolicy(AdminOrProvider, policy =>
            policy.Requirements.Add(new UserRoleRequirement(UserRoles.Admin, UserRoles.Provider)));
            
        // Admin or School District Admin (e.g., for administrative functions)
        options.AddPolicy(AdminOrSchoolDistrictAdmin, policy =>
            policy.Requirements.Add(new UserRoleRequirement(UserRoles.Admin, UserRoles.SchoolDistrictAdmin)));
            
        // School District Admin or Provider (e.g., for student/encounter management)
        options.AddPolicy(SchoolDistrictAdminOrProvider, policy =>
            policy.Requirements.Add(new UserRoleRequirement(UserRoles.SchoolDistrictAdmin, UserRoles.Provider)));
    }
} 