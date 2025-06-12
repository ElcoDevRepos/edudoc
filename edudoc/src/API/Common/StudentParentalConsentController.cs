using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.BillingFailureServices;
using Service.StudentParentalConsents;
using System.Collections.Generic;
using System.Linq;

namespace API.StudentParentalConsents
{
    [Route("api/v1/student-parental-consents")]
    [Restrict(ClaimTypes.Students, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class StudentParentalConsentController : CrudBaseController<StudentParentalConsent>
    {
        private readonly IStudentParentalConsentService _studentParentalConsentService;
        private readonly IBillingFailureService _billingFailureService;

        public StudentParentalConsentController(
            ICRUDService crudService,
            IStudentParentalConsentService studentParentalConsentService,
            IBillingFailureService billingFailureService
            ) : base(crudService)
        {
            _studentParentalConsentService = studentParentalConsentService;
            _billingFailureService = billingFailureService;
        }

        public override IActionResult Update([FromRoute] int id, [FromBody] StudentParentalConsent studentParentalConsent)
        {
            var response = base.Update(id, studentParentalConsent);
            _billingFailureService.CheckForParentalConsentResolution(studentParentalConsent, this.GetUserId());
            return response;
        }

        [HttpGet]
        [Route("search/student-consents")]
        public IActionResult SearchStudentConsents([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var studentParentalConsentSearch = _studentParentalConsentService.SearchStudentParentalConsents(csp, this.GetUserId());
            return Ok(studentParentalConsentSearch
                    .StudentParentalConsents
                    .AsQueryable()
                    .ToSearchResults(studentParentalConsentSearch.Count)
                    .Respond(this));
        }

        [HttpGet]
        [Route("search/student-consents/district")]
        public IActionResult SearchStudentConsentsByDistrict([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var studentParentalConsentSearch = _studentParentalConsentService.SearchStudentParentalConsentsByDistrict(csp, this.GetUserId());
            return Ok(studentParentalConsentSearch
                    .StudentParentalConsents
                    .AsQueryable()
                    .ToSearchResults(studentParentalConsentSearch.Count)
                    .Respond(this));
        }

        [HttpGet]
        [Route("claims-summary/{schoolDistrictId:int}")]
        public ClaimsSummaryDTO GetClaimsSummary(int schoolDistrictId)
        {
            return _studentParentalConsentService.GetClaimsSummary(schoolDistrictId, this.GetUserId());
        }

    }
}
