using Service.Core.Utilities;
using Service.Core.Utilities;
using API.Auth.Helpers;
using API.Auth.Models;
using API.Auth.Validators;
using API.RoleManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Admin.Impersonation;
using Service.Auth;
using Service.Base;
using Service.ProviderTrainings;
using Service.Utilities;
using System;
using System.Linq;
using System.Linq.Expressions;
using AuthUser = Model.AuthUser;

namespace API.Auth
{
    public abstract class GoogleAuthControllerBase : AuthControllerBase
    {
        // this delegate allows the AuthUser's child entity (i.e. Users) to have it's email
        // checked for a match when validating a login
        public delegate Expression<Func<AuthUser, bool>> CheckForEmailMatch(string email);
        protected readonly CheckForEmailMatch EmailCheckFunction;

        protected readonly string GoogleApiKey;

        protected GoogleAuthControllerBase(IAuthService authService,
                                            IRoleManager roleManager,
                                            CheckForEmailMatch emailCheckFunction,
                                            IConfigurationSettings configurationSettings,
                                            IImpersonationLogService impersonationLogService,
                                            ICRUDService cRUDService,
                                            IProviderTrainingService providerTrainingService)
                        : base(authService, roleManager, configurationSettings, impersonationLogService, cRUDService, providerTrainingService)
        {
            EmailCheckFunction = emailCheckFunction;
            GoogleApiKey = $"{configurationSettings.GetGoogleApiKey()}.apps.googleusercontent.com";
        }

        /// <summary>
        ///      Verify user via googleLogin. Create and return a Jwt.
        /// </summary>
        /// <param name="lp"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("google/token")]
        [AllowAnonymous]
        public virtual IActionResult RequestGoogleToken([FromBody] GoogleLoginParams lp)
        {
            return ExecuteValidatedAction(() =>
            {
                Service.Utilities.ValidatorHelpers.ValidateAndThrow(lp, new GoogleLoginParamsValidator());
                var client = ValidateClient(lp);
                if (client == null) return ImATeapot();

                AddNoCacheHeader();

                // check valid login
                var isDomainEmail = IsLoginDomainEmail(lp.Email);
                // uses the passed in delegate to create an expression
                // that will match the email when searching for AuthUsers
                var authUserEmailMatches = EmailCheckFunction(lp.Email);
                var authUser = AuthService.ValidateGoogleLogin(authUserEmailMatches, isDomainEmail);
                if (authUser == null) return ImATeapot();

                // check google token
                if (!GoogleAuthHelper.VerifyGoogleToken(lp.Token, GoogleApiKey)) return ImATeapot();

                RoleManager.CheckSetRoleManager(authUser, authUser.UserRole.UserRoleClaims.ToArray()); // make sure state is set in RoleManager
                ILoginResultDto loginResult = CreateTokenResult(authUser, client); // issue the token
                return loginResult != null ? (IActionResult)Ok(loginResult) : ImATeapot();
            });
        }

    }
}
