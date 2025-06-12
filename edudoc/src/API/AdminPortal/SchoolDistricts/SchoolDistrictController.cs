
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
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using TrackerEnabledDbContext.Common.Interfaces;
using ClaimTypes = API.Core.Claims.ClaimTypes;

namespace API.SchoolDistricts
{
    [Route("api/v1/school-districts")]
    // DO NOT add controller level claim since we are using GetAll to populate drop downs.

    public class SchoolDistrictsController : CrudBaseController<SchoolDistrict>
    {

        private readonly ISchoolDistrictService _schoolDistrictService;
        private readonly IAddressService _addressService;
        private readonly IPrimaryContext _dbContext;


        public SchoolDistrictsController(ICRUDService crudservice, ISchoolDistrictService schoolDistrictService, IAddressService addressService, IPrimaryContext dbContext)
            : base(crudservice)
        {
            Getbyincludes = new[] { "Address", "SchoolDistrictsSchools.School", "EscSchoolDistricts",
                "AccountManager", "AccountAssistant", "AccountManager.UserPhones", "AccountAssistant.UserPhones",
                "Treasurer", "SpecialEducationDirector", "SchoolDistrictsAccountAssistants", "SchoolDistrictsFinancialReps",
                "SchoolDistrictProviderCaseNotes" };
            _schoolDistrictService = schoolDistrictService;
            _addressService = addressService;
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            var csp = new Model.Core.CRUDSearchParams<SchoolDistrict> { order = "Name" };
            csp.AddedWhereClause.Add(sd => sd.ActiveStatus && !sd.Archived);

            return Crudservice.GetAll(csp).Select(schooldistrict =>
               new SelectOptions
               {
                   Id = schooldistrict.Id,
                   Name = schooldistrict.Name,
                   Archived = schooldistrict.Archived
               }).AsEnumerable();
        }

        [HttpGet]
        [Route("{escId:int}/district-options")]
        public IEnumerable<SchoolDistrict> GetDistrictOptionsByEscId(int escId)
        {
            var csp = new Model.Core.CRUDSearchParams<SchoolDistrict> { order = "Name" };
            csp.StronglyTypedIncludes = new Model.Core.IncludeList<SchoolDistrict>
            {
                district => district.SchoolDistrictsSchools,
                district => district.SchoolDistrictsSchools.Select(x => x.School),
            };

            csp.AddedWhereClause.Add(sd => escId == 0 || sd.EscSchoolDistricts.Any(x => x.EscId == escId));

            return Crudservice.GetAll(csp);
        }

        [HttpGet]
        [Route("message-options")]
        public IEnumerable<SchoolDistrict> GetAllForMessages()
        {
            var cspFull = new Model.Core.CRUDSearchParams<SchoolDistrict>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<SchoolDistrict>
            {
                sd => sd.EscSchoolDistricts,
            },
                DefaultOrderBy = "Name"
            };

            return Crudservice.GetAll(cspFull).Where(sd => !sd.Archived).AsEnumerable();
        }

        [HttpGet]
        [Route("search")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

        public IEnumerable<SchoolDistrict> SearchSchoolDistricts([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<SchoolDistrict>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<SchoolDistrict>
            {
                district => district.Address,
                district => district.AccountAssistant,
                district => district.AccountManager,
                district => district.Treasurer,
                district => district.SpecialEducationDirector,
                district => district.EscSchoolDistricts,
                district => district.EscSchoolDistricts.Select(x => x.Esc),
                district => district.SchoolDistrictRosterDocuments,
                district => district.SchoolDistrictsAccountAssistants,
                district => district.SchoolDistrictsFinancialReps
            };


            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);


                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(d =>
                                                      d.Name.StartsWith(t) ||
                                                      d.Code.StartsWith(t)
                                                 );
                }
            }

