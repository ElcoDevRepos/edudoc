using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using EduDoc.Api.Infrastructure.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EduDoc.Api.EF;
using EduDocV5Client;

namespace EduDoc.Api.IntegrationTests.TestBase;

public abstract class AuthorizedIntegrationTestBase : IClassFixture<CustomWebApplicationFactory<global::Program>>, IAsyncLifetime, IDisposable
{
    protected readonly HttpClient _httpClient;
    protected readonly EduDocClient _client;
    protected readonly CustomWebApplicationFactory<global::Program> _factory;

    protected AuthorizedIntegrationTestBase(CustomWebApplicationFactory<global::Program> factory)
    {
        _factory = factory;
        _httpClient = factory.CreateClient();
        _client = new EduDocClient("", _httpClient);
    }

    /// <summary>
    /// Creates an HTTP client with a valid JWT token for the specified user role
    /// </summary>
    protected HttpClient CreateAuthorizedClient(int userRoleTypeId = 1, string userId = "1", string userName = "Test User")
    {
        var client = _factory.CreateClient();
        var token = CreateTestJwtToken(userRoleTypeId, userId, userName);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    /// <summary>
    /// Sets authorization header on the default client
    /// </summary>
    protected void SetAuthorizationHeader(int userRoleTypeId = 1, string userId = "1", string userName = "Test User")
    {
        var token = CreateTestJwtToken(userRoleTypeId, userId, userName);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    private string CreateTestJwtToken(int userRoleTypeId, string userId, string userName)
    {
        var key = "ThisIsAReallyLongAndSuperSecretKeyForTestingThatIsAtLeast512Bits";
        var issuer = "TestIssuer";

        var claims = new[]
        {
            new Claim(JwtSettings.ClaimTypes.UserRoleTypeId, userRoleTypeId.ToString()),
            new Claim(JwtSettings.ClaimTypes.AuthUserId, userId),
            new Claim(JwtSettings.ClaimTypes.AuthUsername, userName),
            new Claim(JwtSettings.ClaimTypes.UserRoleId, "1") // Default role ID for tests
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: issuer,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Called before each test - ensures fresh database
    /// </summary>
    public virtual async Task InitializeAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
        
        // Delete and recreate database for completely fresh state
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
    }

    /// <summary>
    /// Called after each test
    /// </summary>
    public virtual Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    public virtual void Dispose()
    {
        _httpClient?.Dispose();
    }
}

public static class UserRoleIds
{
    public const int Admin = 1;
    public const int Provider = 2;
    public const int SchoolDistrictAdmin = 3;
} 