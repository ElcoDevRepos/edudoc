using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Linq;
using Service.DistrictProgressReports;
using API.ControllerBase;
using System.Collections.Generic;
using Model.DTOs;

namespace API.Common.DistrictProgressReports
{
    [Route("api/v1/district-progress-reports")]
    [Restrict(ClaimTypes.ProgressReports, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class DistrictProgessReportsController : ApiControllerBase
    {
        private readonly ICRUDService _crudService;
        private readonly IDistrictProgressReportsService _districtProgressReportsService;

        public DistrictProgessReportsController(ICRUDService crudService, IDistrictProgressReportsService districtProgressReportsService)
        {
            _crudService = crudService;
            _districtProgressReportsService = districtProgressReportsService;
        }

        [HttpGet]
        [Route("list/{districtId:int}")]
        public List<DistrictProgressReportDto> GetDistrictProgressReports(int districtId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var search = _districtProgressReportsService.GetDistrictProgressReports(districtId, csp);
            return search.result.AsQueryable().ToSearchResults(search.count).Respond(this).ToList();
        }

        [HttpGet]
        [Route("provider/{userId:int}")]
        public List<DistrictProgressReportStudentsDto> GetDistrictProgressReportStudents(int userId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var search = _districtProgressReportsService.GetDistrictProgressReportStudents(userId, csp);
            return search.result.AsQueryable().ToSearchResults(search.count).Respond(this).ToList();
        }

        [HttpGet]
        [Route("student/{studentId:int}")]
        public IActionResult GetStudentForProgressReport(int studentId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return Ok(_districtProgressReportsService.GetStudentForProgressReport(studentId));
        }
    }
}
