using API.Core.Claims;
using API.Common.SearchUtilities;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.Encounters.StudentTherapies;
using System;
using System.Collections.Generic;
using System.Net;
using API.ControllerBase;
using System.Linq;

namespace API.ProviderPortal.StudentTherapies
{
    [Route("api/v1/student-therapy")]

    [Restrict(ClaimTypes.CreateTherapyEncounter, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class StudentTherapyController : CrudBaseController<StudentTherapy>
    {
        private readonly IStudentTherapyService _studentTherapyService;
        public StudentTherapyController(ICRUDService crudService, IStudentTherapyService studentTherapyService) : base(crudService)
        {
            _studentTherapyService = studentTherapyService;
        }

        public override IActionResult Create([FromBody] StudentTherapy data)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_studentTherapyService.CreateWithSchedules(data, this.GetUserId()));
            });
        }

        public override IActionResult Update([FromRoute] int id, [FromBody] StudentTherapy data)
        {
            return ExecuteValidatedAction(() =>
            {
                _studentTherapyService.DeleteSchedules(data);
                if (!data.Archived)
                {
                    _studentTherapyService.UpdateSchedules(data, this.GetUserId());
                }


                // Commented out per customer request. This functionality would update all schedules related to the group if the data is changed
                /*            
                if (data.TherapyGroupId != null)
                {
                    _studentTherapyService.UpdateTherapyGroup(data, this.GetUserId());
                }
                */
                return base.Update(id, data);
            });
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {

            var cspFull = new Model.Core.CRUDSearchParams<StudentTherapy>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<StudentTherapy>
                {
                    st => st.EncounterLocation,
                    st => st.TherapyGroup
                }
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(cspFull.extraparams));
                var extraParamLists = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, "includeArchived");
                var accessStatusList = extraParamLists["includeArchived"];
                cspFull.AddedWhereClause.Add(st => accessStatusList.Contains(st.Archived));
                if (extras["caseLoadId"] != null)
                {
                    int caseLoadId;
                    if (int.TryParse(extras["caseLoadId"], out caseLoadId))
                    {
                        cspFull.AddedWhereClause.Add(st => st.CaseLoadId == caseLoadId);
                    }
                }

                var locationidsParamsList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "locationids");
                var locationids = locationidsParamsList["locationids"];

                if (locationids.Count > 0)
                    cspFull.AddedWhereClause.Add(encounter => locationids.Contains(encounter.EncounterLocationId));

            }

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>("Id", "desc"));

            return Ok(BaseSearch(cspFull));
        }

        [HttpGet]
        [Route("{providerId:int}/group-options")]
        public IEnumerable<TherapyGroup> GetGroupOptions(int providerId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<TherapyGroup>(csp) { };

            cspFull.AddedWhereClause.Add(tg => tg.ProviderId == providerId && !tg.Archived);
            cspFull.DefaultOrderBy = "Name";
            cspFull.order = "Name";
            cspFull.orderdirection = "Desc";

            return Crudservice.GetAll(cspFull);
        }
    }
}
