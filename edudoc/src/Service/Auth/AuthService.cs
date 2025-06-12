using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.WebUtilities;
using Model;
using Model.Enums;
using Service.Auth.Access;
using Service.Auth.Models;
using Service.Auth.Validation;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using AuthClient = Model.AuthClient;
using AuthUser = Model.AuthUser;

namespace Service.Auth
{
    public class AuthService : BaseService, IAuthService
    {
        private readonly AuthUserValidator _authValidator;
        private readonly string _companyName;
        private readonly string _adminSite;
        private readonly string _defaultEmailFrom;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;

        public AuthService(IPrimaryContext context, IEmailHelper emailHelper, IConfigurationSettings configurationSettings)
            : base(context)
        {
            _authValidator = new AuthUserValidator(this);
            _adminSite = configurationSettings.GetAdminSite();
            _defaultEmailFrom = configurationSettings.GetDefaultEmailFrom();
            _emailHelper = emailHelper;
            _companyName = emailHelper.GetCompanyName();
            _configurationSettings = configurationSettings;
        }

        /// <summary>
        ///     Assigns a new role to an AuthUser.
        ///     NOTE: does NOT call SaveChanges, so as to be composable.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <param name="userRoleId"></param>
        public void AssignRole(int authUserId, int userRoleId)
        {
            var authUser = Context.AuthUsers.Find(authUserId);
            ThrowIfNull(authUser);
            // ReSharper disable once PossibleNullReferenceException
            if (!authUser.IsEditable)
                throw new ValidationException("This is a protected User and cannot be edited.");
            authUser.RoleId = userRoleId;
            Context.SetEntityState(authUser, EntityState.Modified);
        }

        /// <summary>
        ///      This is a maintenance task to remove any expired auth tokens from the db.
        /// </summary>
        private void MoveExpiredTokens()
        {
            var expiredToken = Context.AuthTokens.Where(at => at.ExpiresUtc <= DateTime.UtcNow).Select(at => new
            {
                at.IdentifierKey,
                at.Salt,
                at.AuthUserId,
                at.AuthClientId,
                at.IssuedUtc,
                at.ExpiresUtc,
                at.Token

            }).AsEnumerable();
            if (!expiredToken.Any()) return;

            var tokensToMove = expiredToken.Select(at => new ClearedAuthToken
            {
                IdentifierKey = at.IdentifierKey,
                Salt = at.Salt,
                AuthUserId = at.AuthUserId,
                AuthClientId = at.AuthClientId,
                IssuedUtc = at.IssuedUtc,
                ExpiresUtc = at.ExpiresUtc,
                Token = at.Token,
                ClearedDate = DateTime.UtcNow

            }).AsEnumerable();

            Context.ClearedAuthTokens.AddRange(tokensToMove);
            Context.SaveChanges();
        }

        /// <summary>
        ///      This is a maintenance task to remove any expired auth tokens from the db.
        /// </summary>
        private void ClearExpiredAuthTokens()
        {
            var tokensToClear = Context.AuthTokens.Where(at => at.ExpiresUtc <= DateTime.UtcNow);
            if (!tokensToClear.Any()) return;
            Context.AuthTokens.RemoveRange(tokensToClear);
            Context.SaveChanges();
        }

        /// <summary>
        ///      Creates a new AuthUser, given a username and password. Returns the new AuthUser's Id.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="userRoleId"></param>
        /// <returns>Returns the Id of the created AuthUser.</returns>
        public int Create(string username, string password, UserRole userRole)
        {
            AuthUser au = GenerateAuthUser(username, false, password, userRole);
            Context.AuthUsers.Add(au);
            Context.SaveChanges();
            return au.Id;
        }

        /// <summary>
        ///      Saves a refresh token record. Returns the guid to send back to user.
        /// </summary>
        /// <param name="userId">      </param>
        /// <param name="authClientId"></param>
        /// <param name="issuedUtc">   </param>
        /// <param name="tokenMinutes"></param>
        /// <param name="jwt">         </param>
        /// <returns>Returns a Guid that acts as a key for the saved refresh token.</returns>
        public Guid CreateToken(int userId, int authClientId, DateTime issuedUtc, int tokenMinutes, string jwt)
        {
            var g = Guid.NewGuid();
            var token = CreateTokenRecord(userId, authClientId, g, issuedUtc, tokenMinutes, jwt);
            Context.AuthTokens.Add(token);
            Context.SaveChanges();

            // PS :
            // For HIPAA reason moving cleared token to another table

            // JJG:
            // Remove range does not work inside of an async task because it dumps the context.  For now I
            // thinks it's better to have this here and just wait.  If it runs every login then we shouldn't
            // have to wait to long.  Wrapping it in a try catch so that at least logins won't bomb if there
            // is a problem.
            try
            {
                MoveExpiredTokens();
                ClearExpiredAuthTokens();
            }
            catch (Exception ex)
            {
                var a = ex;
            }


            return g;
        }