            var showInactive = false;

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(d => !d.Archived);
                }
                showInactive = extras["showInactive"] == "1";

                if (extras["escId"] != null)
                {
                    int escId = int.Parse(extras["escId"]);
                    if (escId > 0)
                    {
                        cspFull.AddedWhereClause.Add(sd => sd.EscSchoolDistricts.Any(esd => esd.EscId == escId && !esd.Archived));
                    }
                }
                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    cspFull.AddedWhereClause.Add(sd => sd.NotesRequiredDate >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    cspFull.AddedWhereClause.Add(sd => sd.NotesRequiredDate <= DbFunctions.TruncateTime(endDate));
                }
                if (extras["ReportStartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["ReportStartDate"]);
                    cspFull.AddedWhereClause.Add(sd => sd.ProgressReportsSent >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["ReportEndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["ReportEndDate"]);
                    cspFull.AddedWhereClause.Add(sd => sd.ProgressReportsSent <= DbFunctions.TruncateTime(endDate));
                }
            }

            if (!showInactive)
            {
                cspFull.AddedWhereClause.Add(d => d.ActiveStatus);
            }

            cspFull.DefaultOrderBy = "Name";
            if (csp.order != null && csp.orderdirection != null)
            {
                cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            }

            return Crudservice.Search(cspFull, out int ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this);
        }

        [HttpGet]
        [Route("assignableDistricts/{roleId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

        public IEnumerable<SchoolDistrict> GetAssignableSchoolDistricts(int roleId)
        {
            var csp = new Model.Core.CRUDSearchParams<SchoolDistrict>();
            if (roleId == (int)Model.Enums.UserRoles.AccountManager)
            {
                csp.AddedWhereClause.Add(sd => sd.AccountManagerId == null);
            }
            else if (roleId == (int)Model.Enums.UserRoles.AccountAssistant)
            {
                csp.AddedWhereClause.Add(sd => sd.AccountAssistantId == null);
            }
            return Crudservice.GetAll(csp);
        }

        [HttpPost]
        [Route("{schoolDistrictId:int}/address")]

        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult PostUserAddress(int schoolDistrictId, [FromBody] Address address)
        {
            return ExecuteConcurrentValidatedAction(schoolDistrictId,
                () => Ok(_addressService.CreateEntityAddress<SchoolDistrict>(schoolDistrictId, address)),
                _schoolDistrictService.Reload);
        }

        [HttpPut]
        [Route("{schoolDistrictId:int}/address")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IActionResult UpdateAddress(int schoolDistrictId, [FromBody] Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                _addressService.UpdateEntityAddress(address);
                return Ok();
            });
        }

        [HttpDelete]
        [Route("{schoolDistrictId:int}/address")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult DeleteAddress(int schoolDistrictId)
        {
            return ExecuteConcurrentValidatedAction(schoolDistrictId, () =>
            {
                _addressService.DeleteEntityAddress<SchoolDistrict>(schoolDistrictId);
                return Ok();
            }, _schoolDistrictService.Reload);
        }

        [HttpGet]
        [Route("availableDistrictAdmins")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public IEnumerable<User> GetAvailableDistrictAdmins(int districtId)
        {
            var csp = new Model.Core.CRUDSearchParams<User>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<User>
                                            {
                                                user => user.AuthUser.UserRole
                                            }
            };

            int districtAdminType = (int)Model.Enums.UserTypeEnums.DistrictAdmin;
            csp.AddedWhereClause.Add(user => user.AuthUser.UserRole.UserTypeId == districtAdminType);
            csp.AddedWhereClause.Add(user => user.SchoolDistrictId == null);

            csp.DefaultOrderBy = "LastName";

            return Crudservice.GetAll(csp);
        }

        [HttpGet]
        [Route("{districtId:int}/assignedDistrictAdmins")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public IEnumerable<User> GetAssignedDistrictAdmins(int districtId)
        {
            var csp = new Model.Core.CRUDSearchParams<User>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<User>
                                            {
                                                user => user.AuthUser.UserRole
                                            }
            };

            int districtAdminType = (int)Model.Enums.UserTypeEnums.DistrictAdmin;
            csp.AddedWhereClause.Add(user => user.AuthUser.UserRole.UserTypeId == districtAdminType);
            csp.AddedWhereClause.Add(user => user.SchoolDistrictId == districtId);

            csp.DefaultOrderBy = "LastName";

            return Crudservice.GetAll(csp);
        }

        [HttpPut]
        [Route("{schoolDistrictId:int}/assign")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IActionResult AssignAdminDistrict(int schoolDistrictId, [FromBody] int adminUserId)
        {
            return ExecuteValidatedAction(() =>
            {
                var admin = Crudservice.GetById<User>(adminUserId);
                admin.SchoolDistrictId = schoolDistrictId;
                Crudservice.Update(admin);
                return Ok();
            });
        }

        [HttpPut]
        [Route("unassign")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IActionResult UnassignAdminDistrict([FromBody] int adminUserId)
        {
            return ExecuteValidatedAction(() =>
            {
                var admin = Crudservice.GetById<User>(adminUserId);
                admin.SchoolDistrictId = null;
                Crudservice.Update(admin);
                return Ok();
            });
        }

        [HttpGet]
        [Route("contacts/{districtId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public IEnumerable<Contact> GetContacts(int districtId)
        {
            var csp = new Model.Core.CRUDSearchParams<Contact> { };

            csp.AddedWhereClause.Add(contact => !contact.Archived && contact.StatusId != (int)ContactStatuses.Inactive);
            csp.AddedWhereClause.Add(contact => contact.SchoolDistricts_SchoolDistrictId.Any(y => y.Id == districtId));

            csp.DefaultOrderBy = "LastName";

            return Crudservice.GetAll(csp);
        }

        [HttpPost]
        [Route("case-notes-required/{districtId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
        public IActionResult UpdateCaseNotesRequired(int districtId, [FromBody] List<int> providerTitleIds)
        {
            return Ok(_schoolDistrictService.UpdateCaseNotesRequired(districtId, providerTitleIds));
        }


        [HttpGet("{id}")]
        public IActionResult GetSchoolDistrictById(int id)
        {
            var schoolDistrict = _dbContext.SchoolDistricts
                .Include(sd => sd.Address)
                .Include(sd => sd.AccountManager)
                .Include(sd => sd.AccountAssistant)
                .Include(sd => sd.Treasurer)
                .Include(sd => sd.SpecialEducationDirector)
                .Include(sd => sd.MerId)
                .Include(sd => sd.Id)
                .Include(sd => sd.Name)
                .Include(sd => sd.NpiNumber)
                .Include(sd => sd.ProviderCaseUploadDocuments)
                .Include(sd => sd.ProviderCaseUploads)
                .Include(sd => sd.RosterValidationDistricts)
                .Include(sd => sd.SchoolDistrictRosters)
                .Include(sd => sd.IrnNumber)
                .Include(sd => sd.SchoolDistrictRosterDocuments)
                .FirstOrDefault(sd => sd.Id == id);

            if (schoolDistrict == null)
            {
                return NotFound();
            }

            return Ok(schoolDistrict);
        }
    }
}
