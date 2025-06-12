using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class CompletedReferralReportDto
    {
        public int Id { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public string SchoolYear { get; set; }
        public string SchoolDistrict { get; set; }
        public string ProviderFirstName { get; set; }
        public string ProviderLastName { get; set; }
        public int ServiceAreaId { get; set; }
        public string ServiceArea { get; set; }
        public DateTime ReferralCompletedDate { get; set; }
        public DateTime? ReferralEffectiveDateTo { get; set; }
        public DateTime? ReferralEffectiveDateFrom { get; set; }
    }
}