        /// <summary>
        ///      Creates an AuthUser without saving, for use with other entities.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="generatePassword"></param>
        /// <param name="password"></param>
        /// <param name="userRoleId"></param>
        /// <returns>Returns a new AuthUser.</returns>
        public AuthUser GenerateAuthUser(string username, bool generatePassword, string password, UserRole userRole)
        {
            return DoGenerateAuthUser(username, generatePassword, password, userRole);
        }

        /// <summary>
        ///     Gets an AuthUser by Id.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <returns></returns>
        public AuthUser GetById(int authUserId)
        {
            return Context.AuthUsers.Include(au => au.UserRole).FirstOrDefault(au => au.Id == (int)ProtectedAuthUsers.AdminUser);
        }

        /// <summary>
        ///     Gets an AuthUser by Id with Claims info
        ///     needed for login results.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <returns>Returns an AuthUser with UserRole and Claims.</returns>
        public AuthUser GetByIdForLogin(int authUserId)
        {
            //Admin user may not HasAccess if AllowAdminDirectLogin is false on the SQL project publish
            //this is by design so that the Admin user cannot be compromised in a live environment
            return Context.AuthUsers
                .Include(au => au.UserRole)
                .Include(au => au.UserRole.UserRoleClaims)
                .SingleOrDefault(au => au.Id == authUserId && (au.Id == (int)ProtectedAuthUsers.AdminUser || au.HasAccess));
        }

        /// <summary>
        ///     Gets an AuthUser by Id with Claims info
        ///     needed for password reset.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <returns>Returns an AuthUser with UserRole and Claims.</returns>
        private AuthUser GetByIdForPasswordReset(int authUserId)
        {
            return Context.AuthUsers
                .Include(au => au.UserRole)
                .Include(au => au.UserRole.UserRoleClaims)
                .SingleOrDefault(au => au.Id == authUserId);
        }

        /// <summary>
        ///      Gets an AuthUser by username. This is useful when we use email's as usernames, esp.
        ///      during Forgot Password methods.
        /// </summary>
        /// <param name="username"></param>
        /// <returns>Returns an AuthUser found by username, or null.</returns>
        public AuthUser GetByUsername(string username)
        {
            return Context.AuthUsers.SingleOrDefault(a => a.Username == username);
        }

        /// <summary>
        ///  Gets an AuthUser by UserId. 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Returns AuthUser for the UserId</returns>

        public AuthUser GetByUserId(int userId)
        {
            return Context.AuthUsers
                            .Include(au => au.UserRole)
                            .Include(au => au.UserRole.UserRoleClaims)
                            .SingleOrDefault(a => a.Users.Any(user => user.Id == userId));
        }


