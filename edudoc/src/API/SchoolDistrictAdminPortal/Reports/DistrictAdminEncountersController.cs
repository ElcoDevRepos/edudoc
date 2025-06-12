using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Linq;
using API.CRUD;
using Service.Encounters;
using System.Collections.Generic;
using Model.DTOs;
using Model.Enums;
using System.Linq.Expressions;
using System;
using System.Net;
using Service.Students;
using API.ControllerBase;
using Service.Utilities;

namespace API.Common.DistrictAdminEncounters
{
    [Route("api/v1/district-admin-encounters-by-student")]
    [Restrict(ClaimTypes.EncounterReportingByStudent, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class DistrictAdminEncountersController : CrudBaseController<Encounter>
    {
        private readonly IEncounterService _encounterService;
        private readonly IStudentService _studentService;

        public DistrictAdminEncountersController(
                    IStudentService studentService,
                    ICRUDService crudService,
                    IEncounterService encounterService
        ) : base(crudService)
        {
            _encounterService = encounterService;
            _studentService = studentService;
        }

        [Route("get-encounters")]
        [HttpGet]
        [Restrict(ClaimTypes.EncounterReportingByStudent, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetEncounters([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _encounterService.SearchForEncounters(csp);
            return Ok(
                        searchResults.encounters
                        .AsQueryable()
                        .ToSearchResults(searchResults.count)
                        .Respond(this)
                    );
        }

        [Route("get-total-minutes/{timeZoneOffsetMinutes:int}")]
        [HttpGet]
        [Restrict(ClaimTypes.EncounterReportingByStudent, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetEncounterTotalMinutes([FromQuery] Model.Core.CRUDSearchParams csp, int timeZoneOffsetMinutes)
        {
            return Ok(_encounterService.GetTotalMinutes(csp, -timeZoneOffsetMinutes));
        }

        [HttpGet]
        [Route("cpt-codes/select-options")]
        [Restrict(ClaimTypes.EncounterReportingByStudent, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<SelectOptions> GetAllCptCodeSelectOptions()
        {
            var cspFull = new Model.Core.CRUDSearchParams<CptCode>
            {
                DefaultOrderBy = "Description"
            };

            return Crudservice.GetAll(cspFull).Select(cptCode =>
                new SelectOptions
                {
                    Id = cptCode.Id,
                    Name = $"{cptCode.Code} - {cptCode.Description}".Length > 25 ? $"{cptCode.Code} - {cptCode.Description}".Substring(0, 25) : $"{cptCode.Code} - {cptCode.Description}",
                    Archived = cptCode.Archived
                }).AsEnumerable();
        }

        [HttpGet]
        [Route("providers/select-options/{districtId:int}")]
        [Restrict(ClaimTypes.EncounterReportingByStudent, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<SelectOptions> GetAllProviderSelectOptions([FromRoute] int districtId)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Provider>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Provider>
            {
                dca => dca.ProviderUser,
            },
                DefaultOrderBy = "ProviderUser.FirstName"
            };

            cspFull.AddedWhereClause.Add(provider => provider.ProviderEscAssignments.Any(assignment => !assignment.Archived && assignment.ProviderEscSchoolDistricts.Any(pes => pes.SchoolDistrictId == districtId)));

            return Crudservice.GetAll(cspFull).Select(provider =>
                new SelectOptions
                {
                    Id = provider.Id,
                    Name = provider.ProviderUser.FirstName + " " + provider.ProviderUser.LastName,
                    Archived = provider.Archived
                }).AsEnumerable();
        }

        [HttpGet]
        [Route("students")]
        [Restrict(ClaimTypes.EncounterReportingByStudent, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<SelectOptions> GetStudentOptions([FromQuery] Model.Core.CRUDSearchParams csp)
        {

            var user = Crudservice.GetById<User>(this.GetUserId(), new string[] { "AuthUser", "AuthUser.UserRole" });
            var cspFull = new Model.Core.CRUDSearchParams<Student>(csp) { };

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query);
                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(d =>
                        d.LastName.StartsWith(t) ||
                        d.FirstName.StartsWith(t)
                    );
                }

            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);

                    if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.DistrictAdmin)
                    {
                        cspFull.AddedWhereClause.Add(student => student.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == districtId && sds.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == user.Id)));
                    }
                }
                else if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.DistrictAdmin)
                {
                    cspFull.AddedWhereClause.Add(student => student.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == user.Id)));
                }
            }

            cspFull.DefaultOrderBy = "LastName";

            return Crudservice.GetAll(cspFull).Select(x => new SelectOptions
            {
                Id = x.Id,
                Name = $"{x.LastName}, {x.FirstName} - {x.DateOfBirth.Date.ToShortDateString()} - {x.StudentCode}"
            });
        }

    }
}
