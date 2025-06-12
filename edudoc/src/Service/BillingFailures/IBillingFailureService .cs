using Model;
using System.Threading.Tasks;

namespace Service.BillingFailureServices
{
    public interface IBillingFailureService
    {
        int ResolveAllFailures(int userId);
        void CheckForMedicaidResolution(Student student, int userId);
        void CheckForParentalConsentResolution(StudentParentalConsent studentParentalConsent, int userId);
        void CheckForReferralResolution(int studentId, int userId);
        void CheckForProviderESignResolution(int encounterStudentId, int userId);
        void CheckForSupervisorESignResolution(int encounterStudentId, int userId);
        void CheckForStudentAddressResolution(int studentId, int userId);
    }
}
