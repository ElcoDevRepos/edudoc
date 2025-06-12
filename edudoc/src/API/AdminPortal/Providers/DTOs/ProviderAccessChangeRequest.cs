using Model;

namespace API.Providers.DTOs
{
    public class ProviderAccessChangeRequest
    {
        public Provider Provider
        {
            get;
            set;
        }

        public int? DoNotBillReason
        {
            get;
            set;
        }

        public string OtherReason
        {
            get;
            set;
        }
    }
}
