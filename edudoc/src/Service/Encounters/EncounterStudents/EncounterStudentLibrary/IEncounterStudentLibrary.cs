using Model;
using Model.DTOs;
using System;
using System.Collections.Generic;

namespace Service.Encounters
{
    public interface IEncounterStudentLibrary
    {
        void PrependZeros(EncounterStudent encounterStudent, int districtId);

        List<EncounterStudentCptCode> BuildCptCodesFromSchedule(StudentTherapySchedulesData schedule, StudentTherapyProviderData provider, int userId, List<CptCodeAssocation> associations, bool isGroup);

        List<EncounterStudentGoal> BuildGoalsFromSchedule(StudentTherapySchedulesData schedule, StudentTherapyProviderData provider, int userId);

        List<EncounterStudentMethod> BuildMethodsFromSchedule(StudentTherapySchedulesData schedule, int userId);

        CaseLoad GetStudentCaseLoad(DateTime encounterDate, int studentId, int serviceCodeId);

        List<EncounterStudentCptCode> BuildCptCodesFromCaseLoad(CaseLoad caseload, int serviceTypeId, int providerId, bool isGroup, int userId);

        List<EncounterStudentGoal> BuildGoalsFromCaseLoad(CaseLoad caseload, DateTime encounterDate, int userId);

        List<EncounterStudentMethod> BuildMethodsFromCaseLoad(CaseLoad caseload, int userId);

        int GetEncounterStudentStatus(CaseLoad caseLoad, Encounter encounter);

    }
}
