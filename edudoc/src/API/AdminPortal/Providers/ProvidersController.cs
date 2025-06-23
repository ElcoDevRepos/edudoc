using API.Core.Claims;
using API.Common;
using API.Common.SearchUtilities;
using API.ControllerBase;
using API.CRUD;
using API.Providers.DTOs;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.Providers;
using Service.Students;
using Service.Users;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Web;

namespace API.Providers
{
    [Route("api/v1/providers")]
    // DO NOT add controller level claim since we are using GetAll to populate drop downs.
    public class ProvidersController : CrudBaseController<Provider>
    {
        private readonly IUserService _userService;
        private readonly IProviderService _providerService;
        private readonly IStudentService _studentService;

        public ProvidersController(IUserService userService,
            IProviderService providerService,
            ICRUDService crudService,
            IStudentService studentService) : base(crudService)
        {
            _userService = userService;
            _providerService = providerService;
            _studentService = studentService;

            Getbyincludes = new[] { "ProviderUser", "ProviderUser.AuthUser", "ProviderEscAssignments" };
            Searchchildincludes = new[] { "ProviderUser" };
        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            var cspFull = new Model.Core.CRUDSearchParams<Provider>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Provider>
            {
                p => p.ProviderUser,
            },
                DefaultOrderBy = "ProviderUser.LastName"
            };

            return Crudservice.GetAll(cspFull).Select(provider =>
                new SelectOptions
                {
                    Id = provider.Id,
                    Name = provider.ProviderUser.LastName + " " + provider.ProviderUser.FirstName,
                    Archived = provider.Archived
                }).AsEnumerable();
        }

        [HttpGet]
        [Route("select-options/by-district/{districtId:int}")]
        [Restrict(ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<SelectOptions> GetSelectOptionsByDistrictId(int districtId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Provider>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Provider>
                {
                    p => p.ProviderUser,
                },
                DefaultOrderBy = "ProviderUser.LastName"
            };

            cspFull.AddedWhereClause.Add(provider =>
                provider.ProviderUser.SchoolDistrictId == districtId ||
                provider.ProviderEscAssignments.Any(pe => pe.ProviderEscSchoolDistricts
                .Any(pesd => pesd.SchoolDistrictId == districtId)));

            var archivedStatusFiltered = false;
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                var extraParamLists = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, "archivedstatus");

                var accessStatusList = extraParamLists["archivedstatus"];

                archivedStatusFiltered = accessStatusList.Count > 0;
                if (archivedStatusFiltered)
                    cspFull.AddedWhereClause.Add(p => accessStatusList.Contains(p.Archived));
            }

            if (!archivedStatusFiltered)
                cspFull.AddedWhereClause.Add(p => !p.Archived); //Default provider search behavior

