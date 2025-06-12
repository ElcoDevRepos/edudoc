using API.Core.Claims;
using API.ControllerBase;
using API.CRUD;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Messages;
using System.Collections.Generic;
using System.Linq;

namespace API.Messages
{
    [Route("api/v1/messages")]
    [Restrict(ClaimTypes.MessageMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class MessagesController : CrudBaseController<Message>
    {
        private readonly IMessageService _service;
        private readonly ICRUDService _crudservice;

        public MessagesController(ICRUDService crudservice, IMessageService service) : base(crudservice)
        {
            _service = service;
            _crudservice = crudservice;
            Getbyincludes = new[] { "Provider", "Provider.ProviderUser", "SchoolDistrict", "ProviderTitle", "MessageFilterType" };
            Searchchildincludes = new[] { "Provider", "Provider.ProviderUser", "SchoolDistrict", "ProviderTitle", "MessageFilterType" };
        }

        public override IActionResult Create(Message message)
        {
            if (message == null) return BadRequest();
            message.CreatedById = this.GetUserId();
            int id = _crudservice.Create(message);

            var cspFull = new Model.Core.CRUDSearchParams<Message>
            {
                DefaultOrderBy = "SortOrder",
                orderdirection = "desc",
            };

            message.SortOrder = _crudservice.GetAll(cspFull).FirstOrDefault().SortOrder + 1;
            _crudservice.Update(message);
            return Ok(id);
        }

        [HttpGet]
        [Route("links/search")]
        public IEnumerable<LinkSelectorDTO> SearchLinks([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return _service.GetLinkSelections(csp.Query, null);
        }

        [HttpGet]
        [Route("login")]
        [AllowAnonymous]
        public IEnumerable<MessageDto> GetLoginMessages()
        {
            return _service.GetLoginMessages();
        }


        [HttpPut]
        [Route("reorder")]
        [Restrict(ClaimTypes.MessageMaintenance, ClaimValues.FullAccess)]
        public IActionResult Reorder([FromBody] IEnumerable<Message> messages)
        {
            foreach (var message in messages)
            {
                message.MessageFilterType = null;
                message.Provider = null;
                base.Update(message.Id, message);
            };
            return Ok();
        }

        [HttpDelete]
        [Route("{messageId:int}")]
        public override IActionResult Delete(int messageId)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.DeleteMessages(messageId);
                return Ok();
            });
        }
    }
}
