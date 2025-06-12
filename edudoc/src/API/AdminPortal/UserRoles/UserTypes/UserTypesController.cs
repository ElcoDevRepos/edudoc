using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Collections.Generic;

namespace API.UserTypes
{
    [Route("api/v1/userTypes")]
    [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class UserTypesController : ApiControllerBase
    {
        private readonly ICRUDService _crudService;

        public UserTypesController(ICRUDService crudService)
        {
            _crudService = crudService;
        }

        [HttpGet]
        public IEnumerable<UserType> GetUserTypes()
        {
            return _crudService.GetAll(new Model.Core.CRUDSearchParams<UserType>());
        }
    }
}
