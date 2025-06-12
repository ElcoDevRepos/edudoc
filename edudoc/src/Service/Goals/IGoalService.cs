using Model;

namespace Service.Goals
{
    public interface IGoalService
    {
        int Create(Goal goal, int userId);
        void Update(Goal goal, int userId);
    }
}
