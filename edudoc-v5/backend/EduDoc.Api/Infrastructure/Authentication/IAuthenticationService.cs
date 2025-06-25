using System.Security.Claims;
using System.Threading.Tasks;

namespace EduDoc.Api.Infrastructure.Authentication
{
    public interface IAuthenticationService
    {
        Task<ClaimsPrincipal?> ValidateTokenAsync(string token);
    }
} 