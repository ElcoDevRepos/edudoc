using API.Core.Claims;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.SchoolDistricts.Schools;
using System.Collections.Generic;
using System.Linq;

namespace API.SchoolDistricts.Schools
{
    [Route("api/v1/schools")]
    [Restrict(ClaimTypes.SchoolDistrictMaintenance, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class SchoolController : CrudBaseController<School>
    {

        private readonly ISchoolService _schoolService;

        public SchoolController(ICRUDService crudservice, ISchoolService schoolService) : base(crudservice)
        {
            _schoolService = schoolService;
        }

        [HttpPost]
        [Route("{districtId:int}/create")]

        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult CreateSchoolUnderDistrict([FromBody] School school, int districtId)
        {
            return ExecuteValidatedAction(() =>
            {
                var createdSchool = _schoolService.Update(school, districtId, this.GetUserId());
                return Ok(createdSchool);
            });
        }

        [HttpPut]
        [Route("{districtId:int}/update")]

        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult Update([FromBody] School school, int districtId)
        {
            return ExecuteValidatedAction(() =>
            {
                _schoolService.Update(school, districtId, this.GetUserId());
                return Ok();
            });
        }

        [HttpGet]
        [Route("district/{districtId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<School> GetAllDistrictSchools(int districtId)
        {
            Model.Core.CRUDSearchParams<School> csp = new Model.Core.CRUDSearchParams<School>();
            csp.StronglyTypedIncludes = new Model.Core.IncludeList<School>
            {
                school => school.SchoolDistrictsSchools
            };
            csp.AddedWhereClause.Add(school => !school.Archived);
            csp.AddedWhereClause.Add(school => school.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == districtId));
            return Crudservice.GetAll(csp);
        }
    }

}
