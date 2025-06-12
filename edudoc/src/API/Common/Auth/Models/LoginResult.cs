using API.Jwt;
using Model;
using Service.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using API.Models;

namespace API.Auth.Models
{
    /// <summary>
    ///      Result dto to return to client. Should contain any info that must be associated with the
    ///      logged in user.
    /// </summary>
    public class LoginResult
    {
        public LoginResult()
        {
        }

        public LoginResult(string jwt, JwtConfig config, int authId, DateTime issuedUtc, Guid refreshTokenGuid)
        {
            AuthId = authId;
            Jwt = jwt;
            IssuedUtc = issuedUtc;
            ExpiresUtc = issuedUtc.AddMinutes(config.AccessMinutes);
            RefreshTokenIdentifier = refreshTokenGuid.ToString();
        }

        public int AuthId { get; set; }
        public DateTime ExpiresUtc { get; set; }
        public DateTime IssuedUtc { get; set; }
        public string Jwt { get; set; }
        public string CsrfToken { get; set; }
        public string RefreshTokenIdentifier { get; set; }
        public Dictionary<int, int> ClaimFlags { get; set; }

        public LoginResult GetBaseLoginResult(IAuthService AuthService, AuthUser authUser, AuthClient client, JwtConfig config, IDictionary<string, string> additionalPayload = null)
        {
            config.RefreshMinutes = client.RefreshTokenMinutes; // MUST set refresh minutes by client
            var now = DateTime.UtcNow;
            IDictionary<string, string[]> payload = CreateJwtPayload(authUser, client);
            if (additionalPayload != null)
            {
                foreach (var kv in additionalPayload)
                {
                    payload.Add(kv.Key, new[] { kv.Value });
                }
            }
            // add ossied time for easier parsing
            payload.Add(OwinKeys.Ticks, new[] { now.Ticks.ToString() });

            // add claims
            bool hasClaims = (authUser.UserRole?.UserRoleClaims != null);
            var claimFlags = new Dictionary<int, int>();
            if (hasClaims)
            {
                foreach (var cgroup in authUser.UserRole.UserRoleClaims.GroupBy(cv => cv.ClaimTypeId))
                {
                    int claimValues = cgroup.Aggregate(0, (v, urc) => v | urc.ClaimValueId); // | them together
                    claimFlags.Add(cgroup.Key, claimValues);
                }
            }

            string accessToken = JsonWebToken.CreateAccessToken(config, now, payload);
            string refreshToken = JsonWebToken.CreateRefreshToken(config, now, payload);
            string csrfToken = API.Csrf.CsrfToken.Create(accessToken);
            Guid refreshGuid = AuthService.CreateToken(authUser.Id, client.Id, now, config.RefreshMinutes, refreshToken);
            return new LoginResult
            {
                AuthId = authUser.Id,
                ClaimFlags = claimFlags,
                IssuedUtc = now,
                ExpiresUtc = now.AddMinutes(config.AccessMinutes),
                RefreshTokenIdentifier = refreshGuid.ToString(),
                Jwt = accessToken,
                CsrfToken = csrfToken
            };
        }

        private static IDictionary<string, string[]> CreateJwtPayload(AuthUser user, AuthClient client)
        {
            var payload = new Dictionary<string, string[]>
            {
                [OwinKeys.AuthUserId] = new[] { user.Id.ToString() },
                [OwinKeys.AuthUsername] = new[] { user.Username },
                [OwinKeys.AuthClientId] = new[] { client.Id.ToString() },
                [OwinKeys.UserRoleId] = new[] { user.RoleId.ToString() },
                [AppOwinKeys.UserRoleTypeId] = new[] { user.UserRole?.UserTypeId.ToString() }
            };

            return payload;
        }
    }
}
