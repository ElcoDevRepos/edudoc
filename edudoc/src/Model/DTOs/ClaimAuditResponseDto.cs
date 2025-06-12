using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class ClaimAuditResponseDto
    {
        public string StudentName { get; set; }
        public DateTime DateSigned { get; set; }
        public int EncounterId { get; set; }
        public string EncounterNumber { get; set; }
        public string SchoolDistrict { get; set; }
        public string CurrentStatus { get; set; }
        public int CurrentStatusId { get; set; }
        public string ProviderName { get; set; }
        public string ServiceArea { get; set; }
        public int ServiceAreaId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime EncounterDate { get; set; }
        public int NumStudentsInEncounter { get; set; }
        public IEnumerable<CptCode> CptCodes { get; set; }
        public IEnumerable<Goal> Goals { get; set; }
        public string TreatmentNotes { get; set; }
        public string ReasonForAudit { get; set; }
        public string MedicaidNo { get; set; }
        public StudentParentalConsent CurrentParentalConsent { get; set; }
        public bool NeedsReferral { get; set; }
        public ICollection<SupervisorProviderStudentReferalSignOff> ReferralSignOffs { get; set; }
        public IEnumerable<EncounterStudentStatusesLogDto> EncounterStudentStatuses { get; set; }

    }
}
