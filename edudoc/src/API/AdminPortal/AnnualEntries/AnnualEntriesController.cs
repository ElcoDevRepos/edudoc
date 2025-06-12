using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.Utilities;
using Service.Vouchers;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.AdminPortal.AnnualEntries
{
    [Route("api/v1/annual-entries")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class AnnualEntriesController : CrudBaseController<AnnualEntry>
    {
        private readonly IPrimaryContext _context;
        public AnnualEntriesController(ICRUDService crudService, IPrimaryContext context) : base(crudService)
        {
            Getbyincludes = new[] { "SchoolDistrict" };
            Searchchildincludes = new[] { "SchoolDistrict" };
            _context = context;
        }
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<AnnualEntry>(csp);

            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<AnnualEntry>
            {
                cpt => cpt.SchoolDistrict
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(a => terms.All(t =>
                    a.AllowableCosts.StartsWith(t.ToLower()) ||
                    a.InterimPayments.StartsWith(t.ToLower()) ||
                    a.SettlementAmount.StartsWith(t.ToLower()) ||
                    a.Mer.StartsWith(t.ToLower()) ||
                    a.Rmts.StartsWith(t.ToLower()) ||
                    a.SchoolDistrict.Name.StartsWith(t.ToLower())
                ));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["StatusIds"] != null)
                {
                    var statusIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "StatusIds");
                    var statusIds = statusIdsParamsList["StatusIds"];

                    if (statusIds.Count > 0)
                        cspFull.AddedWhereClause.Add(annualEntry => statusIds.Contains(annualEntry.StatusId));
                }

                if (extras["SchoolDistrictIds"] != null)
                {
                    var districtIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "SchoolDistrictIds");
                    var districtIds = districtIdsParamsList["SchoolDistrictIds"];

                    if (districtIds.Count > 0)
                        cspFull.AddedWhereClause.Add(annualEntry => districtIds.Contains(annualEntry.SchoolDistrictId));
                }
            }

            cspFull.AddedWhereClause.Add(annualEntry => !annualEntry.Archived);

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                    .ToSearchResults(ct)
                                    .Respond(this));
        }


        [HttpPost]
        [Route("archive/{id:int}")]
        public IActionResult ArchiveAnnualEntry(int id)
        {
            try
            {
                var annualEntry = _context.AnnualEntries.FirstOrDefault(ae => ae.Id == id);
                if (annualEntry == null)
                {
                    return NotFound($"Annual Entry with ID {id} was not found.");
                }

                annualEntry.Archived = true;

                _context.SaveChanges();
                return Ok($"Annual Entry with ID {id} has been successfully archived.");
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"An error occurred while updating the database: {dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"An unexpected error occurred: {ex.Message}");
            }
        }

    }
}
