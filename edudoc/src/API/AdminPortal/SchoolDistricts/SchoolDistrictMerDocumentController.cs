using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Service.SchoolDistricts;
using Service.SchoolDistricts.Mer.MerUploads;
using System.IO;
using System.Threading.Tasks;
using Model.Enums;
using Service.Auth;

namespace API.SchoolDistricts.Schools
{
    /// <summary>
    /// Responsible for the files uploaded that represent a district's mer file
    /// </summary>
    [Route("api/v1/school-districts/{districtId:int}/mer")]
    [Restrict(ClaimTypes.Students, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class SchoolDistrictMerDocumentController : ApiControllerBase
    {
        private readonly ISchoolDistrictMerDocumentService _districtMerDocumentService;
        private readonly ISchoolDistrictService _schoolDistrictService;
        private readonly IRequestDocReader _docReader;
        private readonly IAuthService _authService;
        public SchoolDistrictMerDocumentController(ISchoolDistrictMerDocumentService districtMerDocumentService,
                                                        IRequestDocReader docReader,
                                                        ISchoolDistrictService schoolDistrictService,
                                                        IAuthService authService)
        {
            _districtMerDocumentService = districtMerDocumentService;
            _docReader = docReader;
            _schoolDistrictService = schoolDistrictService;
            _authService = authService;
        }

        [HttpPost]
        [Route("")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public async Task<IActionResult> UploadDoc(int districtId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var uploadedBy = this.GetUserId();
                if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(uploadedBy, districtId) &&
                    _authService.GetInfoByAuthUserId(this.GetUserId()).CustomOptions.UserTypeId != (int)UserTypeEnums.Admin)
                    return Unauthorized();
                var doc = await _docReader.GetDocBytesFromRequest(this);
                var documentCreatedResponse = _districtMerDocumentService.CreateMerDocument(districtId, doc.FileName, doc.DocBytes, uploadedBy);
                _districtMerDocumentService.SendEmail(districtId, doc.FileName);
                return Ok(documentCreatedResponse);
            });
        }

        [HttpGet]
        [Route("")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult GetDocumentByDistrictId(int districtId)
        {
            return Ok(_districtMerDocumentService.GetMerDocumentBySchoolDistrictId(districtId));
        }

        [HttpDelete]
        [Route("{docId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult DeleteMerFile(int districtId, int docId)
        {
            return ExecuteValidatedAction(() =>
            {
                var userId = this.GetUserId();
                if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(userId, districtId) &&
                    _authService.GetInfoByAuthUserId(userId).CustomOptions.UserTypeId != (int)UserTypeEnums.Admin)
                    return Unauthorized();
                _districtMerDocumentService.DeleteMerDocument(districtId, docId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("{docId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult GetMerDocument(int districtId, int docId)
        {
            if (!_schoolDistrictService.CheckIfUserIsDistrictAdmin(this.GetUserId(), districtId) &&
                _authService.GetInfoByAuthUserId(this.GetUserId()).CustomOptions.UserTypeId != (int)UserTypeEnums.Admin)
                return BadRequest(System.Net.HttpStatusCode.Unauthorized);
            var merDoc = _districtMerDocumentService.GetMerDocument(districtId, docId);
            byte[] merFile;

            try
            {
                merFile = _districtMerDocumentService.GetMerDocumentBytes(districtId, docId);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }


            if (merDoc == null || merFile == null) return BadRequest("Document record was invalid or file access on disk failed.");

            return new FileStreamResult(new MemoryStream(merFile), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = merDoc.Name
            };

        }
    }
}
