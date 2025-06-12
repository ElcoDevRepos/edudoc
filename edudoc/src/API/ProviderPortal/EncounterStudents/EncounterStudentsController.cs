using API.Core.Claims;
using API.Common;
using API.Common.SearchUtilities;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.BillingFailureServices;
using Service.Encounters;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;

namespace API.ProviderPortal.EncounterStudents
{

    [Route("api/v1/encounter-students")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class EncounterStudentsController : CrudBaseController<EncounterStudent>
    {
        private readonly IEncounterStudentService _encounterStudentService;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;
        private readonly IEncounterStudentCptCodeService _encounterStudentCptCodeService;
        private readonly IBillingFailureService _billingFailureService;

        public EncounterStudentsController(
            IEncounterStudentService encounterStudentService,
            IEncounterStudentStatusService encounterStudentStatusService,
            IEncounterStudentCptCodeService encounterStudentCptCodeService,
            ICRUDService crudService,
            IBillingFailureService billingFailureService
        ) : base(crudService)
        {
            Getbyincludes = new[] { "Student", "Student.SupervisorProviderStudentReferalSignOffs", "Student.SupervisorProviderStudentReferalSignOffs.Supervisor", "CaseLoad", "EncounterLocation", "EncounterStudentStatus", "EncounterStudentStatus.CreatedBy", "ESignedBy" };
            Searchchildincludes = new[] { "Student", "Encounter", "EncounterLocation" };

            _encounterStudentService = encounterStudentService;
            _encounterStudentStatusService = encounterStudentStatusService;
            _encounterStudentCptCodeService = encounterStudentCptCodeService;
            _billingFailureService = billingFailureService;
        }

        [HttpGet]
        [Route("get-by-encounterId/{encounterId:int}")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<EncounterStudent> GetByEncounterId(int encounterId)
        {
            return _encounterStudentService.GetByEncounterId(encounterId);
        }

        [HttpGet]
        [Route("{encounterStudentId:int}/isSupervisor")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public bool IsSupervisor(int encounterStudentId)
        {
            var encounterStudent = Crudservice.GetById<EncounterStudent>(encounterStudentId, new[] { "Student", "Student.ProviderStudentSupervisors", "Student.ProviderStudentSupervisors.Supervisor" });

            if (encounterStudent != null &&
                encounterStudent.Student != null &&
                encounterStudent.Student.ProviderStudentSupervisors != null)
            {
                return encounterStudent.Student.ProviderStudentSupervisors
                    .Any(pss => pss.Supervisor != null &&
                                pss.Supervisor.ProviderUserId == this.GetUserId() &&
                                pss.EffectiveEndDate == null);
            }

            return false;
        }


        [HttpPost]
        [Route("create")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess)]
        public IActionResult CreateEncounterStudent([FromBody] EncounterStudentCreateRequestDto encounterStudentCreateRequestDto)
        {
            return ExecuteValidatedAction(() =>
            {
                var createdEncounter = _encounterStudentService.CreateEncounterStudent(encounterStudentCreateRequestDto, this.GetUserId());
                return Ok(createdEncounter);
            });
        }

        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess)]
        public IActionResult UpdateEncounterStudent([FromBody] EncounterStudentRequestDto encounterStudentRequest)
        {
            encounterStudentRequest.EncounterStudent.EncounterStartTime = CommonFunctions.ConvertTimeSpanForDate(encounterStudentRequest.EncounterStudent.EncounterStartTime, encounterStudentRequest.EncounterStudent.EncounterDate);
            encounterStudentRequest.EncounterStudent.EncounterEndTime = CommonFunctions.ConvertTimeSpanForDate(encounterStudentRequest.EncounterStudent.EncounterEndTime, encounterStudentRequest.EncounterStudent.EncounterDate);
            var date = encounterStudentRequest.EncounterStudent.EncounterDate;
            encounterStudentRequest.EncounterStudent.EncounterDate = new DateTime(date.Year, date.Month, date.Day);
            var result = base.Update(encounterStudentRequest.EncounterStudent.Id, encounterStudentRequest.EncounterStudent);

            var encounter = Crudservice.GetById<Encounter>(encounterStudentRequest.EncounterStudent.EncounterId, new[] {"EncounterStudents"});

            var wasGroup = encounter.IsGroup;
            var totalStudentsCount = encounter.EncounterStudents.Count(e => !e.Archived && e.StudentDeviationReasonId == null) + encounter.AdditionalStudents;
            encounter.IsGroup = totalStudentsCount > 1;

            if (!wasGroup && encounter.IsGroup)
            {
                _encounterStudentCptCodeService.UpdateGroupCptCodes(encounter.Id, this.GetUserId());
            }
            else if (wasGroup && !encounter.IsGroup)
            {
                _encounterStudentCptCodeService.UpdateIndividualCptCodes(encounter.Id, this.GetUserId());
            }

            Crudservice.Update(encounter);

            var es = encounterStudentRequest.EncounterStudent;
            // update status if deviation reason was removed
            if (es.ESignedById == null && es.StudentDeviationReasonId == null && es.EncounterStatusId == (int)EncounterStatuses.DEVIATED)
            {
                _encounterStudentStatusService.CheckUnsignedEncounterStudentStatus(es.Id, es.StudentId, es.EncounterId, this.GetUserId());
            }
            return result;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var userId = this.GetUserId();

            var noEvalServiceCodes = new[] { (int)ServiceCodes.Occupational_Therapy, (int)ServiceCodes.Physical_Therapy };
            var noEvalTitles = new[] { "ota", "licensed occupational therapy assistant", "pta", "licensed physical therapy assistant" };
            var provider = Crudservice.GetById<User>(userId, new[] { "Providers_ProviderUserId", "Providers_ProviderUserId.ProviderTitle" }).Providers_ProviderUserId.First();
            var noEval = noEvalServiceCodes.Contains(provider.ProviderTitle.ServiceCodeId) && noEvalTitles.Any( et => provider.ProviderTitle.Name.ToLower().Contains(et));

            var cspFull = new Model.Core.CRUDSearchParams<EncounterStudent>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<EncounterStudent>
                {
                    encounterStudent => encounterStudent.Encounter,
                    encounterStudent => encounterStudent.Encounter.ServiceType,
                    encounterStudent => encounterStudent.Encounter.EvaluationType,
                    encounterStudent => encounterStudent.Student,
                    encounterStudent => encounterStudent.EncounterStatus,
                    encounterStudent => encounterStudent.EncounterLocation,
                    encounterStudent => encounterStudent.EncounterStudentStatus,
                    encounterStudent => encounterStudent.ESignedBy,
                    encounterStudent => encounterStudent.EncounterStudentCptCodes,
                    encounterStudent => encounterStudent.SupervisorESignedBy,
                    encounterStudent => encounterStudent.CaseLoad,
                    encounterStudent => encounterStudent.CaseLoad.CaseLoadScripts,
                    encounterStudent => encounterStudent.ModifiedBy,
                }
            };

            // Only get encounters from that provider
            cspFull.AddedWhereClause.Add(e => e.Encounter.ProviderId == provider.Id);

            var twoDaysAgo = DateTime.UtcNow.AddHours(-48);
            cspFull.AddedWhereClause.Add(es => DbFunctions.TruncateTime(es.DateESigned) >= DbFunctions.TruncateTime(twoDaysAgo));

            if (noEval)
            {
                cspFull.AddedWhereClause.Add(e => e.Encounter.ServiceTypeId  != (int)ServiceTypes.Evaluation_Assessment);
            }

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                cspFull.AddedWhereClause.Add(e =>
                    terms.All(t => e.Student.FirstName.StartsWith(t) || e.Student.LastName.StartsWith(t)));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                cspFull.AddedWhereClause.Add(es => !es.Archived && !es.Encounter.Archived);

                if (extras["returnedOnly"] != null && extras["returnedOnly"] == "1")
                {
                    cspFull.AddedWhereClause.Add(encounterStudent => encounterStudent.Encounter.Provider.ProviderUserId == userId && (encounterStudent.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter || encounterStudent.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter));
                }

                if (extras["approvalsOnly"] != null && extras["approvalsOnly"] == "1")
                {
                    cspFull.AddedWhereClause.Add(es => es.ESignedById != null &&
                                                    es.Student.ProviderStudentSupervisors.Any(pss => pss.Supervisor.ProviderUserId == userId) &&
                                                    es.SupervisorDateESigned == null &&
                                                    es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN);
                }

                if (extras["studentids"] != null)
                {
                    var studentIdsParamsList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "studentids");
                    var studentIds = studentIdsParamsList["studentids"];

                    if (studentIds.Count > 0)
                        cspFull.AddedWhereClause.Add(encounterStudent => studentIds.Contains(encounterStudent.StudentId));
                }

