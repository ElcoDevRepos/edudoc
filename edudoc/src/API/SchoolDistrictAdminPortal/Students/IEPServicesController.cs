using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Students;
using Service.Students.StudentIEPServices;
using System.Collections.Generic;
using System.Linq;

namespace API.Students
{
    [Route("api/v1/iep-services")]
    [Restrict(ClaimTypes.Students, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class IEPServicesController : CrudBaseController<IepService>
    {
        private readonly IStudentService _studentService;
        private readonly IStudentIEPServicesService _iepService;

        public IEPServicesController(
            ICRUDService crudService,
            IStudentService studentService,
            IStudentIEPServicesService iepService
            ) : base(crudService)
        {
            Getbyincludes = new[] { "Student" };
            Searchchildincludes = new[] { "Student" };
            _studentService = studentService;
            _iepService = iepService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var studentSearch = _studentService.SearchStudents(csp, this.GetUserId());
            return Ok(studentSearch
                    .Student
                    .AsQueryable()
                    .ToSearchResults(studentSearch.Count)
                    .Respond(this));
        }

        [HttpGet]
        [Route("get-list")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public IActionResult GetList([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResult = _iepService.GetList(csp, this.GetUserId());
            return Ok(
                searchResult.items.AsQueryable()
                .ToSearchResults(searchResult.count)
                .Respond(this)
            );
        }
    }
}
