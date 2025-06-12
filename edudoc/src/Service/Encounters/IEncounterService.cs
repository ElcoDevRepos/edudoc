using Model;
using Model.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Encounters
{
    public interface IEncounterService
    {
        void BuildTodayFromStudentTherapySchedules();
        (IEnumerable<ClaimAuditResponseDto> claims, int count) SearchForClaims(Model.Core.CRUDSearchParams csp);
        (IEnumerable<EncounterResponseDto> encounters, int count) SearchForEncounters(Model.Core.CRUDSearchParams csp, int? userId = null);
        void UpdateClaimStatus(ClaimAuditRequestDto request, int userId, bool isProvider);
        int GetReturnedEncountersCount(int userId);
        int GetPendingApprovalsCount(int userId);
        int GetPendingTreatmentTherapiesCount(int userId);
        int GetPendingEvaluationsCount(int userId);
        Encounter GetByEncounterStudentId(int encounterStudentId);
        //Encounter GetEncounterFromStudentTherapySchedule(StudentTherapyRequestDto studentTherapyRequestDto, int userId);
        int GetEncounterFromStudentTherapySchedule(StudentTherapiesRequestDto dto, int userId);
        int GetTotalMinutes(Model.Core.CRUDSearchParams csp, int timeZoneOffsetMinutes);
        (IEnumerable<EncounterResponseDto> encounters, int count) SearchForAssistantEncounters(Model.Core.CRUDSearchParams csp, int userId);
        int CheckEncounterStudentOverlap(EncounterOverlapDto dto);
        (IEnumerable<EncounterStudent> encounters, int count) SearchForReturnEncounters(Model.Core.CRUDSearchParams csp, int userId);
        void ArchiveEncounterStudentsByEncounter(int encounterId);
        void ArchiveAll(Model.Core.CRUDSearchParams<Encounter> cspFull);
        void UpdateEvaluationDiagnosisCodes(int encounterId, int? diagnosisCodeId);
    }
}
