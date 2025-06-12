using Service.Core.Utilities;
using Service.Core.Utilities;
using API.Auth;
using API.Auth.Models;
using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.Jwt;
using API.RoleManager;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Admin.Impersonation;
using Service.Auth;
using Service.Auth.Access;
using Service.Base;
using Service.ProviderTrainings;
using Service.Users;
using Service.Utilities;
using System.Collections.Generic;

namespace API.AuthUsers
{
    [Route("api/v1/authUsers")]
    [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class AuthUsersController : GoogleAuthControllerBase
    {
        private readonly IRequestDocReader _docReader;
        private readonly IAuthService _authService;
        private readonly IProviderTrainingService _providerTrainingService;
        private readonly IUserService _userService;
        public AuthUsersController(IAuthService authService,
                                    IRoleManager roleManager,
                                    IRequestDocReader docReader,
                                    IConfigurationSettings configurationSettings,
                                    IImpersonationLogService impersonationLogService,
                                    ICRUDService cRUDService,
                                    IProviderTrainingService providerTrainingService,
                                    IUserService userService) : base(authService, roleManager, authService.CheckUserEmailFromAuthUser, configurationSettings, impersonationLogService, cRUDService, providerTrainingService)
        {
            _docReader = docReader;
            _authService = authService;
            _userService = userService;
        }

        [HttpPut]
        [Route("{authUserId:int}/hasAccess/{hasAccess:bool}")]
        [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.FullAccess)]
        public IActionResult SetHasAccess(int authUserId, bool hasAccess)
        {
            return ExecuteValidatedAction(() =>
            {
                if (this.GetAuthUserId() == authUserId)
                {
                    ModelState.AddModelError("User", "You cannot set your own access!");
                    return BadRequest(ModelState);
                }

                AuthService.SetHasAccess(authUserId, hasAccess);
                if (!hasAccess)
                    RoleManager.DeleteUser(authUserId);
                return Ok();

            });

        }

        [HttpPut]
        [Route("updatePassword")]
        [Bypass(true)] // don't require user privileges to edit, if self only
        public IActionResult UpdatePassword([FromBody] UpdatePasswordParams upp)
        {
            if (upp == null || upp.AuthUserId == 0) return BadRequest();

            // this one is tricky. make sure that the user is editing self, or that
            // they have claims. Can't really force one or the other on the route itself since we're
            // not passing in (or guaranteed to pass in) the userId that matches authUser, so this method
            // should be bypassed from claims attributes check and manually inspected here.
            var tokenAuthId = this.GetAuthUserId();
            var ok = tokenAuthId == upp.AuthUserId; // see if editing self
            if (!ok) // not editing self: check permission / claims
            {
                var authUserId = this.GetAuthUserId();
                var authUser = _authService.GetByIdForLogin(authUserId);
                var claimValuesList = new List<ClaimTypeValue>();
                var claimValues = authUser.UserRole.UserRoleClaims;
                foreach (var claimValue in claimValues)
                {
                    claimValuesList.Add(new ClaimTypeValue()
                    {
                        ClaimTypeId = claimValue.ClaimTypeId,
                        ClaimValueId = claimValue.ClaimValueId,
                    });
                }
                ok = RestrictAttribute.CheckClaim(claimValuesList.ToArray(), ClaimTypes.HPCUserAccess, ClaimValues.FullAccess);
            }

            return ok ? _UpdatePassword(upp) : Unauthorized();
        }

        [HttpPut]
        [Route("{authUserId:int}/portalAccess")]
        [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.FullAccess)]
        [Bypass(true)] // don't require user privileges to edit, if self only

        public IActionResult UpdatePortalAccess(int authUserId, [FromBody] PortalAccessUpdater updater)
        {
            return ExecuteValidatedAction(
                () =>
                {
                    var tokenAuthId = this.GetAuthUserId();
                    var ok = tokenAuthId == authUserId; // see if editing self
                    if (!ok) // not editing self: check permission / claims
                    {
                        var authUserId = this.GetAuthUserId();
                        var authUser = _authService.GetByIdForLogin(authUserId);
                        var claimValuesList = new List<ClaimTypeValue>();
                        var claimValues = authUser.UserRole.UserRoleClaims;
                        foreach (var claimValue in claimValues)
                        {
                            claimValuesList.Add(new ClaimTypeValue()
                            {
                                ClaimTypeId = claimValue.ClaimTypeId,
                                ClaimValueId = claimValue.ClaimValueId,
                            });
                        }
                        ok = RestrictAttribute.CheckClaim(claimValuesList.ToArray(), ClaimTypes.HPCUserAccess, ClaimValues.FullAccess);
                    }

                    if (!ok)
                    {
                        return Unauthorized();
                    }

                    AuthService.UpdatePortalAccess(authUserId, updater);
                    RoleManager.StampAuthUser(authUserId);
                    return Ok();
                }
            );
        }

        protected override ILoginResultDto CreateTokenResult(AuthUser authUser, AuthClient client, JwtConfig config, IDictionary<string, string> additionalPayload = null)
        {
            Service.Auth.Models.UserDetails authUserInstance = AuthService.GetInfoByAuthUserId(authUser.Id);
            if (authUserInstance == null) return null;

            if (additionalPayload == null) additionalPayload = new Dictionary<string, string> { { OwinKeys.UserId, authUserInstance.Id.ToString() } };
            else additionalPayload.Add(OwinKeys.UserId, authUserInstance.Id.ToString());

            LoginResult lr = GetBaseLoginResult(authUser, client, config, additionalPayload);
            return new FullLoginResult { LoginResult = lr, UserDetails = authUserInstance };
        }
    }
}
