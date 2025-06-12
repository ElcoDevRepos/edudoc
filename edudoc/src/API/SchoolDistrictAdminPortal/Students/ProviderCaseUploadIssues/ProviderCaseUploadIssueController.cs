using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.SchoolDistricts.ProviderCaseUploads;
using System.Collections.Generic;
using System.Linq;

namespace API.Students.ProviderCaseUploadIssues
{
    /// <summary>
    /// Handles temporary case uploads before being commited to students table
    /// </summary>
    [Route("api/v1/students/case-upload-issues")]
    [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ProviderCaseUploadIssueController : CrudBaseController<ProviderCaseUpload>
    {
        private readonly IProviderCaseUploadService _providerCaseUploadService;
        public ProviderCaseUploadIssueController(ICRUDBaseService crudservice, IProviderCaseUploadService providerCaseUploadService) : base(crudservice)
        {
            _providerCaseUploadService = providerCaseUploadService;
            Getbyincludes = new[] { "Provider", "Provider.ProviderUser", "Provider.ProviderTitle" };
            Searchchildincludes = new[] { "Provider", "Provider.ProviderUser", "Provider.ProviderTitle" };
        }

        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ProviderCaseUpload>(csp);
            cspFull.Includes = Searchchildincludes;
            var userId = this.GetUserId();
            cspFull.AddedWhereClause.Add(r =>
                r.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) &&
                r.StudentId == null && !r.Archived && (r.HasDataIssues == true || r.HasDuplicates == true));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct)
                    .AsQueryable()
                    .ToSearchResults(ct)
                    .Respond(this));
        }

        [HttpPut]
        [Route("{rosterId:int}")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public override IActionResult Update(int id, [FromBody] ProviderCaseUpload pcu)
        {
            return ExecuteValidatedAction(() =>
            {
                pcu.ModifiedById = this.GetUserId();
                return Ok(_providerCaseUploadService.ProcessDataIssueFix(pcu));
            });
        }

        [HttpDelete]
        [Route("remove-all")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public IActionResult RemoveAllIssues()
        {
            return ExecuteValidatedAction(() =>
            {
                _providerCaseUploadService.RemoveAllIssues(this.GetUserId());
                return Ok();
            });
        }
    }
}
