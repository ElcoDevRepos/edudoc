using FluentValidation;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.CaseLoads.CaseLoadOptions;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.Encounters
{
    public class EncounterStudentService : BaseService, IEncounterStudentService
    {
        private readonly IPrimaryContext _context;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;
        private readonly ICaseLoadGoalService _caseLoadGoalService;
        private readonly IEncounterStudentCptCodeService _encounterStudentCptCodeService;
        private readonly IEncounterStudentLibrary _encounterStudentLibrary;

        public EncounterStudentService(
            IPrimaryContext context,
            IEncounterStudentStatusService encounterStudentStatusService,
            ICaseLoadGoalService caseLoadGoalService,
            IEncounterStudentCptCodeService encounterStudentCptCodeService
            ) : base(context)
        {
            _context = context;
            _encounterStudentStatusService = encounterStudentStatusService;
            _caseLoadGoalService = caseLoadGoalService;
            _encounterStudentCptCodeService = encounterStudentCptCodeService;
            _encounterStudentLibrary = new EncounterStudentLibrary(_context);
        }

        public EncounterStudent BuildEncounterStudentFromStudentTherapy(StudentTherapySchedulesData schedule, StudentTherapyProviderData provider, int userId, List<CptCodeAssocation> associations, bool archived, bool isGroup)
        {
            var encounterStudent = new EncounterStudent
            {
                StudentId = schedule.StudentId,
                CaseLoadId = schedule.CaseloadId,
                EncounterStatusId = (int)EncounterStatuses.OPEN_ENCOUNTER_READY_FOR_YOU,
                EncounterLocationId = schedule.EncounterLocationId,
                EncounterStudentCptCodes = _encounterStudentLibrary.BuildCptCodesFromSchedule(schedule, provider, userId, associations, isGroup),
                EncounterStudentGoals = _encounterStudentLibrary.BuildGoalsFromSchedule(schedule, provider, userId),
                EncounterStudentMethods = _encounterStudentLibrary.BuildMethodsFromSchedule(schedule, userId),
                EncounterStartTime = schedule.StartTime,
                EncounterEndTime = schedule.EndTime,
                EncounterDate = schedule.ScheduleDate,
                StudentTherapyScheduleId = schedule.StudentTherapyScheduleId,
                CreatedById = userId,
                DateCreated = DateTime.UtcNow,
                Archived = archived,
            };

            return encounterStudent;
        }

        public EncounterStudent GenerateEncounterNumber(int serviceTypeId, EncounterStudent encounterStudent, int districtId)
        {
            if (serviceTypeId == (int)ServiceTypes.Evaluation_Assessment)
                encounterStudent.EncounterNumber = "E";

            if (serviceTypeId == (int)ServiceTypes.Treatment_Therapy)
                encounterStudent.EncounterNumber = "T";

            if (serviceTypeId == (int)ServiceTypes.Non_Billable)
                encounterStudent.EncounterNumber = "N";

            _encounterStudentLibrary.PrependZeros(encounterStudent, districtId);

            return encounterStudent;
        }

        public EncounterStudent CreateEncounterStudent(EncounterStudentCreateRequestDto encounterStudentRequest, int userId)
        {
            var encounter = _context.Encounters
                .Include(encounter => encounter.Provider)
                .Include(encounter => encounter.Provider.ProviderTitle)
                .Include(encounter => encounter.EncounterStudents)
                .FirstOrDefault(encounter => encounter.Id == encounterStudentRequest.EncounterId);

            var isBillable = encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy;
            var isDeviated = encounterStudentRequest.StudentDeviationReasonId != null && encounterStudentRequest.StudentDeviationReasonId > 0;

            var caseLoad = _encounterStudentLibrary.GetStudentCaseLoad((DateTime)encounter.EncounterDate, encounterStudentRequest.StudentId, encounter.Provider.ProviderTitle.ServiceCodeId);

            if(encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy && encounter.EncounterStudents.Any(es => !es.Archived && es.StudentId == encounterStudentRequest.StudentId)) {
                    throw new ValidationException("An entry already exists on this encounter for this student.");
            }

            var wasGroup = encounter.IsGroup;
            var totalStudentsCount = encounter.EncounterStudents.Count(e => !e.Archived && e.StudentDeviationReasonId == null) + encounter.AdditionalStudents + 1; // Add 1 to include this encounter
            encounter.IsGroup = totalStudentsCount > 1;

            var encounterStudent = new EncounterStudent
            {
                StudentId = encounterStudentRequest.StudentId,
                CaseLoadId = caseLoad?.Id ?? null,
                DiagnosisCodeId = encounter.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment ? encounter.DiagnosisCodeId : null,
                EncounterId = encounterStudentRequest.EncounterId,
                EncounterStatusId = isDeviated ? (int)EncounterStatuses.DEVIATED : _encounterStudentLibrary.GetEncounterStudentStatus(caseLoad, encounter),
                EncounterLocationId = encounterStudentRequest.EncounterLocationId,
                EncounterStudentCptCodes = caseLoad != null ? _encounterStudentLibrary.BuildCptCodesFromCaseLoad(caseLoad, encounter.ServiceTypeId, encounter.ProviderId, encounter.IsGroup, userId) : null,
                EncounterStudentGoals = isBillable && caseLoad != null ? _encounterStudentLibrary.BuildGoalsFromCaseLoad(caseLoad, encounter.EncounterDate.GetValueOrDefault(), userId) : null,
                EncounterStudentMethods = isBillable && caseLoad != null ? _encounterStudentLibrary.BuildMethodsFromCaseLoad(caseLoad, userId) : null,
                EncounterStartTime = encounter.EncounterStartTime.Value,
                EncounterEndTime = encounter.EncounterEndTime.Value,
                EncounterDate = encounter.EncounterDate.Value,
                StudentDeviationReasonId = isDeviated ? encounterStudentRequest.StudentDeviationReasonId : null,
                CreatedById = userId,
                DateCreated = DateTime.UtcNow,
                Archived = false,
            };

            _context.EncounterStudents.Add(encounterStudent);
            _context.SaveChanges();


            if (!wasGroup && encounter.IsGroup)
            {
                _encounterStudentCptCodeService.UpdateGroupCptCodes(encounter.Id, userId);
            }
            else if (wasGroup && !encounter.IsGroup)
            {
                _encounterStudentCptCodeService.UpdateIndividualCptCodes(encounter.Id, userId);
            }


            // TODO pass in district id with dto
            int districtId = _context.Students.FirstOrDefault(s => s.Id == encounterStudentRequest.StudentId).DistrictId ?? 0;
            GenerateEncounterNumber(encounter.ServiceTypeId, encounterStudent, districtId);
            _context.SaveChanges();

            _encounterStudentStatusService.UpdateEncounterStudentStatusLog(encounterStudent.EncounterStatusId, encounterStudent.Id, userId);

            encounterStudent = _context.EncounterStudents
                                .Include((es) => es.Student)
                                .Include((es) => es.Student.SupervisorProviderStudentReferalSignOffs)
                                .Include((es) => es.Student.SupervisorProviderStudentReferalSignOffs.Select(r => r.Supervisor))
                                .Include((es) => es.Student.StudentParentalConsents)
                                .Include((es) => es.CaseLoad)
                                .Include((es) => es.CaseLoad.CaseLoadScripts)
                                .Include((es) => es.EncounterLocation)
                                .Include((es) => es.ESignedBy)
                                .Include((es) => es.StudentDeviationReason)
                                .Include((es) => es.EncounterStudentGoals)
                                .Include((es) => es.EncounterStudentGoals.Select(esg => esg.Goal))
                                .FirstOrDefault((es) => es.Id == encounterStudent.Id);

            return encounterStudent;
        }

        public void DeleteEncounter(int id, int userId)
        {
            var statusesToRemove = _context.EncounterStudentStatus.Where((ess) => ess.EncounterStudentId == id);
            if (statusesToRemove.Any())
                _context.EncounterStudentStatus.RemoveRange(statusesToRemove);

            var encounterStudentCptCodesToRemove = _context.EncounterStudentCptCodes.Where((escc) => escc.EncounterStudentId == id);
            if (encounterStudentCptCodesToRemove.Any())
                _context.EncounterStudentCptCodes.RemoveRange(encounterStudentCptCodesToRemove);

            var encounterStudentMethodsToRemove = _context.EncounterStudentMethods.Where((esm) => esm.EncounterStudentId == id);
            if (encounterStudentMethodsToRemove.Any())
                _context.EncounterStudentMethods.RemoveRange(encounterStudentMethodsToRemove);

            var encounterStudentGoalsToRemove = _context.EncounterStudentGoals.Where((esg) => esg.EncounterStudentId == id);
            if (encounterStudentGoalsToRemove.Any())
                _context.EncounterStudentGoals.RemoveRange(encounterStudentGoalsToRemove);

            _context.SaveChanges();

            var encounterToRemove = _context.EncounterStudents.FirstOrDefault((es) => es.Id == id);
            if (encounterToRemove.StudentTherapyScheduleId != null)
            {
                var studentTherapySchedule = _context.StudentTherapySchedules
                    .FirstOrDefault(sts => sts.Id == encounterToRemove.StudentTherapyScheduleId);
                studentTherapySchedule.Archived = true;
            }

            _context.EncounterStudents.Remove(encounterToRemove);
            _context.SaveChanges();

        }

        public void DeleteEncounterMultipleStudents(int[] encounterIds, int userId)
        {
                var encounterStudentsToRemove = new List<EncounterStudent>();
                var statusToRemoveList = new List<EncounterStudentStatus>();
                var cptCodesToRemoveList = new List<EncounterStudentCptCode>();
                var methodsToRemoveList = new List<EncounterStudentMethod>();
                var goalsToRemoveList = new List<EncounterStudentGoal>();

                try
                {
                    foreach (var encounterId in encounterIds)
                    {
                        var encounter = _context.EncounterStudents
                            .Include(es => es.EncounterStudentStatus)
                            .Include(es => es.EncounterStudentCptCodes)
                            .Include(es => es.EncounterStudentMethods)
                            .Include(es => es.EncounterStudentGoals)
                            .FirstOrDefault(es => es.Id == encounterId);

                        if (encounter == null)
                        {
                            continue;
                        }

                        encounterStudentsToRemove.Add(encounter);
                        statusToRemoveList.AddRange(encounter.EncounterStudentStatus);
                        cptCodesToRemoveList.AddRange(encounter.EncounterStudentCptCodes);
                        methodsToRemoveList.AddRange(encounter.EncounterStudentMethods);
                        goalsToRemoveList.AddRange(encounter.EncounterStudentGoals);
                    }

                    _context.EncounterStudentStatus.RemoveRange(statusToRemoveList);
                    _context.EncounterStudentCptCodes.RemoveRange(cptCodesToRemoveList);
                    _context.EncounterStudentMethods.RemoveRange(methodsToRemoveList);
                    _context.EncounterStudentGoals.RemoveRange(goalsToRemoveList);

                    _context.EncounterStudents.RemoveRange(encounterStudentsToRemove);

                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    //throw new ValidationException("Error occurred when deleting encounters");
                }
        }


        public IEnumerable<EncounterStudent> GetByEncounterId(int encounterId)
        {
            return _context.EncounterStudents
                .Include(es => es.Student)
                .Include(es => es.Student.School)
                .Include(es => es.Student.SchoolDistrict)
                .Include(es => es.Student.School.SchoolDistrictsSchools)
                .Include(es => es.Student.School.SchoolDistrictsSchools.Select(sds => sds.SchoolDistrict))
                .Include(es => es.Student.StudentParentalConsents)
                .Include(es => es.Student.SupervisorProviderStudentReferalSignOffs)
                .Include(es => es.Student.SupervisorProviderStudentReferalSignOffs.Select(sprs => sprs.Supervisor))
                .Include(es => es.CaseLoad)
                .Include(es => es.CaseLoad.CaseLoadScripts)
                .Include(es => es.ESignedBy)
                .Include(es => es.SupervisorESignedBy)
                .Include(es => es.EncounterStudentStatus)
                .Include(es => es.EncounterStudentStatus.Select(ess => ess.CreatedBy))
                .Include(es => es.EncounterLocation)
                .Include(es => es.EncounterStudentMethods)
                .Include(es => es.EncounterStudentMethods.Select(esm => esm.Method))
                .Include(es => es.EncounterStudentCptCodes)
                .Include(es => es.EncounterStudentCptCodes.Select(cc => cc.CptCode))
                .Include(es => es.EncounterStudentGoals)
                .Include(es => es.EncounterStudentGoals.Select(esg => esg.Goal))
                .AsNoTracking()
                .Where(es => es.EncounterId == encounterId && !es.Archived);
        }

    }
}
