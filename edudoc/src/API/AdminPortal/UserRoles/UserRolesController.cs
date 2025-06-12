using API.Core.Claims;
using API.Common;
using API.Common.SearchUtilities;
using API.CRUD;
using API.RoleManager;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.UserRoles;
using System.Collections.Generic;
using System.Linq;

namespace API.UserRoles
{
    [Route("api/v1/userRoles")]
    [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class UserRolesController : CrudBaseController<UserRole>
    {
        private readonly IRoleManager _roleManager;
        private readonly IUserRoleService _urService;
        public UserRolesController(IUserRoleService srv, IRoleManager roleManager, ICRUDService crudService) : base(crudService)
        {
            _urService = srv;
            _roleManager = roleManager;
            Searchfields = new[] { new CrudSearchFieldType("Name", CrudSearchFieldType.Method.Contains),
                new CrudSearchFieldType("Description", CrudSearchFieldType.Method.Contains) };
            Getbyincludes = new[] { "UserRoleClaims", "UserRoleClaims.ClaimType", "UserRoleClaims.ClaimValue" };
            Orderby = "Name";
        }

        [Bypass(true)]
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<UserRole>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<UserRole>
            {
                role => role.UserType,
                role => role.UserRoleClaims,
                role => role.UserRoleClaims.Select(urc => urc.ClaimType),
                role => role.UserRoleClaims.Select(urc => urc.ClaimValue),
            }
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                cspFull.AddedWhereClause.Add(ur => terms.All(t => ur.Name.StartsWith(t)));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extraParamLists = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "typeids");

                var typeIdList = extraParamLists["typeids"];
                cspFull.AddedWhereClause.Add(role => typeIdList.Contains(role.UserTypeId));
            }

            int count;

            return Ok(Crudservice.Search(cspFull, out count).AsQueryable()
                            .ToSearchResults(count)
                            .Respond(this));
        }

        [HttpGet]
        [Route("claimTypes")]
        public IEnumerable<ClaimType> GetClaimTypes()
        {
            // have to get funky to order the include
            return _urService
                .GetClaimTypes()
                .OrderBy(ct => ct.Name);
        }

        [HttpGet]
        [Route("claimTypes/userType/{userTypeId:int}")]
        public IEnumerable<ClaimType> GetClaimTypesByUserType(int userTypeId)
        {
            var csp = new Model.Core.CRUDSearchParams<ClaimType>();
            csp.AddedWhereClause.Add(ct => ct.UserTypes.Any(userType => userType.Id == userTypeId));

            return Crudservice.GetAll(csp);
        }

        [HttpDelete]
        [Route("delete/{roleId:int}")]
        [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.FullAccess)]
        public IActionResult DeleteRole(int roleId)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.Delete(roleId);
                _roleManager.DeleteRole(roleId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("claimValues")]
        public IEnumerable<ClaimValue> GetClaimValues()
        {
            return _urService
                .GetClaimValues()
                .OrderBy(cv => cv.Name);
        }

        [HttpGet]
        [Route("withClaims")]
        public IEnumerable<UserRole> GetWithClaims()
        {
            return _urService
                .GetRolesWithClaims()
                .OrderBy(ur => ur.Name);
        }

        [HttpPost]
        [Route("create")]
        [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.FullAccess)]
        public IActionResult PostUserRole([FromBody] UserRole role)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.Create(role);
                _roleManager.StampUserRole(role.Id, role.UserRoleClaims.ToArray());
                return Ok(role);
            });
        }

        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.FullAccess)]
        public IActionResult PutUserRole([FromBody] UserRole role)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.Update(role);
                var updatedRole = _urService.GetById(role.Id);
                _roleManager.StampUserRole(updatedRole.Id, updatedRole.UserRoleClaims.ToArray()); // update role state
                return Ok(role);
            });
        }

        [HttpPut]
        [Route("{roleId:int}/updateClaims")]
        [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.FullAccess)]
        public IActionResult UpdateClaims(int roleId, [FromBody] UserRoleClaim[] urClaims)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.UpdateClaims(roleId, urClaims);
                // update role state for all changes
                foreach (var grp in urClaims.GroupBy(c => c.RoleId))
                    _roleManager.StampUserRole(grp.Key, grp.ToArray());
                return Ok();
            });
        }

        [HttpGet]
        [Route("update-all-roles")]
        public IActionResult UpdateAllUserRoles()
        {
            return Ok(_urService.UpdateAllUserRoles());
        }
    }
}
