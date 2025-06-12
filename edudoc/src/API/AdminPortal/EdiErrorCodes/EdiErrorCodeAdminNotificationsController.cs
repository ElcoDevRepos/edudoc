using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Collections.Generic;
using System.Linq;

namespace API.EdiErrorCodes
{
    [Route("api/v1/edi-error-code-admin-notifications")]
    [Restrict(ClaimTypes.AppSettings, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EdiErrorCodeAdminNotificationController : CrudBaseController<EdiErrorCodeAdminNotification>
    {
        public EdiErrorCodeAdminNotificationController(ICRUDService crudService) : base(crudService)
        {
            Getbyincludes = new[] { "User" };
            Searchchildincludes = new[] { "User" };
        }

        [HttpGet]
        [Route("admins")]
        public IEnumerable<EdiErrorCodeAdminNotification> GetAdminSelectOptions()
        {
            var csp = new Model.Core.CRUDSearchParams<EdiErrorCodeAdminNotification> {  };
            csp.AddedWhereClause.Add(user => user.User.AuthUser.UserRole.UserTypeId == 1);
            csp.AddedWhereClause.Add(user => user.Id != 1);
            csp.Includes = Getbyincludes;
            csp.DefaultOrderBy = "AdminId";

            return Crudservice.GetAll(csp);
        }
    }
}
