using Model;

namespace Service.Encounters.ProviderStudentSupervisors
{
    public interface IProviderStudentSupervisorService
    {
        ProviderStudentSupervisor AssignSupervisor(ProviderStudentSupervisor supervisor, int userId);
        ProviderStudentSupervisor AssignAssistant(ProviderStudentSupervisor assistant, int userId);
        ProviderStudentSupervisor UnassignProviderStudentSupervisor(int assistantId, int userId);
        ProviderStudentSupervisor UpdateProviderStudentSupervisor(ProviderStudentSupervisor assistant, int userId);
    }
}