        /// <summary>
        ///     Gets a Info by AuthUserId. This allows us
        ///     to return some user info on login.
        /// </summary>
        /// <param name="authId"></param>
        /// <returns>Returns a User, or null if not found.</returns>
        public UserDetails GetInfoByAuthUserId(int authId)
        {
            int providerType = (int)UserTypeEnums.Provider;
            int schoolAdminType = (int)UserTypeEnums.DistrictAdmin;
            int adminType = (int)UserTypeEnums.Admin;
            var blankDistricts = new List<SchoolDistrict>();

            return (from a in Context.Users
                    where (a.AuthUserId == authId
                            && (
                                (a.AuthUser.UserRole.UserTypeId == providerType && a.Providers_ProviderUserId.Any())
                                || (a.AuthUser.UserRole.UserTypeId == schoolAdminType && a.SchoolDistrictId != null)
                                || a.AuthUser.UserRole.UserTypeId == adminType
                            ))
                    select
                            new UserDetails
                            {
                                Id = a.Id,
                                Email = a.Email,
                                Name = a.FirstName + " " + a.LastName,
                                ProfileImagePath = a.Image.ThumbnailPath,
                                CustomOptions = new UserDetailCustomOptions
                                {
                                    AuthUserId = a.AuthUserId,
                                    RoleId = a.AuthUser.RoleId,
                                    IsAssistant = a.AuthUser.UserRole.UserTypeId == providerType && a.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitle != null,
                                    IsSupervisor = a.AuthUser.UserRole.UserTypeId == providerType && a.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ProviderTitles.Any(),
                                    VerifiedOrp = a.AuthUser.UserRole.UserTypeId == providerType && a.Providers_ProviderUserId.FirstOrDefault().VerifiedOrp,
                                    Title = a.AuthUser.UserRole.UserTypeId == providerType ?
                                                        a.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.Name : "",
                                    ServiceCodeId = a.AuthUser.UserRole.UserTypeId == providerType ? a.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ServiceCodeId : 0,
                                    UserTypeId = a.AuthUser.UserRole.UserTypeId,
                                    UserAssociationId = a.AuthUser.UserRole.UserTypeId == providerType ?
                                                        a.Providers_ProviderUserId.FirstOrDefault().Id :
                                                        (a.AuthUser.UserRole.UserTypeId != schoolAdminType ? 0 : (a.SchoolDistrictId != null ? (int)a.SchoolDistrictId : 0)),
                                }
                            }).FirstOrDefault();
        }

        /// <summary>
        ///      Checks username for uniqueness. This can be chained in the Must extension overload
        ///      for Fluent Validation, which accepts the entity itself as the first parameter if you
        ///      need to use another field in your logic.
        /// </summary>
        /// <param name="user">    </param>
        /// <param name="username"></param>
        /// <returns></returns>
        public bool IsUniqueUsername(AuthUser user, string username)
        {
            return !Context.AuthUsers.Any(au => au.Username == username && au.Id != user.Id);
        }

        /// <summary>
        ///      Removes AuthTokens from Context.
        ///      NOTE: this will ultimately retrieve and enumerate the collection, which is a current
        ///            limitation of EF. If performance becomes an issue, consider replacing this method.
        /// </summary>
        /// <param name="authUserId"></param>
        public void RemoveAuthTokensByAuthUser(int authUserId)
        {
            var range = Context.AuthTokens.Where(at => at.AuthUserId == authUserId);
            Context.AuthTokens.RemoveRange(range);
        }

        /// <summary>
        ///      Removes a token from the context, based on token identifier.
        /// </summary>
        /// <param name="userId">           </param>
        /// <param name="authClientId">     </param>
        /// <param name="tokenIdentitifier"></param>
        public void RemoveToken(int userId, int authClientId, string tokenIdentitifier)
        {
            var token = RetrieveToken(userId, authClientId, tokenIdentitifier);
            if (token != null)
                Context.AuthTokens.Remove(token);
            Context.SaveChanges();
        }

        /// <summary>
        ///      Retrieves a token from the context by token identifier.
        /// </summary>
        /// <param name="userId">           </param>
        /// <param name="authClientId">     </param>
        /// <param name="tokenIdentitifier"></param>
        /// <returns>Returns a retrieved refresh token, or null if none found.</returns>
        public AuthToken RetrieveToken(int userId, int authClientId, string tokenIdentitifier)
        {
            var hash = Encryption.HashSha512(tokenIdentitifier);
            var token = Context.AuthTokens
                .Where(rt => rt.AuthUserId == userId && rt.AuthClientId == authClientId)
                .ToArray()
                .SingleOrDefault(rt => Encryption.GetSaltedHash(hash, rt.Salt).SequenceEqual(rt.IdentifierKey));
            return token;
        }

        /// <summary>
        ///     Sends an email to an authorized domain
        ///     for private single-use login as Admin User.
        /// </summary>
        /// <param name="email"></param>
        public void SendDomainEmailAccess(string email)
        {
            var headerMessage = "Hello!";
            var message = $"You requested a sign in link for <b>{_companyName}</b>.<br/>Click the button below to sign in.";
            var link = CreateAdminAccessLink();
            var buttonText = $"Sign in to {_companyName}";
            var title = $"Link to access {_companyName}";
            var body = GetButtonLinkEmailBody(headerMessage, message, link, buttonText);

            Utilities.Models.EmailParams ep = new Utilities.Models.EmailParams()
            {
                From = _defaultEmailFrom,
                To = email,
                Subject = title,
                Body = body
            };
            _emailHelper.SendEmail(ep);

        }

