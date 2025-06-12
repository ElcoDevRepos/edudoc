using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Model;
using Service.Base;
using Service.ProviderReferrals;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using Model.Enums;
using Service.Utilities;
using Service.Encounters;
using Service.Providers;

namespace API.ProviderPortal.ProviderReferrals
{

    [Route("api/v1/provider-student-referrals")]
    [Restrict(ClaimTypes.StudentMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class ProviderReferralsController : CrudBaseController<SupervisorProviderStudentReferalSignOff>
    {
        private readonly IProviderReferralService _providerReferralService;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;
        private readonly IProviderService _providerService;

        public ProviderReferralsController(ICRUDService crudService, IProviderReferralService providerReferralService, IEncounterStudentStatusService encounterStudentStatusService,
         IProviderService providerService) : base(crudService)
        {
            _providerReferralService = providerReferralService;
            _encounterStudentStatusService = encounterStudentStatusService;
            _providerService = providerService;
        }

        public override IActionResult Create([FromBody] SupervisorProviderStudentReferalSignOff data)
        {
            var id = base.Create(data);
            var serviceCode = _providerService.GetServiceCode(this.GetUserId());
            _encounterStudentStatusService.CheckEncounterStudentStatusByStatusAndServiceArea(
                data.StudentId,
                (int)EncounterStatuses.NO_REFFERAL,
                (int)serviceCode,
                this.GetUserId()
            );
            return id;

        }

        public override IActionResult Update(int id, [FromBody] SupervisorProviderStudentReferalSignOff data)
        {
            var result = base.Update(id, data);
            var serviceCode = _providerService.GetServiceCode(this.GetUserId());
            _encounterStudentStatusService.CheckEncounterStudentStatusByStatusAndServiceArea(
                data.StudentId,
                (int)EncounterStatuses.NO_REFFERAL,
                (int)serviceCode,
                this.GetUserId()
            );
            return result;

        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {

            var cspFull = new Model.Core.CRUDSearchParams<SupervisorProviderStudentReferalSignOff>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<SupervisorProviderStudentReferalSignOff>
            {
                referral => referral.SignedOffBy,
                referral => referral.ServiceCode,
                referral => referral.Supervisor,
                referral => referral.Supervisor.ProviderUser,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                int studentId = Int32.Parse(extras["StudentId"]);
                cspFull.AddedWhereClause.Add(referral => referral.StudentId == studentId && referral.SignOffDate != null);

                if (extras["DistrictId"] != null)
                {
                    int districtId = Int32.Parse(extras["DistrictId"]);
                    cspFull.AddedWhereClause.Add(referral => referral.Student.DistrictId == districtId);
                }
            }

            var providerServiceCodeId = Crudservice.GetById<User>(this.GetUserId(), new[] { "Providers_ProviderUserId", "Providers_ProviderUserId.ProviderTitle" }).Providers_ProviderUserId?.FirstOrDefault()?.ProviderTitle?.ServiceCodeId;

            if (providerServiceCodeId != null)
                cspFull.AddedWhereClause.Add(referral => referral.ServiceCodeId == providerServiceCodeId);

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("SignOffDate", "desc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpGet]
        [Route("{referralId:int}/view")]
        [Bypass(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult ViewById([FromRoute] int referralId)
        {
            byte[] data;

            try
            {
                data = _providerReferralService.GetReferralPdf(new int[] { referralId });
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }

            return new FileStreamResult(new MemoryStream(data), new MediaTypeHeaderValue("application/pdf")) { };
        }

        [HttpGet]
        [Route("{studentId:int}/needs-referral")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult NeedsReferral([FromRoute] int studentId)
        {
            var student = Crudservice.GetById<Student>(studentId, new[] { "SupervisorProviderStudentReferalSignOffs", "CaseLoads", "CaseLoads.StudentType" });

            var provider = Crudservice.GetById<User>(this.GetUserId(), new[] { "Providers_ProviderUserId", "Providers_ProviderUserId.ProviderTitle" }).Providers_ProviderUserId.FirstOrDefault();
            var providerServiceAreaId = provider.ProviderTitle.ServiceCodeId;
            var today = DateTime.Now;

            var needsReferral = provider.VerifiedOrp && provider.OrpApprovalDate != null ?
                !student.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                    (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                    referral.EffectiveDateFrom.HasValue &&
                    referral.EffectiveDateFrom.Value >= ((DateTime)provider.OrpApprovalDate).AddYears(-1) &&
                    referral.ServiceCodeId == providerServiceAreaId) &&
                student.CaseLoads.Any(caseLoad => caseLoad.StudentType.IsBillable && !caseLoad.Archived && caseLoad.ServiceCodeId == providerServiceAreaId)
                : false;

            return Ok(needsReferral);
        }

        [HttpPost]
        [Route("view-all")]
        [Restrict(ClaimTypes.CompletedReferrals, ClaimValues.FullAccess)]
        public IActionResult ViewAll([FromBody] int[] referralIds)
        {
            byte[] data;

            try
            {
                data = _providerReferralService.GetReferralPdf(referralIds);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }

            return new FileStreamResult(new MemoryStream(data), new MediaTypeHeaderValue("application/pdf")) { };
        }

        [HttpDelete]
        [Route("delete/{referralId:int}")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult DeleteReferral([FromRoute] int referralId)
        {
            return Ok(_providerReferralService.DeleteReferral(referralId));
        }
    }
}
