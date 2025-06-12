using API.Core.Claims;
using API.Common.SearchUtilities;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.SchoolDistricts.SchoolDistrictContacts;
using System.Collections.Generic;
using System.Linq;


namespace API.ESC.ESCContacts
{
    [Route("api/v1/escs/{districtId:int}/contacts")]
    [Restrict(ClaimTypes.ESCs, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class EscContactController : CrudBaseController<Contact>
    {
        private readonly ISchoolDistrictContactService _contactService;

        public EscContactController(ISchoolDistrictContactService contactService, ICRUDService crudservice) : base(crudservice)
        {
            _contactService = contactService;
            Getbyincludes = new[] { "Address", "ContactPhones", "ContactStatus" };
        }

        private int GetEscIdFromRoute()
        {
            return int.Parse(ControllerContext.RouteData.Values["districtId"].ToString());

        }

        public override IActionResult Create([FromBody] Contact contact)
        {
            return ExecuteValidatedAction(() => Ok(_contactService.CreateContact(GetEscIdFromRoute(), contact)));
        }

        public override IActionResult Update(int id, [FromBody] Contact contact)
        {
            return ExecuteValidatedAction(() =>
            {
                _contactService.UpdateContact(contact);
                return Ok();
            });
        }

        public override IActionResult Delete(int id)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_contactService.DeactivateContact(id));
            });
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {

            var escId = GetEscIdFromRoute();

            string extraparams = csp.extraparams;

            var cspFull = new Model.Core.CRUDSearchParams<Contact>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Contact>
                {
                    {(ca) => ca.Address},
                    {(ca) => ca.ContactPhones},
                    {(ca) => ca.ContactStatus },
                    {(ca) => ca.ContactRole }
                },
            };

            cspFull.AddedWhereClause.Add(ca => ca.SchoolDistricts_SchoolDistrictId.Any(d => d.EscSchoolDistricts.Any(e => e.Esc.Id == escId)));

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(cc => cc.LastName.StartsWith(t) ||
                        cc.FirstName.StartsWith(t) ||
                        cc.Email.StartsWith(t) ||
                        cc.Title.StartsWith(t) ||
                        (cc.Address != null && (
                            cc.Address.Address1.StartsWith(t) ||
                            cc.Address.Address2.StartsWith(t) ||
                            cc.Address.City.StartsWith(t) ||
                            cc.Address.StateCode.StartsWith(t) ||
                            cc.ContactStatus.Name.StartsWith(t)
                        )));
                }
            }


            if (!string.IsNullOrEmpty(extraparams))
            {
                var extraParamLists = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "statusIds");
                var typeIdList = extraParamLists["statusIds"];
                cspFull.AddedWhereClause.Add(c => typeIdList.Contains(c.StatusId));
            }

            if (csp.order?.ToLower() == "contactphones")
            {
                cspFull.SortList.Enqueue(
                    new KeyValuePair<string, string>("ContactPhones.FirstOrDefault(IsPrimary).Phone",
                        csp.orderdirection));
            }

            return Ok(base.BaseSearch(cspFull));
        }

    }

}
