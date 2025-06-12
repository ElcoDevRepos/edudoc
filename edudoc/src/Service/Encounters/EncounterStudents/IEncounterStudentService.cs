using Model;
using Model.DTOs;
using System.Collections.Generic;

namespace Service.Encounters
{
    public interface IEncounterStudentService
    {
        IEnumerable<EncounterStudent> GetByEncounterId(int encounterId);
        EncounterStudent BuildEncounterStudentFromStudentTherapy(StudentTherapySchedulesData schedule, StudentTherapyProviderData provider, int userId, List<CptCodeAssocation> associations, bool archived, bool isGroup);
        EncounterStudent GenerateEncounterNumber(int serviceTypeId, EncounterStudent encounterStudent, int districtId);
        void DeleteEncounter(int id, int userId);
        void DeleteEncounterMultipleStudents(int[] encounterStudentIds, int userId);
        EncounterStudent CreateEncounterStudent(EncounterStudentCreateRequestDto encounterStudentCreateRequestDto, int userId);
    }
}
