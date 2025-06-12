namespace Service.ProviderReferrals
{
    public interface IProviderReferralService
    {
        byte[] GetReferralPdf(int[] referralIds);
        int DeleteReferral(int referralId);
    }
}
