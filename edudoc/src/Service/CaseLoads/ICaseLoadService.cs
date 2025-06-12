
using Model;
using System.Collections.Generic;

namespace Service.CaseLoads
{
    public interface ICaseLoadService
    {
        List<CaseLoad> GetCaseLoadsByStudentId(int studentId, int userId);
        CaseLoad GetCaseLoadByTherapyScheduleId(int therapyScheduleId, int userId);
        int RemoveStudentFromCaseload(int studentId, int userId);
    }
}
