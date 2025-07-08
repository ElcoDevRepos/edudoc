using EduDoc.Api.EF;
using EduDoc.Api.Infrastructure.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EduDoc.Api.IntegrationTests.Infrastructure
{
    public  class TestResources
    {
        public required EdudocSqlContext DbContext { get; set; }

        public required HttpClient AuthenticatedHttpClient { get; set; }

        public required HttpClient UnauthenticatedHttpClient { get; set; }


        public required TestDatabaseRepository TestDatabaseRepository { get; set; }


        public EduDocV5Client.EduDocClient GetAuthenticatedApiClient(
            int userRoleTypeId = 1,
            string userId = "1",
            string userName = "username")
        {
            var token = CreateTestJwtToken(
                userRoleTypeId,
                userId,
                userName);

            AuthenticatedHttpClient.DefaultRequestHeaders.Clear();
            AuthenticatedHttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            return new EduDocV5Client.EduDocClient("", AuthenticatedHttpClient);
        }

        public EduDocV5Client.EduDocClient GetUnauthenticatedApiClient()
        {
            AuthenticatedHttpClient.DefaultRequestHeaders.Clear();
            return new EduDocV5Client.EduDocClient("", UnauthenticatedHttpClient);
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

    }
}
