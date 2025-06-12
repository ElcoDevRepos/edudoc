using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using Model.Enums;

namespace Service.CaseLoads.CaseLoadOptions
{
    public class CaseLoadGoalService : BaseService, ICaseLoadGoalService
    {
        private readonly IPrimaryContext _context;
        public CaseLoadGoalService(IPrimaryContext context)
            : base(context)
        {
            _context = context;
        }

        public void AddEncounterGoals(EncounterStudentGoal encounterStudentGoal, int userId)
        {
            var existingCaseLoad = _context.EncounterStudents
                                            .Include(es => es.CaseLoad)
                                            .Include(es => es.CaseLoad.CaseLoadGoals)
                                            .FirstOrDefault(encounterStudent => encounterStudent.Id == encounterStudentGoal.EncounterStudentId).CaseLoad;

            if (existingCaseLoad != null && !existingCaseLoad.CaseLoadGoals.Any(goal => goal.GoalId == encounterStudentGoal.GoalId && !goal.Archived))
            {
                var newCaseLoadGoal = new CaseLoadGoal()
                {
                    CreatedById = userId,
                    DateCreated = DateTime.UtcNow,
                    GoalId = encounterStudentGoal.GoalId,
                };

                existingCaseLoad.CaseLoadGoals.Add(newCaseLoadGoal);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Goal> GetGoals(int providerUserId)
        {
            var serviceCode = _context.ProviderTitles.FirstOrDefault(pt => pt.Providers.Any(p => p.ProviderUserId == providerUserId)).ServiceCodeId;
            var goals = _context.Goals.Where(x => x.ServiceCodes.Any(sc => sc.Id == serviceCode)).ToList();
            return goals;
        }

        public IEnumerable<Goal> GetNursingGoals()
        {
            var goals = _context.Goals.Where(x => x.ServiceCodes.Any(y => y.Id == (int)ServiceCodes.Nursing)).ToList();
            return goals;
        }

    }
}
