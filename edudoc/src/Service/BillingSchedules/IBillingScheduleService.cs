using System.Threading.Tasks;

namespace Service.BillingSchedules
{
    public interface IBillingScheduleService
    {
        int GenerateHealthCareClaim(int billingScheduleId, int userId);

        void GenerateScheduledBillingSchedules();

        public int ArchiveBillingSchedule(int id);
    }
}
