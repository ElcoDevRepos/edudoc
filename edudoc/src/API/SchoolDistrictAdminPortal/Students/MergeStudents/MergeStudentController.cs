using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Students.Merge;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace API.Students
{
    [Route("api/v1/students/merge")]
    [Restrict(ClaimTypes.MergeStudent, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class MergeStudentController : ApiControllerBase
    {
        private readonly ICRUDService _crudService;
        public readonly IMergeStudentsService _mergeService;

        public MergeStudentController(ICRUDService crudService, IMergeStudentsService mergeService)
        {
            _crudService = crudService;
            _mergeService = mergeService;
        }

        [HttpGet]
        [Route("student-options")]

        public IEnumerable<SelectOptions> GetStudentOptions([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Student>(csp)
            {
                DefaultOrderBy = "FirstName"
            };

            var user = _crudService.GetById<User>(this.GetUserId());
            cspFull.AddedWhereClause.Add(s => s.DistrictId == user.SchoolDistrictId || s.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == user.SchoolDistrictId && !sds.Archived));

            var studentId = 0;

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["studentId"] != null)
                {
                    studentId = int.Parse(extras["studentId"]);
                    cspFull.AddedWhereClause.Add(s => s.Id != studentId);
                }

            }

            return _crudService.GetAll(cspFull).Select(student =>
                new SelectOptions
                {
                    Id = student.Id,
                    Name = student.FirstName + " " + student.LastName
                }).AsEnumerable();
        }

        [HttpPut]
        [Route("execute")]
        [Restrict(ClaimTypes.MergeStudent, ClaimValues.FullAccess)]
        public IActionResult MergeStudent([FromBody] MergeDTO mergeDto)
        {

            return ExecuteValidatedAction(() =>
            {
                mergeDto.Student.ModifiedById = this.GetUserId();

                _mergeService.MergeStudent(mergeDto);

                return Ok();
            });

        }

    }
}
