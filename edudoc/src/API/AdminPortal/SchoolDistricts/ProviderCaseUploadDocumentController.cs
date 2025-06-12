using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Model;
using Model.DTOs;
using Service.SchoolDistricts;
using Service.SchoolDistricts.ProviderCaseUploads;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.SchoolDistricts.Schools
{
    /// <summary>
    /// Responsible for the excel files uploaded that represent a provider's caseload
    /// </summary>
    [Route("api/v1/school-districts/{districtId:int}/case-upload")]
    [Restrict(ClaimTypes.Students, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ProviderCaseUploadDocumentController : ApiControllerBase
    {
        private readonly IProviderCaseUploadDocumentService _providerCaseUploadDocumentService;
        private readonly ISchoolDistrictService _schoolDistrictService;
        private readonly IProviderCaseUploadService _providerCaseUploadService;
        private readonly IRequestDocReader _docReader;
        private readonly IConfiguration _configuration;
        private readonly IDocumentUtilityService _documentUtilityService;
        public ProviderCaseUploadDocumentController(IProviderCaseUploadDocumentService providerCaseUploadDocumentService,
                                                        IProviderCaseUploadService providerCaseUploadService,
                                                        IRequestDocReader docReader,
                                                        ISchoolDistrictService schoolDistrictService,
                                                        IConfiguration configuration,
                                                        IDocumentUtilityService documentUtilityService)
        {
            _providerCaseUploadDocumentService = providerCaseUploadDocumentService;
            _docReader = docReader;
            _providerCaseUploadService = providerCaseUploadService;
            _schoolDistrictService = schoolDistrictService;
            _configuration = configuration;
            _documentUtilityService = documentUtilityService;
        }

        [HttpPost]
        [Route("")]

        [Restrict(ClaimTypes.RosterUpload, ClaimValues.FullAccess)]
        public async Task<IActionResult> UploadDoc(int districtId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var uploadedBy = this.GetUserId();
                var doc = await _docReader.GetDocBytesFromRequest(this);
                var documentCreatedResponse = _providerCaseUploadDocumentService.CreateCaseUploadDocument(districtId, doc.FileName, doc.DocBytes, uploadedBy);
                return Ok(documentCreatedResponse);
            });
        }

        [HttpPost]
        [Route("preview")]
        public async Task<IActionResult> GetProviderCaseUploadPreview(int districtId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var doc = await _docReader.GetDocBytesFromRequest(this);
                return Ok(_providerCaseUploadDocumentService.PreviewRecords(doc.DocBytes, districtId, 100));
            });
        }

        [HttpGet]
        [Route("{docId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult GetCaseUploadDocument(int districtId, int docId)
        {
            if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(this.GetUserId(), districtId))
            {
                return BadRequest(System.Net.HttpStatusCode.Unauthorized);
            }
            var rosterDoc = _providerCaseUploadDocumentService.GetCaseUploadDocument(districtId, docId);
            byte[] caseUpload;

            try
            {
                caseUpload = _providerCaseUploadDocumentService.GetCaseUploadDocumentBytes(districtId, docId);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }
            if (rosterDoc == null || caseUpload == null) return BadRequest("Document record was invalid or file access on disk failed.");

            return new FileStreamResult(new System.IO.MemoryStream(caseUpload), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = rosterDoc.Name
            };
        }


        [HttpGet]
        [Route("_search")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IEnumerable<ProviderCaseUploadDocument> SearchCaseUploads(int districtId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var docQuery = _providerCaseUploadDocumentService.GetCaseUploadDocumentsByDistrictId(districtId);
            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                docQuery = docQuery.Where(d => terms.All(t => d.Name.StartsWith(t)));
            }
            var count = docQuery.Count();
            return docQuery
                .ToSearchResults(count)
                .Respond(this);
        }

        [HttpGet]
        [Route("select-options")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IEnumerable<SelectOptions> GetSelectOptions(int districtId)
        {
            return _providerCaseUploadDocumentService.GetSelectOptions(districtId);
        }

        [HttpGet]
        [Route("sample-roster")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult GetSampleRoster()
        {
            var fileName = _configuration["SampleCaseloadUploadDocumentFilename"];
            byte[] rosterFile;
            try
            {
                rosterFile = _documentUtilityService.GetDocumentBytes(fileName);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }
            catch (Exception)
            {
                return BadRequest(_configuration["SampleCaseloadUploadDocumentFilename"]);

            }


            return new FileStreamResult(new System.IO.MemoryStream(rosterFile), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = fileName
            };
        }
    }
}
