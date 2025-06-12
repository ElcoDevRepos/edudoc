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
using Service.Messages;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;

namespace API.Messages.Documents
{
    [Route("api/v1/messagedocuments")]
    [Restrict(ClaimTypes.Documents, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class MessageDocumentsController : CrudBaseController<MessageDocument>
    {
        private readonly IRequestDocReader _docReader;
        private readonly IDocumentHelper _documentHelper;
        private readonly IMessageService _messageService;

        public MessageDocumentsController(IMessageService messageService, ICRUDBaseService crudservice, IRequestDocReader docReader, IDocumentHelper documentHelper) : base(crudservice)
        {
            _docReader = docReader;
            _documentHelper = documentHelper;
            _messageService = messageService;
            Getbyincludes = new[] { "Provider", "Provider.ProviderUser", "SchoolDistrict", "ProviderTitle", "MessageFilterType" };
            Searchchildincludes = new[] { "Provider", "Provider.ProviderUser", "SchoolDistrict", "ProviderTitle", "MessageFilterType" };
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<MessageDocument>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<MessageDocument>
            {
                message => message.Provider,
                message => message.Provider.ProviderUser,
                message => message.SchoolDistrict,
                message => message.ProviderTitle,
                message => message.MessageFilterType,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(message => terms.All(t => message.Description.StartsWith(t.ToLower())));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(message => !message.Archived);
                }

                if (extras["providerTrainings"] != null)
                {
                    var providerTrainings = int.Parse(extras["providerTrainings"]) == 1;

                    cspFull.AddedWhereClause.Add(message => providerTrainings == message.Mandatory);
                } 
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Id", "desc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpPut]
        [Route("{messageDocumentId:int}/upload")]
        public async Task<IActionResult> Upload([FromRoute] int messageDocumentId)
        {
            var doc = await _docReader.GetDocBytesFromRequest(this);
            var ext = doc.FileName.Split('.').Last();

            var data = Crudservice.GetById<MessageDocument>(messageDocumentId);
            data.FilePath = _documentHelper.CreateDocFileBaseName() + _documentHelper.CheckExtensionDot(ext);
            data.FileName = doc.FileName;
            data.Archived = false;
            var id = base.Update(messageDocumentId, data);

            var absolutePath = _documentHelper.PrependDocsPath(data.FilePath);
            System.IO.File.WriteAllBytes(absolutePath, doc.DocBytes);

            return Ok(id);
        }


        [HttpGet]
        [Route("{messageDocumentId:int}/download")]
        [Restrict(ClaimTypes.AppSettings, ClaimValues.FullAccess)]
        public IActionResult Download([FromRoute] int messageDocumentId)
        {
            var data = Crudservice.GetById<MessageDocument>(messageDocumentId);
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
                FileDownloadName = data.FileName
            };

        }
        public override IActionResult Create(MessageDocument messageDocument)
        {
            if (messageDocument == null) return BadRequest();
            messageDocument.CreatedById = this.GetUserId();

            return Ok(_messageService.CreateDocument(messageDocument));
        }

        public override IActionResult Update([FromRoute] int id, MessageDocument messageDocument)
        {
            if (messageDocument == null) return BadRequest();

            _messageService.UpdateDocument(messageDocument, this.GetUserId());

            return Ok();
        }

    }
}
