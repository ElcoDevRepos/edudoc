using Service.Core.Utilities;
using Service.Core.Utilities;
using API.BillingSchedules.Models;
using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.HealthCareClaims;
using Service.Utilities;
using SixLabors.ImageSharp;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.BillingSchedules
{
    [Route("api/v1/billing-response-files")]
    [Restrict(ClaimTypes.ReviewFiles, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class BillingResponseFilesController : CrudBaseController<BillingResponseFile>
    {
        private readonly IHealthCareClaimResponsesService _healthCareClaimResponsesService;
        private readonly IDocumentHelper _documentHelper;
        private readonly IRequestDocReader _docReader;

        public BillingResponseFilesController(
            IHealthCareClaimResponsesService healthCareClaimResponsesService,
            ICRUDService crudService,
            IDocumentHelper documentHelper,
            IRequestDocReader docReader
            ) : base(crudService)
        {

            _healthCareClaimResponsesService = healthCareClaimResponsesService;
            _documentHelper = documentHelper;
            _docReader = docReader;
            Orderby = "DateUploaded";
        }

        [HttpPut]
        [Route("upload")]
        public async Task<IActionResult> Upload([FromForm] CreateFilesParams cfp)
        {
            try
            {
                await _healthCareClaimResponsesService.StoreResponseFiles(cfp.file, this.GetUserId());
            }
            catch (FileAlreadyExistsException e)
            {
                return BadRequest(new { ErrorMessage = $"File has already been uploaded or processed with the name {e.FileName}" });
            }
            return Ok();
        }

        [Route("get-files-history")]
        [HttpGet]
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<BillingResponseFile>(csp) { DefaultOrderBy = Orderby };
            return Ok(base.BaseSearch(cspFull));
        }
    }
}
