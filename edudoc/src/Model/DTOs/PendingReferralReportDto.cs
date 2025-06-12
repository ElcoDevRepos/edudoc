using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.DTOs
{
    public class PendingReferralReportDto
    {
        public int StudentId { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public int DistrictId { get; set; }
        public string DistrictCode { get; set; }
        public int ProviderId { get; set; }
        public string ProviderFirstName { get; set; }
        public string ProviderLastName { get; set; }
        public int ProviderTitleId { get; set; }
        public string ProviderTitle { get; set; }
        public int ServiceTypeId { get; set; }
        public string ServiceType { get; set; }

    }
}
