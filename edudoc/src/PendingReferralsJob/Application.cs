using System;
using Model;
using Service.PendingReferrals;

namespace PendingReferralsJob
{
    public interface IApplication
    {
        void Run();
    }

    public class Application : IApplication
    {
        private readonly IPendingReferralService _pendingReferralService;
        private readonly IPrimaryContext _context;

        public Application(
            IPendingReferralService pendingReferralService,
            IPrimaryContext context
        )
        {
            _pendingReferralService = pendingReferralService;
            _context = context;
        }

        public void Run()
        {
            _pendingReferralService.UpdatePendingReferralTable();
            Console.WriteLine("The job ran!");
        }
    }
}
