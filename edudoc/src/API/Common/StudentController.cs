using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Enums;
using Model.DTOs;
using Service.Addresses;
using Service.Base;
using Service.BillingFailureServices;
using Service.Encounters;
using Service.Students;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using API.Common.SearchUtilities;

namespace API.Students
{
    [Route("api/v1/students")]
    [Restrict(ClaimTypes.Students, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class StudentController : CrudBaseController<Student>
    {
        private readonly IAddressService _addressService;
        private readonly IStudentService _studentService;
        private readonly IBillingFailureService _billingFailureService;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;

        public StudentController(
            ICRUDService crudService,
            IAddressService addressService,
            IStudentService studentService,
            IBillingFailureService billingFailureService,
            IEncounterStudentStatusService encounterStudentStatusService
            ) : base(crudService)
        {
            Getbyincludes = new[] {
                "Address",
                "StudentParentalConsents",
                "StudentParentalConsents.StudentParentalConsentType",
                "School",
                "School.SchoolDistrictsSchools",
                "School.SchoolDistrictsSchools.SchoolDistrict",
                "SchoolDistrict",
                "IepServices",
                "CaseLoads",
            };
            Searchchildincludes = new[] { "School" };
            _addressService = addressService;
            _studentService = studentService;
            _billingFailureService = billingFailureService;
            _encounterStudentStatusService = encounterStudentStatusService;
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

        private void TrimWhiteSpaceOnStudent(Student student) {
            student.FirstName = student.FirstName.Trim();
            student.LastName = student.LastName.Trim();
            if(student.Address != null) {
                _addressService.TrimWhiteSpace(student.Address);
            }
        }

        [Restrict(ClaimTypes.CreateStudent, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public override IActionResult Create(Student student)
        {
            TrimWhiteSpaceOnStudent(student);
            return Ok(_studentService.CreateStudentWithConsent(student, this.GetUserId(), true));
        }

        [HttpPost]
        [Route("create/no-caseload")]
        [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.FullAccess)]
        public IActionResult CreateNoCaseload([FromBody] Student student)
        {
            return ExecuteValidatedAction(() =>
            {
                TrimWhiteSpaceOnStudent(student);
                return Ok(_studentService.CreateStudentWithConsent(student, this.GetUserId(), false));
            });
        }

        [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public override IActionResult Update([FromRoute] int id, [FromBody] Student student)
        {
            TrimWhiteSpaceOnStudent(student);
            base.Update(id, student);
            _billingFailureService.CheckForStudentAddressResolution(id, this.GetUserId());
            _billingFailureService.CheckForMedicaidResolution(student, this.GetUserId());
            return Ok();
        }


        [HttpPost]
        [Route("{studentId:int}/address")]
        [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.FullAccess)]
        public IActionResult PostStudentAddress(int studentId, [FromBody] Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                var addressId = _addressService.CreateEntityAddress<Student>(studentId, address);
                _encounterStudentStatusService.CheckEncounterStudentStatusByStatusId(studentId, (int)EncounterStatuses.ADDRESS_ISSUE, this.GetUserId());
                _billingFailureService.CheckForStudentAddressResolution(studentId, this.GetUserId());
                return Ok(addressId);
            });
        }

        [HttpPut]
        [Route("{studentId:int}/address")]
        [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.FullAccess)]
        public IActionResult UpdateAddress(int studentId, [FromBody] Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                _addressService.UpdateEntityAddress(address);
                _billingFailureService.CheckForStudentAddressResolution(studentId, this.GetUserId());
                return Ok();
            });
        }

        [HttpDelete]
        [Route("{studentId:int}/address")]
        [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.FullAccess)]
        public IActionResult DeleteAddress(int studentId)
        {
            return ExecuteValidatedAction(() =>
            {
                _addressService.DeleteEntityAddress<Student>(studentId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            var cspFull = new Model.Core.CRUDSearchParams<Student> { DefaultOrderBy = "LastName" };

            return Crudservice.GetAll(cspFull).Select(student =>
                new SelectOptions
                {
                    Id = student.Id,
                    Name = student.FirstName + " " + student.LastName
                }).AsEnumerable();
        }

        [HttpGet]
        [Route("select-options-by-districts")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public IEnumerable<SelectOptions> GetSelectOptionsByDistrict([FromQuery] Model.Core.CRUDSearchParams csp)
        {

            return _studentService.GetStudentSelectOptionsByDistricts(csp, this.GetUserId());
        }

        [HttpGet]
        [Route("select-options-by-assistant")]
        public IEnumerable<SelectOptionsWithProviderId> GetStudentSelectOptionsByAssistant()
        {
            return _studentService.GetStudentSelectOptionsByAssistant(this.GetUserId());
        }

        [HttpPut]
        [Route("iep-services")]
        [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.FullAccess)]
        public IActionResult UpdateIEPServices([FromBody] IepService iepService)
        {
            return ExecuteValidatedAction(() =>
            {
                var serviceId = iepService.Id;
                if (serviceId == 0)
                {
                    iepService.CreatedById = this.GetUserId();
                    iepService.DateCreated = DateTime.UtcNow;
                    serviceId = Crudservice.Create<IepService>(iepService);
                }
                else
                {
                    iepService.ModifiedById = this.GetUserId();
                    iepService.DateModified = DateTime.UtcNow;
                    Crudservice.Update<IepService>(iepService);
                }
                return Ok(serviceId);
            });
        }

        [HttpDelete]
        [Route("delete/{studentId:int}")]
        [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.FullAccess)]
        public IActionResult DeleteStudent(int studentId)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_studentService.DeleteStudent(studentId));
            });
        }
    }
}