            return Crudservice.GetAll(cspFull).Select(provider =>
                new SelectOptions
                {
                    Id = provider.Id,
                    Name = provider.ProviderUser.LastName + " " + provider.ProviderUser.FirstName,
                    Archived = provider.Archived
                }).AsEnumerable();
        }

        [HttpGet]
        [Route("message-options")]
        public IEnumerable<Provider> GetAllForMessages()
        {
            var csp = new Model.Core.CRUDSearchParams<Provider>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Provider>
            {
                p => p.ProviderUser,
                p => p.ProviderEscAssignments,
                p => p.ProviderEscAssignments.Select(pea => pea.ProviderEscSchoolDistricts),
                p => p.ProviderTitle,
            },
                DefaultOrderBy = "ProviderUser.LastName"
            };

            return Crudservice.GetAll(csp).Where(sd => !sd.Archived).AsEnumerable();
        }

        [HttpPost]
        [Route("create")]
        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.FullAccess)]
        public IActionResult CreateProvider([FromBody] ProviderDTO dto)
        {
            var thing = dto.Provider;
            return ExecuteValidatedAction(() =>
            {
                if (dto == null) return BadRequest();
                _userService.Create(dto.User, dto.AuthUser.Username, dto.AuthUser.Password, dto.UserTypeId, (bool)dto.SendEmail);
                dto.Provider.ProviderUserId = dto.User.Id;
                dto.Provider.CreatedById = this.GetUserId();
                int resultId = Crudservice.Create(dto.Provider);
                return Ok(resultId);
            });
        }


        [HttpGet]
        [Route("searchProviders")]
        [Restrict(ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<SelectOptions> SearchProviders([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Provider>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<Provider>
            {
                provider => provider.ProviderTitle,
                provider => provider.ProviderUser,
                provider => provider.ProviderUser.AuthUser,
                provider => provider.ProviderEscAssignments,
                provider => provider.ProviderEscAssignments.Select(pe => pe.Esc),
                provider => provider.ProviderEscAssignments.Select(pe => pe.ProviderEscSchoolDistricts),
                provider => provider.ProviderEscAssignments.Select(pe => pe.ProviderEscSchoolDistricts.Select(pesd => pesd.SchoolDistrict)),
            };

            cspFull.AddedWhereClause.Add(p => !p.Archived);

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(p =>
                                                    p.ProviderUser.FirstName.ToLower().StartsWith(t.ToLower()) ||
                                                    p.ProviderUser.LastName.ToLower().StartsWith(t.ToLower()) ||
                                                    p.ProviderUser.Email.ToLower().StartsWith(t.ToLower())
                                                );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams)) {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if(extras["districtIds"] != null) {
                    var districtIds = CommonFunctions.GetIntListFromExtraParams(csp.extraparams,"districtIds")["districtIds"];
                    cspFull.AddedWhereClause.Add(p =>
                            (p.ProviderUser.SchoolDistrictId.HasValue && districtIds.Contains(p.ProviderUser.SchoolDistrictId.Value)) ||
                            p.ProviderEscAssignments.Any(pea =>
                                pea.ProviderEscSchoolDistricts.Any(peasd => districtIds.Contains(peasd.SchoolDistrictId))));
                }
            }

            cspFull.DefaultOrderBy = "ProviderUser.LastName";
            if (csp.order != null && csp.orderdirection != null)
            {
                cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            }

            return Crudservice.GetAll(cspFull).Select(provider =>
               new SelectOptions
               {
                   Id = provider.Id,
                   Name = provider.ProviderUser.LastName + " " + provider.ProviderUser.FirstName,
                   Archived = provider.Archived
               }).AsEnumerable();
        }


        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            Orderby = "LastName";

            var cspFull = new Model.Core.CRUDSearchParams<Provider>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<Provider>
            {
                provider => provider.ProviderTitle,
                provider => provider.ProviderUser,
                provider => provider.ProviderUser.AuthUser,
                provider => provider.ProviderEscAssignments,
                provider => provider.ProviderEscAssignments.Select(pe => pe.Esc),
                provider => provider.ProviderEscAssignments.Select(pe => pe.ProviderEscSchoolDistricts),
                provider => provider.ProviderEscAssignments.Select(pe => pe.ProviderEscSchoolDistricts.Select(pesd => pesd.SchoolDistrict)),
            };

            cspFull.AddedWhereClause.Add(p => p.ProviderUser.FirstName.Trim().ToLower() != "district" && p.ProviderUser.LastName.Trim().ToLower() != "maintenance");

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                cspFull.AddedWhereClause.Add(p =>
                    terms.All(t => (p.ProviderUser.FirstName != null && p.ProviderUser.FirstName.StartsWith(t)) ||
                        (p.ProviderUser.LastName != null && p.ProviderUser.LastName.StartsWith(t)) ||
                        (p.ProviderTitle.Name.StartsWith(t)) ||
                        (p.ProviderUser.Email.StartsWith(t)))
                    );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                var extraParamLists = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, "archivedstatus");
                var accessStatusList = extraParamLists["archivedstatus"];

                if (accessStatusList.Count > 0)
                    cspFull.AddedWhereClause.Add(provider => accessStatusList.Contains(provider.Archived));


                var intParams = SearchStaticMethods.GetIntParametersFromExtraParams(csp.extraparams, new[] { "schoolDistrictId" });
                int schoolDistrictId = intParams["schoolDistrictId"];
                if (schoolDistrictId != 0)
                {
                    cspFull.AddedWhereClause.Add(provider =>
                    provider.ProviderEscAssignments
                    .Any(pe => pe.ProviderEscSchoolDistricts
                    .Any(pesd => pesd.SchoolDistrictId == schoolDistrictId && pesd.SchoolDistrict.ActiveStatus && (pesd.ProviderEscAssignment.EndDate == null || pesd.ProviderEscAssignment.EndDate >= DateTime.Now)) && !pe.Archived));
                }
                if (extras["escId"] != null)
                {
                    int escId = int.Parse(extras["escId"]);
                    cspFull.AddedWhereClause.Add(provider => provider.ProviderEscAssignments.Any(pe => !pe.Archived && pe.EscId == escId));
                }
                if (extras["medicaidOnly"] == "1")
                {
                    int[] medicaidTitleIds = new int[] { (int)ServiceCodes.Audiology, (int)ServiceCodes.Occupational_Therapy, (int)ServiceCodes.Physical_Therapy, (int)ServiceCodes.Speech_Therapy };
                    cspFull.AddedWhereClause.Add(provider => medicaidTitleIds.Contains(provider.ProviderTitle.ServiceCodeId));
                }
                if (extras["MedicaidStatusIds"] != null)
                {
                    var medicaidStatusIdsParamList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "MedicaidStatusIds");
                    var medicaidStatusIds = medicaidStatusIdsParamList["MedicaidStatusIds"];

                    if (medicaidStatusIds.Count > 0 && medicaidStatusIds.Count < 3)
                    {
                        if (medicaidStatusIds.Contains((int)MedicaidStatuses.Confirmed) && medicaidStatusIds.Contains((int)MedicaidStatuses.Pending))
                        {
                            cspFull.AddedWhereClause.Add(p => p.VerifiedOrp);
                        }
                        else if (medicaidStatusIds.Contains((int)MedicaidStatuses.Confirmed) && medicaidStatusIds.Contains((int)MedicaidStatuses.NoAcknowledgement))
                        {
                            cspFull.AddedWhereClause.Add(p => (p.VerifiedOrp && p.OrpApprovalDate != null) || !p.VerifiedOrp);
                        }
                        else if (medicaidStatusIds.Contains((int)MedicaidStatuses.Pending) && medicaidStatusIds.Contains((int)MedicaidStatuses.NoAcknowledgement))
                        {
                            cspFull.AddedWhereClause.Add(p => (p.VerifiedOrp && p.OrpApprovalRequestDate != null && p.OrpApprovalDate == null) || !p.VerifiedOrp);
                        }
                        else if (medicaidStatusIds.Contains((int)MedicaidStatuses.Confirmed))
                        {
                            cspFull.AddedWhereClause.Add(p => p.VerifiedOrp && p.OrpApprovalDate != null);
                        }
                        else if (medicaidStatusIds.Contains((int)MedicaidStatuses.NoAcknowledgement))
                        {
                            cspFull.AddedWhereClause.Add(p => !p.VerifiedOrp);
                        }
                        else if (medicaidStatusIds.Contains((int)MedicaidStatuses.Pending))
                        {
                            cspFull.AddedWhereClause.Add(p => p.VerifiedOrp && p.OrpApprovalRequestDate != null && p.OrpApprovalDate == null);
                        }
                    }
                }

            }

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>("ProviderUser.LastName", "asc"));
            int count;
            return Ok(Crudservice.Search(cspFull, out count).AsQueryable()
                            .ToSearchResults(count)
                            .Respond(this));
        }

        private void UpdateProviderDistrictsIfDistrictEmployed(Provider data, int oldEmploymentType)
        {
            if (data.ProviderEmploymentTypeId == (int)ProviderEmploymentTypes.DistrictEmployed &&
                oldEmploymentType == (int)ProviderEmploymentTypes.Contract)
            {
                var csp = new Model.Core.CRUDSearchParams<ProviderEscAssignment>();
                csp.AddedWhereClause.Add(pe => pe.ProviderId == data.Id);
                csp.order = "Id";
                var assignments = Crudservice.GetAll(csp).ToList();
                foreach (var assignment in assignments.Select(psd => new ProviderEscAssignment
                {
                    Id = psd.Id,
                    Agency = null,
                    AgencyId = null,
                    AgencyType = null,
                    AgencyTypeId = null,
                    ProviderId = psd.ProviderId,
                    Provider = psd.Provider,
                    StartDate = psd.StartDate,
                    EndDate = psd.EndDate,
                }))


                {
                    Crudservice.Update(assignment);
                }
            }
        }

        [HttpPut]
        [Route("update")]

        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.FullAccess)]
        public IActionResult UpdateProvider([FromBody] ProviderDTO dto)
        {
            return ExecuteValidatedAction(() =>
            {
                if (dto == null) return BadRequest();
                if (dto.SendEmail == null) dto.SendEmail = false;
                dto.Provider.ModifiedBy = null;
                dto.Provider.ProviderUser = null;
                Crudservice.Update(dto.Provider);
                _providerService.UpdateProviderUsername(dto.User.AuthUser, dto.User.AuthUser.Username);
                dto.User.AuthUser = null;
                dto.User.Providers_ProviderUserId = null;
                Crudservice.Update(dto.User, new CRUDServiceOptions { currentuserid = this.GetUserId() });
                UpdateProviderDistrictsIfDistrictEmployed(dto.Provider, dto.OldEmploymentTypeId);
                // Remove all referrals if ORP rejected
                if (dto.Provider.OrpDenialDate != null)
                {
                    _providerService.RemoveProviderReferrals(dto.User.Id);
                }
                return Ok(dto.Provider.Id);
            });
        }

        [HttpPut]
        [Route("changeBlocked/{newBlockedStatus:int}")]
        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.FullAccess)]
        public IActionResult ChangeProviderBlockedStatus([FromBody] ProviderAccessChangeRequest providerAccessRequest, int newBlockedStatus)
        {
            return ExecuteValidatedAction(() =>
            {
                if (providerAccessRequest == null || providerAccessRequest.Provider == null) return BadRequest();
                bool newStatusBool = newBlockedStatus == 1;
                _providerService.ChangeProviderAccessStatus(providerAccessRequest.Provider, newStatusBool,
                    providerAccessRequest.DoNotBillReason, providerAccessRequest.OtherReason);
                return Ok();
            });
        }


        [HttpGet]
        [Route("get-acknowledgment")]
        [Restrict(ClaimTypes.ProviderAcknowledgements, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public Acknowledgement GetAcknwoledgment()
        {
            return Crudservice.GetById<Acknowledgement>(1);
        }


        [HttpGet]
        [Route("{userId:int}/acknowledgment-status")]
        [Restrict(ClaimTypes.ProviderAcknowledgements, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public bool IsProviderAcknowledgmentUpdated(int userId)
        {
            return _providerService.IsProviderAcknowledgmentUpdated(userId);
        }

        [HttpPost]
        [Route("acknowledgment/{userId:int}")]
        [Restrict(ClaimTypes.ProviderAcknowledgements, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult UpdateProviderAcknowledgmentStatus(int userId)
        {
            return ExecuteValidatedAction(() =>
            {
                _providerService.UpdateProviderAcknowledgment(userId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("{providerId:int}/acknowledgments")]
        [Restrict(ClaimTypes.ProviderAcknowledgements, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

        public IEnumerable<ProviderAcknowledgmentLog> GetProviderAcknowledgmentLogs([FromQuery] int providerId)
        {
            var csp = new Model.Core.CRUDSearchParams<ProviderAcknowledgmentLog>();
            csp.AddedWhereClause.Add(log => log.ProviderId == providerId);
            csp.DefaultOrderBy = "DateAcknowledged";
            csp.order = "DateAcknowledged";
            csp.orderdirection = "Desc";
            return Crudservice.GetAll(csp);
        }


        [HttpGet]
        [Route("{providerId:int}/schooldistricts")]
        public IEnumerable<SelectOptions> GetSchoolDistricts(int providerId)
        {
            var cspFull = new Model.Core.CRUDSearchParams<SchoolDistrict>();
            cspFull.AddedWhereClause.Add(schoolDistrict => schoolDistrict.ProviderEscSchoolDistricts
                                                .Any(providerSchoolDistrict =>
                                                        providerSchoolDistrict.ProviderEscAssignment.ProviderId == providerId &&
                                                        !providerSchoolDistrict.ProviderEscAssignment.Archived &&
                                                        (providerSchoolDistrict.ProviderEscAssignment.EndDate == null || providerSchoolDistrict.ProviderEscAssignment.EndDate >= DateTime.Now)));
            cspFull.AddedWhereClause.Add(schoolDistrict => !schoolDistrict.Archived);

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>("Name", "asc"));


            return Crudservice
                    .GetAll(cspFull)
                    .Select(schooldistrict =>
                               new SelectOptions
                               {
                                   Id = schooldistrict.Id,
                                   Name = schooldistrict.Name,
                                   Archived = schooldistrict.Archived
                               }).AsEnumerable();
        }

        [HttpGet]
        [Route("{providerId:int}/missing-referral-options")]
        public IEnumerable<SelectOptions> GetProviderOptionsForMissingReferral(int providerId)
        {
            var provider = Crudservice.GetById<Provider>(providerId, new string[] { "ProviderUser", "ProviderEscAssignments", "ProviderEscAssignments.ProviderEscSchoolDistricts", "ProviderTitle" });
            var schoolDistrictIds = provider.ProviderEscAssignments
                .Where(esc => !esc.Archived)
                .SelectMany(p => p.ProviderEscSchoolDistricts.Select(sd => sd.SchoolDistrictId)).Distinct();

            var cspFull = new Model.Core.CRUDSearchParams<Provider>();
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<Provider>
            {
                provider => provider.ProviderUser,
            };
            cspFull.AddedWhereClause.Add(p => p.ProviderTitle.ServiceCodeId == provider.ProviderTitle.ServiceCodeId &&
                !p.Archived &&
                p.ProviderEscAssignments.Any(assignment => !assignment.Archived
                    && assignment.ProviderEscSchoolDistricts.Any(pes => schoolDistrictIds.Contains(pes.SchoolDistrictId))));

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>("ProviderUser.LastName", "asc"));

            return Crudservice
                    .GetAll(cspFull)
                    .Select(provider =>
                        new SelectOptions
                        {
                            Id = provider.Id,
                            Name = $"{provider.ProviderUser.LastName}, {provider.ProviderUser.FirstName}",
                            Archived = provider.Archived
                        }).AsEnumerable();
        }

        [HttpGet]
        [Route("last-documentation-date/{providerId:int}")]
        public IActionResult GetLastDocumentationDate(int providerId)
        {
            if (providerId > 0)
            {
                var provider = Crudservice.GetById<Provider>(providerId);
                var csp = new Model.Core.CRUDSearchParams<Encounter>();
                csp.AddedWhereClause.Add(enc => enc.CreatedById == provider.ProviderUserId);
                csp.DefaultOrderBy = "DateCreated";
                csp.order = "DateCreated";
                csp.orderdirection = "Desc";
                var res = Crudservice.GetAll(csp).FirstOrDefault();
                return Ok(res != null ? res.DateCreated : null);
            }
            else
            {
                return Ok();
            }
        }

        [HttpGet]
        [Route("case-notes-required/{providerId:int}")]
        public IEnumerable<SchoolDistrictProviderCaseNote> GetProviderCaseNotesRequired(int providerId)
        {
            var provider = Crudservice.GetById<Provider>(providerId);
            var csp = new Model.Core.CRUDSearchParams<SchoolDistrictProviderCaseNote>();
            csp.order = "Id";
            csp.AddedWhereClause.Add(cn => cn.ProviderTitleId == provider.TitleId);

            return Crudservice.GetAll(csp).AsEnumerable();
        }
    }
}
