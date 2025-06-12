using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public record class EncounterResponseDto
    {
        public string StudentName { get; set; }
        public string StudentCode { get; set; }
        public int StudentId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int EncounterStudentId { get; set; }
        public string EncounterNumber { get; set; }
        public IEnumerable<string> ClaimIds { get; set; }
        public int NumStudentsInEncounter { get; set; }
        public int NumNonIEPStudents { get; set; }
        public string SchoolDistrict { get; set; }
        public string CurrentStatus { get; set; }
        public int CurrentStatusId { get; set; }
        public bool HPCAdminStatusOnly { get; set; }
        public string ProviderName { get; set; }
        public string ProviderLicenseNumber { get; set; }
        public string ServiceArea { get; set; }
        public string ServiceType { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime EncounterDate { get; set; }
        public IEnumerable<CptCodeWithMinutesDto> CptCodes { get; set; }
        public IEnumerable<Method> Methods { get; set; }
        public IEnumerable<Goal> Goals { get; set; }
        public string TreatmentNotes { get; set; }
        public string AbandonmentNotes { get; set; }
        public string MedicaidNo { get; set; }
        public string SupervisorComments { get; set; }
        public string ReasonForService { get; set; }
        public IEnumerable<EncounterStudentStatusesLogDto> EncounterStudentStatuses { get; set; }
        public string ReasonForReturn { get; set; }
        public string ProviderTitle { get; set; }
        public bool IsTelehealth { get; set; }
        public DateTime? DateESigned { get; set; }
        public string Location { get; set; }

        public DateTime? DateInvoiced {get; set; }

        public bool HasSupervisor {get; set; }
        public string SupervisorName {get; set;}
        public string SupervisorTitle {get; set;}
        public string SupervisorLicenseNumber {get; set;}
    }

    public class CptCodeWithMinutesDto
    {
        public CptCode CptCode { get; set; }
        public int Minutes { get; set; } = 0;
    }
}
