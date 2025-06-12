using System.Collections.Generic;
using System.Linq;
using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.ProgressReports;
using Model.Custom;

namespace API.ProviderPortal.ProgressReports
{

    [Route("api/v1/progress-reports")]
    [Restrict(ClaimTypes.ProgressReports, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class ProgressReportsController : CrudBaseController<ProgressReport>
    {

        private readonly IProgressReportsService _progressReportsService;

        public ProgressReportsController(
                    IProgressReportsService progressReportsService,
                    ICRUDService crudService
                ) : base(crudService)
        {
            _progressReportsService = progressReportsService;
            Getbyincludes = new[] { "Student", "Student.SchoolDistrict", "Student.School", "Student.School.SchoolDistrictsSchools", "Student.School.SchoolDistrictsSchools.SchoolDistrict", "ESignedBy", "SupervisorESignedBy" };
        }

        [HttpGet]
        [Route("list")]
        public IActionResult GetProgressReportsForList([FromQuery] CRUDSearchParams csp)
        {
            var cspFull = new CRUDSearchParams<Student>(csp);
            var searchResults = _progressReportsService.GetProgressReportsForList(cspFull, this.GetUserId());
            return Ok(
                        searchResults.ProgressReports
                        .ToSearchResults(searchResults.Count)
                        .Respond(this)
                        .ToList()
                    );
        }

        [HttpGet]
        [Route("case-notes/{studentId:int}")]
        public IEnumerable<ProgressReportCaseNotesDto> GetProgressReportCaseNotes(int studentId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return _progressReportsService.GetProgressReportCaseNotes(studentId, this.GetUserId(), csp);
        }

        [HttpGet]
        [Route("pending-reports-count")]
        public IActionResult GetPendingProgressReportsCount()
        {
            return Ok(_progressReportsService.GetLateProgressReportsCount(this.GetUserId()));
        }

        [HttpGet]
        [Route("{studentId:int}/{quarter:int}")]
        public IActionResult GetProgressReportsForStudentAndQuarter(int studentId, int quarter) {
            var providerUserId = this.GetUserId();
            var result = _progressReportsService.GetForProviderStudentAndQuarter(providerUserId, studentId, quarter);
            return Ok(result);
        }

        [HttpGet]
        [Route("permissions")]
        public ProgressReportPermissionsData ProgressReportPermissions() {
            return _progressReportsService.GetProgressReportPermissions(this.GetUserId());
        }

    }
}


