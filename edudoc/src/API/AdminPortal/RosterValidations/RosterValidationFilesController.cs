using Service.Core.Utilities;
using Service.Core.Utilities;
using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Model;
using Service.Base;
using Service.RosterValidations;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace API.RosterValidationFiles
{
    [Route("api/v1/roster-validations")]
    [Restrict(ClaimTypes.MedMatch, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class RosterValidationFilesController : CrudBaseController<RosterValidationFile>
    {
        private readonly IRosterValidationService _rosterValidationService;
        private readonly IRosterValidationResponsesService _rosterValidationResponseService;
        private readonly IDocumentHelper _documentHelper;
        private readonly IRequestDocReader _docReader;

        public RosterValidationFilesController(
            IRosterValidationService rosterValidationService,
            IRosterValidationResponsesService rosterValidationResponseService,
            ICRUDService crudService,
            IDocumentHelper documentHelper,
            IRequestDocReader docReader
            ) : base(crudService)
        {

            _rosterValidationService = rosterValidationService;
            _rosterValidationResponseService = rosterValidationResponseService;
            _documentHelper = documentHelper;
            _docReader = docReader;
        }

        [Route("get-files")]
        [HttpGet]
        [Restrict(ClaimTypes.MedMatch, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetRosterValidationFiles([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<RosterValidationFile>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<RosterValidationFile>
            {
                rf => rf.RosterValidationResponseFiles,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(file => terms.All(t => file.Name.StartsWith(t.ToLower())));
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("DateCreated", "desc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpGet]
        [Route("{rosterValidationFileId:int}/download")]
        [Restrict(ClaimTypes.MedMatch, ClaimValues.FullAccess)]
        public IActionResult Download([FromRoute] int rosterValidationFileId)
        {
            var data = Crudservice.GetById<RosterValidationFile>(rosterValidationFileId);
            var absolutePath = _documentHelper.PrependDocsPath(data.FilePath);
            byte[] rosterFile;

            try
            {
                rosterFile = System.IO.File.ReadAllBytes(absolutePath);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }

            return new FileStreamResult(new System.IO.MemoryStream(rosterFile), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = data.Name
            };

        }

        [HttpPut]
        [Route("{rosterValidationFileId:int}/upload")]
        public async Task<IActionResult> Upload([FromRoute] int rosterValidationFileId)
        {
            var doc = await _docReader.GetDocBytesFromRequest(this);
            var ext = doc.FileName.Split('.').Last();

            var data = new RosterValidationResponseFile { RosterValidationFileId = rosterValidationFileId, UploadedById = this.GetUserId() };

            data.FilePath = _documentHelper.CreateDocFileBaseName() + _documentHelper.CheckExtensionDot(ext);
            data.Name = doc.FileName;
            var id = Crudservice.Create(data);

            var absolutePath = _documentHelper.PrependDocsPath(data.FilePath);
            System.IO.File.WriteAllBytes(absolutePath, doc.DocBytes);

            var response = _rosterValidationResponseService.ProcessRosterValidationResponse(id, rosterValidationFileId, this.GetUserId());

            if (response == null)
            {
                return NotFound();
            } else
            {
                return Ok(response);
            }
        }

        [HttpPost]
        [Route("generate")]
        public async Task<IActionResult> GenerateRosterValidationFile()
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                await _rosterValidationService.GenerateRosterValidation(this.GetUserId());
                return Ok();
            });
        }

        [HttpGet]
        [Route("get-uploaded-students")]
        [Restrict(ClaimTypes.MedMatch, ClaimValues.FullAccess)]
        public (IEnumerable<RosterValidationStudent> students, DateTime? latestUploadDate) Get271UploadedStudents([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var studentSearch = _rosterValidationService.Get271UploadedStudents(csp);
            return (studentSearch.student.AsQueryable().ToSearchResults(studentSearch.count).Respond(this),
                studentSearch.latestUploadDate);
        }
    }
}
