using API.Common;
using API.Common.SearchUtilities;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Enums;
using Service.Base;
using Service.Providers;
using Service.SchoolDistricts.AccountAssistants;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.SchoolDistricts.AccountAssistants
{
    [Route("api/v1/school-districts-account-assistants")]
    public class SchoolDistrictsAccountAssistantsController : CrudBaseController<SchoolDistrictsAccountAssistant>
    {
        private readonly ISchoolDistrictsAccountAssistantsService _accountAssistantService;
        public SchoolDistrictsAccountAssistantsController(ICRUDService crudService, ISchoolDistrictsAccountAssistantsService accountAssistantService) : base(crudService) 
        {
            _accountAssistantService = accountAssistantService;
        }

        [HttpPost]
        [Route("update/{schoolDistrictId:int}")]
        public IActionResult UpdateAccountAssistants(int schoolDistrictId, [FromBody] IEnumerable<int> accountAssistantIds) 
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_accountAssistantService.UpdateAccountAssistants(schoolDistrictId, accountAssistantIds));
            });
        }

    }
}
