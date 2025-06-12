using Model;
using System.Collections.Generic;

namespace Service.PendingReferrals
{
    public interface IPendingReferralService
    {
        PendingReferralReportJobRun UpdatePendingReferralTable(int jobRunById = 1);
        PendingReferralReportJobRun GetLastJobRun();
    }
}
