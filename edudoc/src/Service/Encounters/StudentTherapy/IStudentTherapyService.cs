using Model;

namespace Service.Encounters.StudentTherapies
{
    public interface IStudentTherapyService
    {
        int CreateWithSchedules(StudentTherapy studentTherapy, int userId);
        void DeleteSchedules(StudentTherapy data);
        void UpdateSchedules(StudentTherapy data, int userId);
        void UpdateTherapyGroup(StudentTherapy data, int userId);
    }
}
