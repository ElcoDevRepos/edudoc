using Model.Custom;
using System.Collections.Generic;

namespace Service.Encounters
{
    public interface IEncounterStudentStatusService
    {
        void UpdateInvoice();
        void UpdateEncounterStudentStatusLog(int statusId, int encounterStudentId, int userId);
        void CheckEncounterStudentStatus(int encounterStudentId, int userId);
        void CheckEncounterStudentStatusByStatusId(int studentId, int statusId, int userId);
        void CheckEncounterStudentStatusByStudentId(int studentId, int userId);
        void CheckEncounterStudentStatusByStatusAndServiceArea(int studentId, int statusId, int serviceAreaId, int userId);
        void CheckOlderThan365Encounters();
        void RemoveUnusedEncounters();
        void EncounterStudentStatusUpdateFromBillingFailure(List<EncounterClaimsData> claims, int encounterStatusId);
        void CheckUnsignedEncounterStudentStatus(int encounterStudentId, int studentId, int encounterId, int userId);
    }
}
