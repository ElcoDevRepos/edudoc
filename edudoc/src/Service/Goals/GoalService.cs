using Model;
using System;
using System.Data.Entity;
using System.Linq;

namespace Service.Goals
{
    public class GoalService : BaseService, IGoalService
    {
        private readonly IPrimaryContext _context;
        public GoalService(IPrimaryContext context) : base(context)
        {
            _context = context;
        }

        public int Create(Goal goal, int userId)
        {
            ThrowIfNull(goal);
            ValidateAndThrow(goal, new GoalValidator());
            if (goal.NursingResponseId != null)
            {
                HandleNursingGoalResponse(goal);
                goal.NursingGoalResponse = null;
            }
            var serviceCodeIds = goal.ServiceCodes.Select(c => c.Id).ToList();
            goal.ServiceCodes = Context.ServiceCodes.Where(sc => serviceCodeIds.Contains(sc.Id)).ToList();
            goal.CreatedById = userId;
            goal.DateCreated = DateTime.UtcNow;
            Context.Goals.Add(goal);
            Context.SaveChanges();
            return goal.Id;
        }

        public void Update(Goal goal, int userId)
        {
            ThrowIfNull(goal);
            ValidateAndThrow(goal, new GoalValidator());
            if (goal.NursingResponseId != null && goal.NursingGoalResponse.NursingGoalResults != null)
            {
                HandleNursingGoalResponse(goal);
                goal.NursingGoalResponse = null;
            }
            var existingGoal = Context.Goals.Include(g => g.ServiceCodes).FirstOrDefault(g => g.Id == goal.Id);
            if (goal.ServiceCodes != null)
            {
                var serviceCodeIds = goal.ServiceCodes.Select(c => c.Id).ToList();
                existingGoal.ServiceCodes = Context.ServiceCodes.Where(sc => serviceCodeIds.Contains(sc.Id)).ToList();
            }
            goal.ModifiedById = userId;
            goal.DateModified = DateTime.UtcNow;
            Context.Entry(existingGoal).CurrentValues.SetValues(goal);
            Context.SaveChanges();
        }

        private void HandleNursingGoalResponse(Goal goal)
        {
            var resultIds = goal.NursingGoalResponse.NursingGoalResults.Select(ngr => ngr.Id).ToList();
            var existingResponse = Context.NursingGoalResponses.Include(ngr => ngr.NursingGoalResults).FirstOrDefault(ngr => ngr.Id == goal.NursingResponseId);
            existingResponse.NursingGoalResults = Context.NursingGoalResults.Where(ngr => resultIds.Contains(ngr.Id)).ToList();
            Context.Entry(existingResponse).CurrentValues.SetValues(goal.NursingGoalResponse);
            Context.SaveChanges();
        }
    }
}
