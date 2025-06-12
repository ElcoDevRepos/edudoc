using API.Core.Claims;
using API.ControllerBase;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.Messages;
using System;
using System.Collections.Generic;

namespace API.DistrictAdminMessages
{
    [Route("api/v1/district-admin-messages")]
    [Restrict(ClaimTypes.Students, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class DistrictAdminMessagesController : ApiControllerBase
    {
        private readonly IMessageService _service;
        private readonly ICRUDService _crudService;

        public DistrictAdminMessagesController(ICRUDService crudservice, IMessageService service)
        {
            _service = service;
            _crudService = crudservice;
        }

        [HttpGet]
        [Route("messages")]
        public IEnumerable<MessageDto> GetDistrictAdminMessages()
        {

            return _service.GetDistrictAdminMessages(this.GetUserId());
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

            return _service.GetDistrictAdminMessages(this.GetUserId());
        }
        [HttpGet]
        [Route("documents-and-links/{districtAdminId:int}")]
        public IActionResult GetDocumentsAndLinks(int districtAdminId) {
            return Ok(_service.GetDistrictAdminDocumentsAndLinks(districtAdminId));
        }
    }
}
