using API.Core.Claims;
using API.ControllerBase;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace API.ProviderMessages
{
    [Route("api/v1/provider-messages")]
    [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class ProviderMessagesController : ApiControllerBase
    {
        private readonly IMessageService _service;
        private readonly ICRUDService _crudService;

        public ProviderMessagesController(ICRUDService crudservice, IMessageService service)
        {
            _service = service;
            _crudService = crudservice;
        }

        [HttpGet]
        [Route("links")]
        public IEnumerable<LinkSelectorDTO> GetDocumentLinks([FromQuery] Model.Core.CRUDSearchParams csp)
        {

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["providerid"] != null)
                {
                    return _service.GetLinkSelections("", Int32.Parse(extras["providerid"]));
                }
            }

            return _service.GetLinkSelections(csp.Query, null);
        }

        [HttpGet]
        [Route("messages")]
        public IEnumerable<MessageDto> GetProviderMessages()
        {

            return _service.GetProviderMessages(this.GetUserId());
        }

        [HttpGet]
        [Route("mark-as-read/{messageId:int}")]
        public IEnumerable<MessageDto> MarkMessageAsRead(int messageId)
        {
            _crudService.Create(new ReadMessage
            {
                DateRead = DateTime.UtcNow,
                Id = 0,
                MessageId = messageId,
                ReadById = this.GetUserId(),
            });

            return _service.GetProviderMessages(this.GetUserId());
        }

        [Route("training")]
        [HttpPut]
        public IActionResult CompleteTraining([FromBody] ProviderTraining providerTraining)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.CompleteTraining(providerTraining);
                return Ok();
            });
        }


    }
}
