using Service.Core.Utilities;
using Service.Core.Utilities;
using API.Auth.Models;

using API.Core.Claims;
using API.Common;
using API.Common.SearchUtilities;
using API.CRUD;
using API.Jwt;
using API.RoleManager;
using API.Users.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Admin.Impersonation;
using Service.Auth;
using Service.Auth.Models;
using Service.Base;
using Service.Common.Phone;
using Service.Providers;
using Service.Users;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using TrackerEnabledDbContext.Common.Interfaces;
using ClaimTypes = API.Core.Claims.ClaimTypes;
using User = Model.User;

namespace API.Users
{
    [Route("api/v1/users")]
    public class UsersController : CrudVersionController<User>
    {
        private readonly IRequestDocReader _docReader;
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IRoleManager _roleManager;
        private readonly IImpersonationLogService _impersonationLogService;
        private readonly IProviderService _providerService;
        private readonly IPrimaryContext _dbContext;

        public UsersController(IUserService userService,
                                IRequestDocReader docReader,
                                ICRUDService crudservice,
                                IAuthService authService,
                                IRoleManager roleManager,
                                IImpersonationLogService impersonationLogService,
                                IProviderService providerService,
                                IConfigurationSettings configurationSettings,
                                IPrimaryContext dbContext)
            : base(crudservice)
        {
            _userService = userService;
            _docReader = docReader;
            _authService = authService;
            _roleManager = roleManager;
            _impersonationLogService = impersonationLogService;
            _providerService = providerService;
            _configurationSettings = configurationSettings;
            _dbContext = dbContext;

            Searchfields = new[] { new CrudSearchFieldType("FirstName", CrudSearchFieldType.Method.Contains),
            new CrudSearchFieldType("LastName", CrudSearchFieldType.Method.Contains),
            new CrudSearchFieldType("Email", CrudSearchFieldType.Method.Contains)};
            Searchchildincludes = new[] { "Address" };
            Getbyincludes = new[] { "UserPhones", "Address", "Image", "AuthUser", "AuthUser.UserRole",
                "SchoolDistricts_AccountManagerId", "SchoolDistricts_AccountAssistantId", "SchoolDistrict" };
            Orderby = "LastName";
        }