                if (extras["studentId"] != null)
                {
                    var studentId = int.Parse(extras["studentId"]);
                    cspFull.AddedWhereClause.Add(encounterStudent => studentId == encounterStudent.StudentId);
                }

                if (extras["districtId"] != null)
                {
                    var districtId = int.Parse(extras["districtId"]);
                    cspFull.AddedWhereClause.Add(encounterStudent => districtId == encounterStudent.Student.DistrictId);
                }

                if (extras["encounterStartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["encounterStartDate"]);
                    cspFull.AddedWhereClause.Add(es => DbFunctions.TruncateTime(es.EncounterDate) >= DbFunctions.TruncateTime(startDate));
                }

                if (extras["encounterEndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["encounterEndDate"]);
                    cspFull.AddedWhereClause.Add(es => DbFunctions.TruncateTime(es.EncounterDate) <= DbFunctions.TruncateTime(endDate));
                }

                if (extras["locationids"] != null)
                {
                    var locationidsParamsList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "locationids");
                    var locationids = locationidsParamsList["locationids"];

                    if (locationids.Count > 0)
                        cspFull.AddedWhereClause.Add(encounterStudent => locationids.Contains(encounterStudent.EncounterLocationId));
                }

                if (extras["signedEncounters"] != null && extras["signedEncounters"] == "1")
                {
                    cspFull.AddedWhereClause.Add(encounterStudent => encounterStudent.DateESigned.HasValue);
                }

                if (extras["serviceTypeIds"] != null)
                {
                    var serviceTypeIdsParamsList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "serviceTypeIds");
                    var serviceTypeIds = serviceTypeIdsParamsList["serviceTypeIds"];

                    if (serviceTypeIds.Count > 0)
                        cspFull.AddedWhereClause.Add(encounterStudent => serviceTypeIds.Contains(encounterStudent.Encounter.ServiceTypeId));
                }
            }

            var hiddenStatuses = new int[] {
                (int)EncounterStatuses.Invoiced,
                (int)EncounterStatuses.Invoiced_and_Paid,
                (int)EncounterStatuses.Invoiced_and_Denied,
                (int)EncounterStatuses.Invoice_0_service_units,
                (int)EncounterStatuses.Abandoned
            };
            cspFull.AddedWhereClause.Add(encounterStudent => !hiddenStatuses.Contains( encounterStudent.EncounterStatusId));

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>("EncounterStartTime", "desc"));

            return Ok(Crudservice.Search(cspFull, out int count).AsQueryable()
                            .ToSearchResults(count)
                            .Respond(this));
        }

        [HttpPut]
        [Route("{encounterStudentId:int}/sign-encounter")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess)]
        public IActionResult SignEncounter(int encounterStudentId, [FromBody] EncounterEsignAssistantDTO esignPatch)
        {
            if (esignPatch == null)
            {
                return BadRequest(ModelState);
            }
            var existing = Crudservice.GetById<EncounterStudent>(encounterStudentId, new[]{"EncounterStudentCptCodes.CptCode.CptCodeAssocations"});
            if (existing == null)
            {
                return NotFound();
            }
            if(existing.StudentDeviationReasonId == null && existing.EncounterStudentCptCodes.Any(escc => !escc.Archived && escc.Minutes == null)) {
                return ValidationProblem("One or more CPT codes for this student don't have a minutes value filled out.");
            }

            var encounter = Crudservice.GetById<Encounter>(existing.EncounterId);

            var invalidGroupingTypeCptCode = existing.EncounterStudentCptCodes.Any(escc => !escc.Archived && escc.CptCode.CptCodeAssocations.All(cca => cca.IsGroup != encounter.IsGroup));

            if(existing.StudentDeviationReasonId == null && invalidGroupingTypeCptCode && encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy) {
                var firstStringParam = encounter.IsGroup ? " Group" : "n Individual";
                var secondStringParam = encounter.IsGroup ? "Individual" : "Group";
                return ValidationProblem($"This is a{firstStringParam} encounter but one or more CPT codes for this student is only allowed for {secondStringParam} encounters.");
            }



            // Update Encounter Student Status Log
            _encounterStudentStatusService.UpdateEncounterStudentStatusLog(esignPatch.EncounterStatusId, encounterStudentId, this.GetUserId());
            existing.EncounterStatusId = esignPatch.EncounterStatusId;

            if (esignPatch.AssistantSigning)
            {
                existing.DateESigned = esignPatch.DateESigned;
                existing.ESignatureText = esignPatch.ESignatureText;
                existing.ESignedById = esignPatch.ESignedById;

                _billingFailureService.CheckForProviderESignResolution(encounterStudentId, this.GetUserId());
            }
            else
            {
                existing.SupervisorDateESigned = esignPatch.SupervisorDateESigned;
                existing.SupervisorESignatureText = esignPatch.SupervisorESignatureText;
                existing.SupervisorESignedById = esignPatch.SupervisorESignedById;

                _billingFailureService.CheckForSupervisorESignResolution(encounterStudentId, this.GetUserId());
            }

            base.Update(encounterStudentId, existing);
            return Ok(existing);
        }

        [HttpPut]
        [Route("{encounterStudentId:int}/reject-encounter")]
        [Restrict(ClaimTypes.Revise, ClaimValues.FullAccess)]
        public IActionResult RejectEncounter(int encounterStudentId, [FromBody] EncounterEsignRejectionDTO esignRejectionPatch)
        {
            if (esignRejectionPatch == null)
            {
                return BadRequest(ModelState);
            }

            var existing = Crudservice.GetById<EncounterStudent>(encounterStudentId);

            if (existing == null)
            {
                return NotFound();
            }

            existing.EncounterStatusId = esignRejectionPatch.EncounterStatusId;
            existing.SupervisorESignedById = esignRejectionPatch.SupervisorESignedById;
            existing.SupervisorComments = esignRejectionPatch.SupervisorComments;

            // Update Encounter Student Status Log
            _encounterStudentStatusService.UpdateEncounterStudentStatusLog(esignRejectionPatch.EncounterStatusId, encounterStudentId, this.GetUserId());

            return base.Update(encounterStudentId, existing);
        }

        [HttpDelete]
        [Route("{encounterStudentId:int}")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess)]
        public override IActionResult Delete(int encounterStudentId)
        {
            return ExecuteValidatedAction(() =>
            {
                _encounterStudentService.DeleteEncounter(encounterStudentId, this.GetUserId());

                return Ok();
            });

        }


        [HttpDelete]
        [Route("bulkDeleteEncounters")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess)]
        public IActionResult DeleteMultipleStudentsFromEncounters([FromBody] int[] encounterStudentIds)
        {
            return ExecuteValidatedAction(() =>
            {
                _encounterStudentService.DeleteEncounterMultipleStudents(encounterStudentIds, this.GetUserId());

                return Ok();
            });
        }
    }
}
