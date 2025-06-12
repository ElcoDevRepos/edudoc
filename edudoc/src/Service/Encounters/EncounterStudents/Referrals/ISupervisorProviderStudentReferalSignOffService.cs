
using Model.DTOs;

namespace Service.Encounters.Referrals
{
    public interface ISupervisorProviderStudentReferalSignOffService
    {
        int SignReferral(ReferralSignOffRequest referralSignOffRequest, int userId);
        void SendReferralReminder(int providerId, int studentId, int userId);
    }
}
