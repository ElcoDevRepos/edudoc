using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class PendingReferralProviderStudentData
    {
        public IEnumerable<PendingReferralEncountersByProviderData> PendingReferralsByProvider { get; set; }
    }
    public class PendingReferralStudentData
    {
        public int StudentId { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public int DistrictId { get; set; }
        public string DistrictCode { get; set; }
    }
    public class PendingReferralEncountersByProviderData
    {
        public int ServiceCodeId { get; set; }
        public int ProviderId { get; set; }
        public string ProviderFirstName { get; set; }
        public string ProviderLastName { get; set; }
        public int ProviderTitleId { get; set; }
        public string ProviderTitleName { get; set; }
        public bool HasReferral { get; set; }
        public int ServiceTypeId { get; set; }
        public string ServiceTypeName { get; set; }
        public PendingReferralStudentData Student { get; set; }
    }
}
