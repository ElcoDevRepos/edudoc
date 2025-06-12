using Model;
using Service.BillingSchedules;
using Service.HealthCareClaims;

namespace BillingSchedulesJob
{
    public interface IApplication
    {
        void Run();
    }

    public class Application : IApplication
    {
        private readonly IBillingScheduleService _billingScheduleService;
        private readonly IHealthCareClaimResponsesService _healthCareClaimResponsesService;
        private readonly IPrimaryContext _context;

        public Application(
            IBillingScheduleService billingScheduleService,
            IHealthCareClaimResponsesService healthCareClaimResponsesService,
            IPrimaryContext context
        )
        {
            _billingScheduleService = billingScheduleService;
            _healthCareClaimResponsesService = healthCareClaimResponsesService;
            _context = context;
        }

        public void Run()
        {
            _billingScheduleService.GenerateScheduledBillingSchedules();
            _healthCareClaimResponsesService.HandleBillingResponseFileProcessing();
        }
    }
}
