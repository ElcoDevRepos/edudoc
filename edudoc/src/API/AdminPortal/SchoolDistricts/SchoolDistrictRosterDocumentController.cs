using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Model;
using Service.SchoolDistricts;
using Service.SchoolDistricts.Rosters.RosterUploads;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.SchoolDistricts.Schools
{
    /// <summary>
    /// Responsible for the excel files uploaded that represent a district's roster
    /// </summary>
    [Route("api/v1/school-districts/{districtId:int}/rosters")]
    [Restrict(ClaimTypes.Students, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class SchoolDistrictRosterDocumentController : ApiControllerBase
    {
        private readonly ISchoolDistrictRosterDocumentService _districtRosterDocumentService;
        private readonly ISchoolDistrictService _schoolDistrictService;
        private readonly IRosterUploadService _rosterUploadService;
        private readonly IRequestDocReader _docReader;
        private readonly IConfiguration _configuration;
        private readonly IDocumentUtilityService _documentUtilityService;
        public SchoolDistrictRosterDocumentController(ISchoolDistrictRosterDocumentService districtRosterDocumentService,
                                                        IRosterUploadService rosterUploadService,
                                                        IRequestDocReader docReader,
                                                        ISchoolDistrictService schoolDistrictService,
                                                        IConfiguration configuration,
                                                        IDocumentUtilityService documentUtilityService)
        {
            _districtRosterDocumentService = districtRosterDocumentService;
            _docReader = docReader;
            _rosterUploadService = rosterUploadService;
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
                if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(uploadedBy, districtId))
                    return Unauthorized();
                var doc = await _docReader.GetDocBytesFromRequest(this);
                var documentCreatedResponse = _districtRosterDocumentService.CreateRosterDocument(districtId, doc.FileName, doc.DocBytes, uploadedBy);
                return Ok(documentCreatedResponse);
            });
        }

        [HttpPost]
        [Route("preview")]
        public async Task<IActionResult> GetSchoolDistrictRosterPreview(int districtId)
        {
            if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(this.GetUserId(), districtId))
                return Unauthorized();

            var doc = await _docReader.GetDocBytesFromRequest(this);
            return Ok(_districtRosterDocumentService.PreviewRecords(doc.DocBytes, districtId, 100));
        }

        [HttpGet]
        [Route("_search")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IEnumerable<SchoolDistrictRosterDocument> SearchRosters(int districtId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var docQuery = _districtRosterDocumentService.GetRosterDocumentsBySchoolDistrictId(districtId);
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

        [HttpDelete]
        [Route("{docId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult DeleteRoster(int districtId, int docId)
        {
            return ExecuteValidatedAction(() =>
            {
                var userId = this.GetUserId();
                if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(userId, districtId))
                    return Unauthorized();
                _districtRosterDocumentService.DeleteRosterDocument(districtId, docId);
                return Ok();
            });
        }


        [HttpGet]
        [Route("sample-roster")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult GetSampleRoster()
        {
            var fileName = _configuration["SampleRosterDocumentFilename"];
            byte[] rosterFile;
            try
            {
                rosterFile = _documentUtilityService.GetDocumentBytes(fileName);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }
            catch(Exception)
            {
                return BadRequest(_configuration["SampleRosterDocumentFilename"]);

            }


            return new FileStreamResult(new System.IO.MemoryStream(rosterFile), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = fileName
            };
        }

        [HttpGet]
        [Route("{docId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult GetRosterDocument(int districtId, int docId)
        {
            if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(this.GetUserId(), districtId))
                return BadRequest(System.Net.HttpStatusCode.Unauthorized);
            var rosterDoc = _districtRosterDocumentService.GetRosterDocument(districtId, docId);
            byte[] rosterFile;

            try
            {
                rosterFile = _districtRosterDocumentService.GetRosterDocumentBytes(districtId, docId);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }


            if (rosterDoc == null || rosterFile == null) return BadRequest("Document record was invalid or file access on disk failed.");

            return new FileStreamResult(new System.IO.MemoryStream(rosterFile), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = rosterDoc.Name
            };

        }
    }
}
