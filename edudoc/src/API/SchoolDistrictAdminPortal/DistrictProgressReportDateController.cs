using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Linq;
using Service.DistrictProgressReports;
using API.ControllerBase;
using System.Collections.Generic;
using Model.DTOs;
using API.CRUD;
using Service.ProgressReports;

namespace API.SchoolDistrictAdminPortal.DistrictProgressReportDates
{

    [Route("api/v1/district-progress-report-dates")]
    [Restrict(ClaimTypes.ProgressReports, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class DistrictProgressReportDateController : CrudBaseController<DistrictProgressReportDate>
    {

        private readonly IProgressReportsService _progressReportsService;

        public DistrictProgressReportDateController(
                    IProgressReportsService progressReportsService,
                    ICRUDService crudService
                ) : base(crudService)
        {
            _progressReportsService = progressReportsService;
        }

        [HttpGet]
        [Route("create/{id:int}")]
        public IActionResult getOrCreateDistrictProgressReportDate(int id)
        {
            return Ok(_progressReportsService.GetOrCreateDistrictProgressReportDate(id));
        }

        [HttpGet]
        [Route("district/{id:int}")]
        public IActionResult GetDistrictProgressReportDateByDistrictId(int id)
        {
            return Ok(_progressReportsService.GetDistrictProgressReportDateByDistrictId(id));
        }
    }
}