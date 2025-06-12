using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.Messages.Links
{
    [Route("api/v1/messagelinks")]
    [Restrict(ClaimTypes.Links, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class MessageLinksController : CrudBaseController<MessageLink>
    {
        private readonly IMessageService _messageService;
        public MessageLinksController(IMessageService messageService, ICRUDBaseService crudservice) : base(crudservice)
        {
            _messageService = messageService;
            Getbyincludes = new[] { "Provider", "Provider.ProviderUser", "SchoolDistrict", "ProviderTitle", "MessageFilterType" };
            Searchchildincludes = new[] { "Provider", "Provider.ProviderUser", "SchoolDistrict", "ProviderTitle", "MessageFilterType" };
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<MessageLink>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<MessageLink>
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

        public override IActionResult Create(MessageLink messageLink)
        {
            if (messageLink == null) return BadRequest();
            messageLink.CreatedById =  this.GetUserId();

            return Ok(_messageService.CreateLink(messageLink));
        }

        public override IActionResult Update([FromRoute] int id, MessageLink messageLink)
        {
            if (messageLink == null) return BadRequest();
            _messageService.UpdateLink(messageLink, this.GetUserId());

            return Ok();
        }

    }
}
