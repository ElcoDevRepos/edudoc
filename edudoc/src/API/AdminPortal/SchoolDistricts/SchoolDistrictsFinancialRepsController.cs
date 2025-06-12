using API.Common;
using API.Common.SearchUtilities;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Enums;
using Service.Base;
using Service.Providers;
using Service.SchoolDistricts.FinancialReps;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.SchoolDistricts.FinancialReps
{
    [Route("api/v1/school-districts-financial-reps")]
    public class SchoolDistrictsFinancialRepsController : CrudBaseController<SchoolDistrictsFinancialRep>
    {
        private readonly ISchoolDistrictsFinancialRepsService _financialRepService;
        public SchoolDistrictsFinancialRepsController(ICRUDService crudService, ISchoolDistrictsFinancialRepsService financialRepService) : base(crudService) 
        {
            _financialRepService = financialRepService;
        }

        [HttpPost]
        [Route("update/{schoolDistrictId:int}")]
        public IActionResult UpdateFinancialReps(int schoolDistrictId, [FromBody] IEnumerable<int> financialRepIds) 
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_financialRepService.UpdateFinancialReps(schoolDistrictId, financialRepIds));
            });
        }

    }
}
