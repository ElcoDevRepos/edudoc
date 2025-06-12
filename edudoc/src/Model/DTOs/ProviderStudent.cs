using System.Data.SqlClient;
using System.Data.SqlClient;

using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class ProviderCaseLoad
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string StudentCode { get; set; }
        public DateTime DateOfBirth { get; set; }
        public School School { get; set; }
        public SchoolDistrict SchoolDistrict { get; set; }
        public Esc ESC { get; set; }
        public IEnumerable<TherapyGroup> TherapyGroups{ get; set; }
        public bool HasIEP { get; set; }
        public IEnumerable<ProgressReport> ProgressReports{ get; set; }
        public IEnumerable<User> Assistants { get; set; }
        public User Supervisor { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public bool NeedsReferral { get; set; }
        public int? LatestReferralId { get; set; }
        public bool CanBeArchived { get; set; }
        public bool IsBillable { get; set; }
        public bool HasIncompleteProfile { get; set; }
    }
}