        [Restrict(ClaimTypes.Users, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<User>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<User>
            {
                user => user.AuthUser.UserRole,
                user => user.Address,
                user => user.SchoolDistrict,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                cspFull.AddedWhereClause.Add(u =>
                    terms.All(t => (u.FirstName != null && u.FirstName.ToLower().StartsWith(t.ToLower())) ||
                        (u.LastName != null && u.LastName.ToLower().StartsWith(t.ToLower())) ||
                        u.Email.ToLower().StartsWith(t.ToLower()))
                    );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extraParamLists = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "UserTypeId", "SchoolDistrictIds");
                var boolExtraParamLists = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, "ArchivedStatus");
                var userTypeIds = extraParamLists["UserTypeId"];
                var schoolDistrictIdList = extraParamLists["SchoolDistrictIds"];
                var accessStatusList = boolExtraParamLists["ArchivedStatus"];

                if (schoolDistrictIdList.Count > 0)
                {
                    cspFull.AddedWhereClause.Add(user => schoolDistrictIdList.Contains((int)user.SchoolDistrictId));
                }

                if (userTypeIds.Count > 0)
                {
                    cspFull.AddedWhereClause.Add(user => userTypeIds.Contains(user.AuthUser.UserRole.UserTypeId));
                }
                if (accessStatusList.Count > 0)
                {
                    cspFull.AddedWhereClause.Add(user => accessStatusList.Contains(user.Archived));
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            int count;
            return Ok(Crudservice.Search(cspFull, out count).AsQueryable()
                .ToSearchResults(count)
                .Respond(this));
        }

        [AllowSelfEdit]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public override IActionResult UpdateVersion(int id, [FromBody] User data)
        {
            return base.UpdateVersion(id, data);
        }

        [HttpPost]
        [Route("create")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IActionResult PostUser([FromBody] UserCreateParams ucp)
        {
            return ExecuteValidatedAction(() =>
            {
                if (ucp == null) return BadRequest();
                _userService.Create(ucp.User, ucp.Username, ucp.Password, ucp.UserTypeId, ucp.SendEmail);
                return Ok(ucp.User.Id);
            });
        }

        [AllowSelfEdit]
        public override IActionResult GetById(int id)
        {
            return Ok(Getbyincludes.Length > 0 ? Crudservice.GetById<User>(id, Getbyincludes) : Crudservice.GetById<User>(id));
        }

        [HttpDelete]
        [Route("{userId:int}/address")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IActionResult DeleteAddress(int userId)
        {
            return ExecuteConcurrentValidatedAction(userId, () =>
            {
                _userService.DeleteAddress(userId);
                return Ok();
            }, _userService.Reload);
        }


        [HttpDelete]
        [Route("{userId:int}/pic")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IActionResult DeletePic(int userId)
        {
            return ExecuteValidatedAction(() => Ok(_userService.DeleteImage(userId)));
        }

        [HttpPost]
        [Route("forgot")]
        [AllowAnonymous]
        public IActionResult ForgotPassword([FromBody] EmailParam emailParam)
        {
            try
            {
                if (emailParam == null) return BadRequest();
                var referer = this.Request.Headers["Referer"].ToString();
                var mobileSite = _configurationSettings.GetMobileSite();
                var isFromMobile = false;
                if (mobileSite.Contains(referer))
                {
                    isFromMobile = true;
                }
                _userService.ForgotPassword(emailParam.Email, isFromMobile);
                return Ok();
            }
            catch (ArgumentNullException)
            {
                return BadRequest();
            }

        }

        [HttpPost]
        [Route("{userId:int}/address")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        public IActionResult PostUserAddress(int userId, [FromBody] Address address)
        {
            return ExecuteConcurrentValidatedAction(userId,
                () => Ok(_userService.CreateAddress(userId, address)),
                _userService.Reload);
        }

        [HttpPut]
        [Route("{userId:int}/phones")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IActionResult PutPhones(int userId, [FromBody] PhoneCollection<UserPhone> phones)
        {
            return ExecuteValidatedAction(() =>
            {
                _userService.MergePhones(userId, phones);
                return Ok();
            });
        }


        [HttpPut]
        [Route("{userId:int}")] // this is needed to allow self editing...
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public override IActionResult Update(int userId, [FromBody] User user)
        {
            return ExecuteConcurrentValidatedAction(user, _userService.UpdateUser, _userService.Reload);
        }

        [HttpGet]
        [Route("{userId:int}/documents/_search")]
        [Restrict(ClaimTypes.Users, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<Document> SearchUserDocuments(int userId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Document>(csp);

            cspFull.AddedWhereClause.Add(d => d.Users.Any(c => c.Id == userId));

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(d => d.Name.StartsWith(t));
                }
            }

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(csp.order,
                    csp.orderdirection));

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>("Name",
                    "asc"));

            int ct;
            return Crudservice.Search(cspFull, out ct).AsQueryable()
                .ToSearchResults(ct)
                .Respond<Document>(this);
        }

        [HttpPut]
        [Route("{userId:int}/address")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IActionResult UpdateAddress(int userId, [FromBody] Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                _userService.UpdateAddress(address);
                return Ok();
            });
        }


        [HttpPost]
        [Route("{userId:int}/pic")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public async Task<IActionResult> UploadPic(int userId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var pic = await _docReader.GetDocBytesFromRequest(this);
                var result = _userService.UpdatePic(userId, pic.DocBytes, pic.FileName);
                return Ok(result);
            });
        }

        [HttpGet]
        [Route("active")]
        [Restrict(ClaimTypes.Users, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<User> GetActive()
        {
            return _userService.GetActiveUsers();
        }

        [HttpGet]
        [Route("{roleId:int}/role")]
        [Restrict(ClaimTypes.Users, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<User> GetByUsersRoleId(int roleId)
        {
            return _userService.GetByUsersRoleId(roleId);
        }

        [HttpGet]
        [Route("{userId:int}/provider")]
        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public Provider GetProvider(int userId)
        {
            return _providerService.GetByUserId(userId);
        }

        [HttpGet]
        [Route("{userId:int}/districts")]
        public IActionResult GetDistrictsByUserId(int userId)
        {
            return Ok(_userService.GetDistrictsByUserId(userId));
        }

        /// <summary>
        ///     Authenticates from a reset link
        ///     sent to a valid domain email.
        /// </summary>
        /// <param name="depp"></param>
        /// <returns>Returns an IHttpActionResult of an ILoginResultDto with payload.</returns>
        [HttpPost]
        [Route("impersonate")]
        [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]

        public IActionResult Impersonate([FromBody] ImpersonationParameters impersonationParameter)
        {
            return ExecuteValidatedAction(() =>
            {
                // Validate Auth Clients making sure the request is coming from correct clients
                AuthClient client = _authService.ValidateAuthClient(impersonationParameter.AuthClientId, impersonationParameter.AuthClientSecret);
                if (client == null) return ImATeapot();

                // Get auth users for the user who is being impersonated
                var authUser = _authService.GetByUserId(impersonationParameter.ImpersonateeUserId);
                if (authUser == null) return BadRequest();

                // Get user details of impersonated user
                UserDetails authUserInstance = _authService.GetInfoByAuthUserId(authUser.Id);
                if (authUserInstance == null) return ImATeapot();


                _authService.SetResetKey(authUser); // create a new reset key
                _roleManager.CheckSetUserTime(authUser.Id); // sets token times
                _roleManager.CheckSetRoleTime(authUser.RoleId, authUser.UserRole.UserRoleClaims.ToArray()); // sets token times


                var uri = new Uri(Request.GetEncodedUrl());
                JwtConfig config = new JwtConfig(true, uri.GetLeftPart(UriPartial.Authority), _configurationSettings.Configuration);



                // Add User Impersonating to the payload so that when a token is generated, that property is embded with the token
                var additionalPayload = new Dictionary<string, string> { { "ImpersonatingUserId", impersonationParameter.ImpersonatingUserId.ToString() } };
                additionalPayload.Add(OwinKeys.UserId, authUserInstance.Id.ToString());

                LoginResult loginResult = new LoginResult().GetBaseLoginResult(_authService, authUser, client, config, additionalPayload);
                authUserInstance.CustomOptions.ImpersonatingUserId = impersonationParameter.ImpersonateeUserId;
                ILoginResultDto loginResultDTO = new FullLoginResult { LoginResult = loginResult, UserDetails = authUserInstance };

                // Get new token information
                AuthToken authToken = _authService.RetrieveToken(authUser.Id, impersonationParameter.AuthClientId, loginResultDTO.LoginResult.RefreshTokenIdentifier);
                if (authToken == null) return BadRequest();

                // create a record in impersonation table so that it can be used later to update refresh token with impersonation id
                // which can also be used to logout and get back to the correct page.
                Crudservice.Create(new ImpersonationLog { AuthTokenId = authToken.Id, ImpersonaterId = impersonationParameter.ImpersonatingUserId });



                return Ok(loginResultDTO);
            });
        }

        [HttpPost]
        [Route("unimpersonate")]
        [AllowSelfEdit]

        public IActionResult UnImpersonate([FromBody] RefreshParams refreshParams)
        {
            return ExecuteValidatedAction(() =>
            {

                AuthClient client = _authService.ValidateAuthClient(refreshParams.AuthClientId, refreshParams.AuthClientSecret);
                if (client == null) return ImATeapot();

                AuthToken impersonateeAuthToken = _authService.RetrieveToken(refreshParams.AuthUserId, refreshParams.AuthClientId, refreshParams.TokenIdentifier);
                if (impersonateeAuthToken == null) return ImATeapot();

                // get the log of impersonation so that person who did the impersonation can be signed back in
                ImpersonationLog impersonationLog = _impersonationLogService.GetByAuthTokenId(impersonateeAuthToken.Id);
                if (impersonationLog == null) return ImATeapot();

                // get user information of actual user who started the impersonation
                var authUser = _authService.GetByUserId(impersonationLog.ImpersonaterId);
                if (authUser == null) return BadRequest();

                UserDetails authUserInstance = _authService.GetInfoByAuthUserId(authUser.Id);
                if (authUserInstance == null) return BadRequest();

                _authService.SetResetKey(authUser); // create a new reset key
                _roleManager.CheckSetUserTime(authUser.Id);
                _roleManager.CheckSetRoleTime(authUser.RoleId, authUser.UserRole.UserRoleClaims.ToArray());

                var uri = new Uri(Request.GetEncodedUrl());
                JwtConfig config = new JwtConfig(true, uri.GetLeftPart(UriPartial.Authority), _configurationSettings.Configuration);

                var additionalPayload = new Dictionary<string, string> { { OwinKeys.UserId, authUserInstance.Id.ToString() } };
                LoginResult loginResult = new LoginResult().GetBaseLoginResult(_authService, authUser, client, config, additionalPayload);
                ILoginResultDto loginResultDTO = new FullLoginResult { LoginResult = loginResult, UserDetails = authUserInstance };

                return Ok(loginResultDTO);
            });
        }

        [HttpGet]
        [Route("admin-select-options")]
        public IEnumerable<SelectOptions> GetAdminSelectOptions()
        {
            var csp = new Model.Core.CRUDSearchParams<User> { order = "FirstName" };
            csp.AddedWhereClause.Add(user => user.AuthUser.UserRole.UserTypeId == 1);
            csp.AddedWhereClause.Add(user => user.Id != 1);

            return Crudservice.GetAll(csp).Select(admin =>
               new SelectOptions
               {
                   Id = admin.Id,
                   Name = $"{admin.FirstName} {admin.LastName}",
                   Archived = admin.Archived
               }).AsEnumerable();
        }

        [HttpGet]
        [Route("all-admins")]
        public IEnumerable<User> GetAllAdmins()
        {
            var csp = new Model.Core.CRUDSearchParams<User> { order = "FirstName" };
            csp.AddedWhereClause.Add(user => user.AuthUser.UserRole.UserTypeId == 1);
            csp.AddedWhereClause.Add(user => user.Id != 1);

            return Crudservice.GetAll(csp).AsEnumerable();
        }

        [HttpPut("{userId}/update-district")]
        public IActionResult UpdateDistrictAdminDistrict(int userId, [FromBody] UpdateDistrictDto updateDistrictDto)
        {
            var user = _dbContext.Users
                .Include(u => u.SchoolDistricts_DistrictId)
                .FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var newDistrict = _dbContext.SchoolDistricts.FirstOrDefault(sd => sd.Id == updateDistrictDto.NewDistrictId);

            if (newDistrict == null)
            {
                return NotFound("District not found");
            }

            // Update the user's district ID
            user.SchoolDistrictId = updateDistrictDto.NewDistrictId;

            try
            {
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                // Log the exception (ex) as needed
                return StatusCode(500, "Internal server error");
            }

            // Return the new route for navigation
            var newRoute = $"/school-district-admin/district-admin-district/{updateDistrictDto.NewDistrictId}";
            return Ok(new { message = "District updated successfully", newRoute });
        }


        [HttpPost("update-district-assignments")]
        public IActionResult UpdateDistrictAssignments([FromBody] List<SchoolDistrictAdminDto> districtAssignments)
        {
            foreach (var assignment in districtAssignments)
            {
                var user = _dbContext.Users
                    .Include(u => u.SchoolDistricts_DistrictId)
                    .FirstOrDefault(u => u.Id == assignment.DistrictAdminId);

                if (user == null)
                {
                    return NotFound($"User with Id {assignment.DistrictAdminId} not found");
                }

                var district = _dbContext.SchoolDistricts
                    .FirstOrDefault(sd => sd.Id == assignment.DistrictId);

                if (district == null)
                {
                    return NotFound($"School District with Id {assignment.DistrictId} not found");
                }

                // Determine the current assignments
                var currentAssignments = user.SchoolDistricts_DistrictId.ToList();

                // Get the new assignments for this user
                var newAssignments = districtAssignments
                    .Where(da => da.DistrictAdminId == assignment.DistrictAdminId)
                    .Select(da => da.DistrictId)
                    .ToList();

                // Find assignments to remove (those in currentAssignments but not in newAssignments)
                var assignmentsToRemove = currentAssignments
                    .Where(ca => !newAssignments.Contains(ca.Id))
                    .ToList();

                // Find assignments to add (those in newAssignments but not in currentAssignments)
                var assignmentsToAdd = newAssignments
                    .Where(na => !currentAssignments.Any(ca => ca.Id == na))
                    .ToList();

                // Remove the assignments that are not in the new list
                foreach (var removeAssignment in assignmentsToRemove)
                {
                    user.SchoolDistricts_DistrictId.Remove(removeAssignment);
                    if (user.SchoolDistrictId == removeAssignment.Id)
                    {
                        user.SchoolDistrictId = newAssignments.Cast<int?>().FirstOrDefault();
                    }
                }

                // Add the new assignments
                foreach (var addAssignment in assignmentsToAdd)
                {
                    var addDistrict = _dbContext.SchoolDistricts.FirstOrDefault(sd => sd.Id == addAssignment);
                    if (addDistrict != null)
                    {
                        user.SchoolDistricts_DistrictId.Add(addDistrict);
                    }
                }

                // If the user's SchoolDistrictId is null, assign the first district from districtAssignments
                if (user.SchoolDistrictId == null && newAssignments.Any())
                {
                    user.SchoolDistrictId = newAssignments.First();
                }
            }

            _dbContext.SaveChanges();
            return Ok("Districts assigned successfully");
        }

        public class SchoolDistrictAdminDto
        {
            public int DistrictAdminId { get; set; }
            public int DistrictId { get; set; }
        }

        public class UpdateDistrictDto
        {
            public int NewDistrictId { get; set; }
        }

    }
}