        /// <summary>
        ///      Generates a reset link and sends to auth user's designated email. For use when users
        ///      forget their passwords.
        /// </summary>
        /// <param name="user"> </param>
        /// <param name="email"></param>
        public void SendForgotPasswordEmail(AuthUser user, string email, bool isFromMobile)
        {
            var headerMessage = "Hello!";
            var message = $"You requested a reset password link for <b>{_companyName}</b>.<br/>Click the button below to sign in.";
            var link = CreateResetLink(user, isFromMobile);
            var buttonText = "Reset Password";
            var title = $"Reset Password: {_companyName}";
            var body = GetButtonLinkEmailBody(headerMessage, message, link, buttonText);
            Utilities.Models.EmailParams ep = new Utilities.Models.EmailParams()
            {
                From = _defaultEmailFrom,
                To = email,
                Subject = title,
                Body = body
            };
            _emailHelper.SendEmail(ep);
        }

        /// <summary>
        ///      Sends an invite email without a reset link.
        /// </summary>
        /// <param name="user"> </param>
        /// <param name="email"></param>
        public void SendNewUserInitEmail(AuthUser user, string email)
        {
            var headerMessage = "Hello!";
            var message = $"A new account has been created for {user.Username} at <b>{_companyName}</b>.<br/>You may use the button below to sign in.";
            var link = _adminSite;
            var buttonText = "Sign in";
            var title = $"New Account Created: {_companyName}";
            var body = GetButtonLinkEmailBody(headerMessage, message, link, buttonText);
            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _defaultEmailFrom,
                To = email,
                Subject = title,
                Body = body
            });
        }

        /// <summary>
        ///      Generates a reset link and sets to auth user's designated email. For use on initial
        ///      creation of new users.
        /// </summary>
        /// <param name="user"> </param>
        /// <param name="email"></param>
        public void SendNewUserResetEmail(AuthUser user, string email)
        {
            var headerMessage = "Hello!";
            var isFromMobile = false;
            var message = $"A new account has been created for {user.Username} at <b>{_companyName}</b>.<br/>Please use the following button within 24 hours to set up a password.";
            var link = CreateResetLink(user, isFromMobile);
            var buttonText = "Setup Password";
            var title = $"New Account Created: {_companyName}";
            var body = GetButtonLinkEmailBody(headerMessage, message, link, buttonText);
            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _defaultEmailFrom,
                To = email,
                Subject = title,
                Body = body
            });
        }

        /// <summary>
        ///      Sets a new reset key for a user, good for 15 minutes by default.
        /// </summary>
        /// <param name="user">        </param>
        /// <param name="resetMinutes"></param>
        public void SetResetKey(AuthUser user, int resetMinutes = 15)
        {
            user.ResetKey = Encryption.GetSalt();
            user.ResetKeyExpirationUtc = DateTime.UtcNow.AddMinutes(resetMinutes);
            Update(user);
        }

        /// <summary>
        ///     Updates an AuthUser.
        /// </summary>
        /// <param name="authUser"></param>
        /// <returns>Returns the updated AuthUser.</returns>
        public AuthUser Update(AuthUser authUser)
        {
            ThrowIfNull(authUser);
            ValidateAndThrow(authUser, _authValidator);
            Context.SetEntityState(authUser, EntityState.Modified);
            Context.SaveChanges();
            return authUser;
        }
        /// <summary>
        ///      Updates a user's password.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns>Returns true unless an error occurs.</returns>
        public bool UpdatePassword(AuthUser user, string password)
        {
            ThrowIfNull(user);
            if (!user.IsEditable)
                throw new ValidationException("This is a protected user and cannot be edited.");
            ValidatePasswordStrength(password);
            var sh = new SaltedHashGenerator(password);
            user.Password = sh.SaltedHash;
            user.Salt = sh.Salt;
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            return true;
        }

        /// <summary>
        ///     Validates an AuthUser.
        /// </summary>
        /// <param name="user"></param>
        public void ValidateAndThrow(AuthUser user)
        {
            ValidateAndThrow(user, _authValidator);
        }

        /// <summary>
        ///     Validates an auth client. Returns the entity or null.
        /// </summary>
        /// <param name="authClientId">    </param>
        /// <param name="authClientSecret"></param>
        /// <returns>Returns a validated AuthClient, or null if validation failed.</returns>
        public AuthClient ValidateAuthClient(int authClientId, string authClientSecret)
        {
            var authClient = Context.AuthClients.Find(authClientId);
            return (AuthClient)CheckVerifiableByPassword(authClient, authClientSecret);
        }

        /// <summary>
        ///     Validates key from reset link for an
        ///     accepted domain email login.
        /// </summary>
        /// <param name="resetKey"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateDomainEmailLogin(string resetKey)
        {
            return ValidateReset((int)ProtectedAuthUsers.AdminUser, resetKey);
        }

        /// <summary>
        ///     Validates a username and password against the context.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateLogin(string username, string password)
        {
            var user = Context.AuthUsers
                .Include(au => au.UserRole)
                .Include(au => au.UserRole.UserRoleClaims)
                .SingleOrDefault(u => u.Username == username && u.HasAccess && !u.Users.Any(toCheck => toCheck.Archived));
            if (user == null) return null;
            return (AuthUser)CheckVerifiableByPassword(user, password);
        }

        /// <summary>
        ///     Validates a email against the context.
        /// </summary>
        /// <param name="authUserEmailMatches"></param>
        /// <param name="spoofAdminIfNotFound"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateGoogleLogin(Expression<Func<AuthUser, bool>> authUserEmailMatches, bool spoofAdminIfNotFound)
        {
            var user = Context.AuthUsers
                .Include(au => au.UserRole)
                .Include(au => au.UserRole.UserRoleClaims)
                .Where(au => au.HasAccess)
                .SingleOrDefault(authUserEmailMatches);
            if (user == null && spoofAdminIfNotFound)
            {
                user = GetByIdForLogin((int)ProtectedAuthUsers.AdminUser);
            }
            return user;
        }

        public Expression<Func<AuthUser, bool>> CheckUserEmailFromAuthUser(string email)
        {
            Expression<Func<AuthUser, bool>> expr = au => au.Users.FirstOrDefault().Email == email;
            return expr;
        }


        /// <summary>
        ///     Overload that accepts userId instead of username. Useful when validating user before
        ///     updating a password.
        /// </summary>
        /// <param name="userId">  </param>
        /// <param name="password"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateLogin(int userId, string password)
        {
            AuthUser user = GetByIdForLogin(userId);
            return (AuthUser)CheckVerifiableByPassword(user, password);
        }

        /// <summary>
        ///     Accepts reset key. Used during forgot password.
        /// </summary>
        /// <param name="userId">  </param>
        /// <param name="resetKey"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateReset(int userId, string resetKey)
        {
            AuthUser user = GetByIdForPasswordReset(userId);
            if (user == null) return null;
            byte[] keyBytes = WebEncoders.Base64UrlDecode(resetKey);
            return IsValidResetKey(user, keyBytes) ? user : null;
        }

        /// <summary>
        /// Flags a reset token as invalid once it has been redeemed
        /// </summary>
        /// <param name="authUserId"></param>
        public void MarkResetInvalid(int authUserId)
        {
            var authUser = GetById(authUserId);
            authUser.ResetKeyExpirationUtc = DateTime.UtcNow;
            Context.SaveChanges();
        }

        /// <summary>
        ///     Actually generates the AuthUser.
        ///     NOTE: this second, internal static method exists to make testing easier,
        ///     while the public instance method must be present to implement interface.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="generatePassword"></param>
        /// <param name="password"></param>
        /// <param name="userRoleId"></param>
        /// <returns>Returns a new AuthUser.</returns>
        internal static AuthUser DoGenerateAuthUser(string username, bool generatePassword, string password, UserRole userRole)
        {
            if (generatePassword) return DoGenerateAuthUser(username, userRole);
            ValidatePasswordStrength(password);
            var sh = new SaltedHashGenerator(password);
            return DoGenerateAuthUser(username, sh.SaltedHash, sh.Salt, userRole);
        }
        private static IVerifiable CheckVerifiableByPassword(IVerifiable authEntity, string password)
        {
            return IsCorrectPassword(authEntity, password) ? authEntity : null;
        }

        private static string GetButtonLinkEmailBody(string headerMessage, string message, string link, string buttonText)
        {
            string bodyHTML = @"<div width=""546"" valign=""top"" style=""font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important;border-collapse:collapse"">
	                                <div style=""max-width:600px;margin:0 auto"">
		                                <h2 style=""color:#3c8ed7;line-height:30px;margin-bottom:12px;margin:0 0 12px"">{0}</h2>
		                                <p style=""font-size:20px;line-height:26px;margin:0 0 16px"">
			                                {1}
		                                </p>
		                                <span style=""display:inline-block;border-radius:4px;background:#004AA0;border-bottom:2px solid #004AA0"">
				                                <a href=""{2}"" style=""color:white;font-weight:normal;text-decoration:none;word-break:break-word;font-size:20px;line-height:26px;border-top:14px solid;border-bottom:14px solid;border-right:32px solid;border-left:32px solid;background-color:#3c8ed7;border-color:#3c8ed7;display:inline-block;letter-spacing:1px;min-width:80px;text-align:center;border-radius:4px"" target=""_blank"">
					                                {3}
				                                </a>
		                                </span>
		                                <p style=""font-size:12px;line-height:26px;margin:0 0 16px"">Note: Your link will expire in 24 hours.</p>
	                                </div>
                                </div>";
            return string.Format(bodyHTML, headerMessage, message, link, buttonText);
        }

        private string CreateAdminAccessLink()
        {
            var au = Context.AuthUsers.Include(au => au.UserRole).FirstOrDefault(au => au.Id == (int)ProtectedAuthUsers.AdminUser);
            ThrowIfNull(au);
            SetResetKey(au);
            // ReSharper disable once PossibleNullReferenceException
            var resetKey = WebEncoders.Base64UrlEncode(au.ResetKey);
            var endpoint = _configurationSettings.GetAdminAccessEndpoint();
            var href = $"{_adminSite}{endpoint}?resetKey={resetKey}";
            return href;
        }


        private string CreateResetLink(AuthUser user, bool isFromMobile)
        {
            var resetKey = WebEncoders.Base64UrlEncode(user.ResetKey);
            var resetEndpoint = _configurationSettings.GetResetEndpoint();
            var href = "";
            if (isFromMobile)
            {
                var source = _configurationSettings.GetMobileSite();
                var mobileSites = source.Split(',').ToList<string>();
                var mobileSiteToUse = mobileSites[0]; // mobile url with port number should be first
                href = $"{mobileSiteToUse}{resetEndpoint}?resetKey={resetKey}&userId={user.Id}";
            }
            else
            {
                href = $"{_adminSite}{resetEndpoint}?resetKey={resetKey}&userId={user.Id}";
            }
            return href;
        }

        private static AuthToken CreateTokenRecord(int userId, int authClientId, Guid g, DateTime issuedUtc, int tokenMinutes,
            string jwt)
        {
            var sh = new SaltedHashGenerator(g.ToString());
            return new AuthToken
            {
                IdentifierKey = sh.SaltedHash,
                Salt = sh.Salt,
                Id = userId,
                AuthClientId = authClientId,
                AuthUserId = userId,
                IssuedUtc = issuedUtc,
                ExpiresUtc = issuedUtc.AddMinutes(tokenMinutes),
                Token = jwt
            };
        }

        private static AuthUser DoGenerateAuthUser(string username, UserRole userRole)
        {
            var salt = Encryption.GetSalt();
            var hash = Encryption.GetSalt();
            var sh = Encryption.GetSaltedHash(hash, salt);
            return DoGenerateAuthUser(username, sh, salt, userRole);
        }

        private static AuthUser DoGenerateAuthUser(string username, byte[] saltedHash, byte[] salt, UserRole userRole)
        {
            return new AuthUser()
            {
                Username = username,
                Password = saltedHash,
                Salt = salt,
                ResetKey = new byte[] { 0 },
                ResetKeyExpirationUtc = DateTime.UtcNow.AddMinutes(-5),
                UserRole = userRole,
                HasAccess = true
            };
        }

        private static bool IsCorrectPassword(IVerifiable authEntity, string password)
        {
            var hash = Encryption.HashSha512(password);
            return authEntity != null &&
                   Encryption.GetSaltedHash(hash, authEntity.Salt).SequenceEqual(authEntity.Password);
        }

        private static void ValidatePasswordStrength(string password)
        {
            if (PasswordHelper.BeAStrongPassword(password)) return;
            var ex = new ValidationException(RegexPatterns.PasswordErrorMsg) { Source = "Password" };
            throw ex;
        }

        private bool IsValidResetKey(AuthUser user, byte[] keyBytes)
        {
            var results = keyBytes != null &&
                          keyBytes.SequenceEqual(user.ResetKey) &&
                          user.ResetKeyExpirationUtc >= DateTime.UtcNow;

            if (results)
            {
                RemoveResetKey(user);
            }

            return results;
        }

        /// <summary>
        /// Remove the reset key onces the user sucessfully uses it
        /// </summary>
        /// <param name="user"></param>
        private void RemoveResetKey(AuthUser user)
        {
            user.ResetKey = new byte[] { 0 };
            user.ResetKeyExpirationUtc = DateTime.UtcNow.AddMinutes(-5);
            Context.AuthUsers.Attach(user);
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Changes whether an authUser has access to the portal.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <param name="hasAccess"></param>
        /// <returns>Returns the AuthUserId of the User that was updated.</returns>
        public int SetHasAccess(int authUserId, bool hasAccess)
        {
            var authUser = Context.AuthUsers
                .SingleOrDefault(u => u.Id == authUserId);
            ThrowIfNull(authUser);
            // ReSharper disable once PossibleNullReferenceException
            if (!authUser.IsEditable)
                throw new ValidationException("This is a protected user and cannot be edited.");

            authUser.HasAccess = hasAccess;
            Context.SetEntityState(authUser, EntityState.Modified);
            Context.SaveChanges();
            return authUser.Id;
        }

        /// <summary>
        ///     Updates a User's PortalAccess features, e.g.
        ///     Username and UserRole.
        ///     NOTE: this method must return the AuthUserId of the edited user,
        ///     so that anything requiring an access change can handle it for the
        ///     appropriate AuthUser.
        /// </summary>
        public void UpdatePortalAccess(int authUserId, PortalAccessUpdater updater)
        {
            ThrowIfNull(updater);
            ValidateAndThrow(updater, new PortalAccessUpdaterValidator());
            var authUser = Context.AuthUsers
                .SingleOrDefault(u => u.Id == authUserId);
            ThrowIfNull(authUser);
            // ReSharper disable once PossibleNullReferenceException
            if (!authUser.IsEditable)
                throw new ValidationException("This is a protected user and cannot be edited");
            authUser.Username = updater.Username;
            Context.SetEntityState(authUser, EntityState.Modified);
            Context.SaveChanges();
        }

        public UserRole CreateUserRole(string username, int userTypeId)
        {
            return new UserRole()
            {
                Description = username,
                Name = username,
                UserTypeId = userTypeId,
                UserRoleClaims = CreateClaims(userTypeId),
            };
        }

        private List<UserRoleClaim> CreateClaims(int userTypeId)
        {
            switch (userTypeId)
            {
                case (int)UserTypeEnums.Admin:
                    return Context.ClaimTypes.Where(ct => ct.UserTypes.Any(ut => ut.Id == (int)UserTypeEnums.Admin)).Select(ct => new
                    {
                        ClaimTypeId = ct.Id,
                    }).ToList()
                    .Select(x => new UserRoleClaim
                    {
                        ClaimTypeId = x.ClaimTypeId,
                        ClaimValueId = 1,
                    }).ToList();
                case (int)UserTypeEnums.Provider:
                    return Context.ClaimTypes.Where(ct => ct.UserTypes.Any(ut => ut.Id == (int)UserTypeEnums.Provider)).Select(ct => new
                    {
                        ClaimTypeId = ct.Id,
                    }).ToList()
                    .Select(x => new UserRoleClaim
                    {
                        ClaimTypeId = x.ClaimTypeId,
                        ClaimValueId = 1,
                    }).ToList();
                case (int)UserTypeEnums.DistrictAdmin:
                    return Context.ClaimTypes.Where(ct => ct.UserTypes.Any(ut => ut.Id == (int)UserTypeEnums.DistrictAdmin)).Select(ct => new
                    {
                        ClaimTypeId = ct.Id,
                    }).ToList()
                    .Select(x => new UserRoleClaim
                    {
                        ClaimTypeId = x.ClaimTypeId,
                        ClaimValueId = 1,
                    }).ToList();
                default:
                    return null;
            }

        }

    }
}
