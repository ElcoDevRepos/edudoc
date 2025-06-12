
using Model;
using System.Collections.Generic;

namespace Service.CaseLoads.CaseLoadOptions
{
    public interface ICaseLoadGoalService
    {
        IEnumerable<Goal> GetGoals(int providerUserId);
        IEnumerable<Goal> GetNursingGoals();
        void AddEncounterGoals(EncounterStudentGoal encounterStudentGoal, int userId);
    }
}
