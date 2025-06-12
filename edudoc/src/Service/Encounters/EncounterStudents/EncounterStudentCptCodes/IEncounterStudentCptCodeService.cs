
using Model;
using Model.DTOs;
using System.Collections.Generic;

namespace Service.Encounters
{
    public interface IEncounterStudentCptCodeService
    {
        IEnumerable<CptCode> GetCPTCodes(int serviceTypeId, int providerUserId);
        int UpdateGroupCptCodes(int encounterId, int userId);
        int UpdateIndividualCptCodes(int encounterId, int userId);
        IEnumerable<EncounterStudentCptCode> BulkUpdate(int encounterStudentId, List<int> selectedCptCodeIds, int minutes, int userId);
    }
}
