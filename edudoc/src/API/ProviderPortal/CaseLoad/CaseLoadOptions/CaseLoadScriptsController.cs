using Service.Core.Utilities;
using Service.Core.Utilities;
using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Model;
using Service.Base;
using Service.CaseLoads.CaseLoadOptions;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;

namespace API.ProviderPortal.CaseLoads
{

    [Route("api/v1/case-load-scripts")]
    [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class CaseLoadScriptsController : CrudBaseController<CaseLoadScript>
    {
        private readonly IRequestDocReader _docReader;
        private readonly IDocumentHelper _documentHelper;

        public CaseLoadScriptsController(ICRUDService crudService, IRequestDocReader docReader, IDocumentHelper documentHelper) : base(crudService)
        {
            _docReader = docReader;
            _documentHelper = documentHelper;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<CaseLoadScript>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<CaseLoadScript>
            {
                cls => cls.CaseLoadScriptGoals,
                cls => cls.CaseLoadScriptGoals.Select(clsg => clsg.Goal),
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(script => !script.Archived);
                }

                int caseLoadId = Int32.Parse(extras["CaseLoadId"]);
                cspFull.AddedWhereClause.Add(script => script.CaseLoadId == caseLoadId);
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Npi", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpPut]
        [Route("{caseLoadScriptId:int}/upload")]
        public async Task<IActionResult> Upload([FromRoute] int caseLoadScriptId)
        {
            PostedDoc doc;
            var data = Crudservice.GetById<CaseLoadScript>(caseLoadScriptId);
            try
            {
                doc = await _docReader.GetDocBytesFromRequest(this);
                var ext = doc.FileName.Split('.').Last();
                data.FilePath = _documentHelper.CreateDocFileBaseName() + _documentHelper.CheckExtensionDot(ext);
                data.FileName = doc.FileName;
                data.Archived = false;
                var absolutePath = _documentHelper.PrependDocsPath(data.FilePath);
                System.IO.File.WriteAllBytes(absolutePath, doc.DocBytes);
            }
            catch
            {
                data.FilePath = "";
                data.FileName = "";
                data.Archived = false;
            }
            var id = base.Update(caseLoadScriptId, data);
            return id;
        }


        [HttpGet]
        [Route("{caseLoadScriptId:int}/download")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult Download([FromRoute] int caseLoadScriptId)
        {
            var data = Crudservice.GetById<CaseLoadScript>(caseLoadScriptId);
            var absolutePath = _documentHelper.PrependDocsPath(data.FilePath);
            byte[] scriptFile;

            try
            {
                scriptFile = System.IO.File.ReadAllBytes(absolutePath);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }

            return new FileStreamResult(new System.IO.MemoryStream(scriptFile), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = data.FileName
            };

        }

    }
}
