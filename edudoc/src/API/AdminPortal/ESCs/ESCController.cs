
using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Addresses;
using Service.Base;
using Service.SchoolDistricts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using ClaimTypes = API.Core.Claims.ClaimTypes;

namespace API.ESC
{
    [Route("api/v1/escs")]
    // DO NOT add controller level claim since we are using GetAll to populate drop downs.

    public class EscController : CrudBaseController<Esc>
    {

        private readonly IAddressService _addressService;
        private readonly IEscService _escService;

        public EscController(ICRUDService crudservice, IAddressService addressService, IEscService escService)
            : base(crudservice)
        {
            Getbyincludes = new[] { "Address", "EscSchoolDistricts" };
            _addressService = addressService;
            _escService = escService;
        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            return _escService.GetAllSelectOptions();
        }

        [HttpGet]
        [Route("select-options/{providerId:int}")]
        public IEnumerable<SelectOptions> GetProviderSelectOptions(int providerId)
        {
            return _escService.GetProviderSelectOptions(providerId);
        }

        [Restrict(ClaimTypes.ESCs, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Esc>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<Esc>
            {
                esc => esc.Address,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                cspFull.AddedWhereClause.Add(esc => terms.All(t => esc.Name.StartsWith(t) || esc.Code.StartsWith(t)));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(esc => !esc.Archived);
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Name", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpPost]
        [Route("{escId:int}/address")]

        [Restrict(ClaimTypes.ESCs, ClaimValues.FullAccess)]
        public IActionResult PostUserAddress(int escId,[FromBody] Address address)
        {
            return ExecuteConcurrentValidatedAction(escId,
                () => Ok(_addressService.CreateEntityAddress<Esc>(escId, address)),
                _escService.Reload);
        }

        [HttpPut]
        [Route("{escId:int}/address")]
        [Restrict(ClaimTypes.ESCs, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IActionResult UpdateAddress(int escId, [FromBody] Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                _addressService.UpdateEntityAddress(address);
                return Ok();
            });
        }

        [HttpDelete]
        [Route("{escId:int}/address")]
        [Restrict(ClaimTypes.ESCs, ClaimValues.FullAccess)]
        public IActionResult DeleteAddress(int escId)
        {
            return ExecuteConcurrentValidatedAction(escId, () =>
            {
                _addressService.DeleteEntityAddress<Esc>(escId);
                return Ok();
            }, _escService.Reload);
        }

        [HttpGet]
        [Route("contacts/{escId:int}")]
        [Restrict(ClaimTypes.ESCs, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public IEnumerable<Contact> GetContacts(int escId)
        {
            var csp = new Model.Core.CRUDSearchParams<Contact> { };

            csp.AddedWhereClause.Add(contact => !contact.Archived && contact.StatusId != (int)ContactStatuses.Inactive);
            csp.AddedWhereClause.Add(contact => contact.SchoolDistricts_SchoolDistrictId.Any(y => y.Id == escId));

            csp.DefaultOrderBy = "LastName";

            return Crudservice.GetAll(csp);
        }

    }
}
