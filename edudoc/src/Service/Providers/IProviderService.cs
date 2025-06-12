using Model;
using Model.DTOs;
using Model.Enums;
using System.Collections.Generic;

namespace Service.Providers
{
    public interface IProviderService
    {
        void ChangeProviderAccessStatus(Provider provider, bool isBlocked, int? doNotBillReason = null, string otherReason = null);

        bool IsProviderAcknowledgmentUpdated(int userId);

        void UpdateProviderAcknowledgment(int userId);

        Provider GetByUserId(int userId);

        IEnumerable<SelectOptions> GetSupervisorOptions(int providerId);

        IEnumerable<SelectOptions> GetAssistantOptions(int providerId);

        int GetReferralsCount(int providerId);
        int RequestProviderApproval(int providerId);
        int UpdateBasicInfo(Provider provider);
        void RemoveProviderReferrals(int providerUserId);
        void UpdateProviderUsername(AuthUser authUser, string username);
        ServiceCodes GetServiceCode(int userId);
    }
}
