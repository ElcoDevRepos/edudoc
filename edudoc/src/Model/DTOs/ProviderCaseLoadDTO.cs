using System.Data.SqlClient;
using System.Data.SqlClient;

using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class ProviderCaseLoadDTO
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string StudentCode { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string School { get; set; }
        public string SchoolDistrict { get; set; }
        public string ESC { get; set; }
        public IEnumerable<string> SortingName { get; set; }
        public IEnumerable<ProgressReport> ProgressReports { get; set; }
        public IEnumerable<User> Assistants { get; set; }
        public string Supervisor { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public bool NeedsReferral { get; set; }
        public int LatestReferralId { get; set; }
        public bool CanBeArchived { get; set; }
        public bool IsBillable { get; set; }
        public bool HasIncompleteProfile { get; set; }
        public bool IsAssistantCaseload { get; set; }
        public IEnumerable<ESignatureContent> ReferralSignature { get; set; }
    }
}
