using System;
using CsvHelper.Configuration.Attributes;
using Newtonsoft.Json;

namespace Model.DataImport
{
    /// <summary>
    /// Represents a student record from a SNAP EMR Student.txt file
    /// </summary>
    public class SnapStudent
    {
        [Name("StudentId")]
        public string StudentId { get; set; }

        [Name("StudentLocalId")]
        public string StudentLocalId { get; set; }

        [Name("StudentStateId")]
        public string StudentStateId { get; set; }

        [Name("LastName")]
        public string LastName { get; set; }

        [Name("FirstName")]
        public string FirstName { get; set; }

        [Name("MiddleName")]
        public string MiddleName { get; set; }

        [Name("GenderCode")]
        public string GenderCode { get; set; }

        [Name("DateOfBirth")]
        public string DateOfBirth { get; set; }

        [Name("MedicaidNumber")]
        public string MedicaidNumber { get; set; }

        [Name("ParentAuthorization")]
        public string ParentAuthorization { get; set; }

        [Name("AddressLine1")]
        public string AddressLine1 { get; set; }

        [Name("AddressLine2")]
        public string AddressLine2 { get; set; }

        [Name("City")]
        public string City { get; set; }

        [Name("State")]
        public string State { get; set; }

        [Name("ZipCode")]
        public string ZipCode { get; set; }

        [Name("HomePhone")]
        public string HomePhone { get; set; }
    }

    /// <summary>
    /// Represents a service log record from a SNAP EMR ServiceLog.txt file
    /// </summary>
    public class SnapServiceLog
    {
        [Name("ServiceLogId")]
        public string ServiceLogId { get; set; }

        [Name("ProviderFirstName")]
        public string ProviderFirstName { get; set; }

        [Name("ProviderLastName")]
        public string ProviderLastName { get; set; }

        [Name("ProviderId")]
        public string ProviderId { get; set; }

        [Name("School")]
        public string School { get; set; }

        [Name("StudentId")]
        public string StudentId { get; set; }

        [Name("LogDate")]
        public string LogDate { get; set; }

        [Name("EntryDescription")]
        public string EntryDescription { get; set; }

        [Name("EntryComments")]
        public string EntryComments { get; set; }

        [Name("TimeIn")]
        public string TimeIn { get; set; }

        [Name("TimeOut")]
        public string TimeOut { get; set; }

        [Name("DirectTime")]
        public string DirectTime { get; set; }

        [Name("DiagnosisCode1")]
        public string DiagnosisCode1 { get; set; }

        [Name("DiagnosisCode2")]
        public string DiagnosisCode2 { get; set; }

        [Name("PlaceOfServiceCode")]
        public string PlaceOfServiceCode { get; set; }

        [Name("ProcedureCode")]
        public string ProcedureCode { get; set; }
    }

    /// <summary>
    /// Represents a row in the encounter import CSV file
    /// </summary>
    public class EncounterImportRow : ImportRow
    {
        // Integration information
        [Name("ImportSource")]
        [Optional]
        public string ImportSource { get; set; }

        // District and School information
        [Name("DistrictId")]
        [Optional]
        public string DistrictId { get; set; }

        [Name("DistrictName")]
        [Optional]
        public string DistrictName { get; set; }

        [Name("DistrictCode")]
        [Optional]
        public string DistrictCode { get; set; }

        [Name("SchoolId")]
        [Optional]
        public string SchoolId { get; set; }

        [Name("SchoolName")]
        [Optional]
        public string SchoolName { get; set; }

        // Provider information
        [Name("ProviderId")]
        [Optional]
        public string ProviderId { get; set; }

        [Name("ProviderNPI")]
        [Optional]
        public string ProviderNPI { get; set; }

        [Name("ProviderFirstName")]
        [Optional]
        public string ProviderFirstName { get; set; }

        [Name("ProviderLastName")]
        [Optional]
        public string ProviderLastName { get; set; }

        // Student information
        [Name("StudentId")]
        [Optional]
        public string StudentId { get; set; }

        [Name("StudentCode")]
        [Optional]
        public string StudentCode { get; set; }

        [Name("StudentFirstName")]
        [Optional]
        public string StudentFirstName { get; set; }

        [Name("StudentMiddleName")]
        [Optional]
        public string StudentMiddleName { get; set; }

        [Name("StudentLastName")]
        [Optional]
        public string StudentLastName { get; set; }

        [Name("StudentDateOfBirth")]
        [Optional]
        public string StudentDateOfBirth { get; set; }

        [Name("StudentGrade")]
        [Optional]
        public string StudentGrade { get; set; }

        [Name("StudentMedicaidNo")]
        [Optional]
        public string StudentMedicaidNo { get; set; }

        [Name("StudentNotes")]
        [Optional]
        public string StudentNotes { get; set; }

        [Name("StudentAddressLine1")]
        [Optional]
        public string StudentAddressLine1 { get; set; }

        [Name("StudentAddressLine2")]
        [Optional]
        public string StudentAddressLine2 { get; set; }

        [Name("StudentCity")]
        [Optional]
        public string StudentCity { get; set; }

        [Name("StudentState")]
        [Optional]
        public string StudentState { get; set; }

        [Name("StudentZip")]
        [Optional]
        public string StudentZip { get; set; }

        [Name("StudentEnrollmentDate")]
        [Optional]
        public string StudentEnrollmentDate { get; set; }

        [Name("StudentTypeId")]
        [Optional]
        public string StudentTypeId { get; set; }

        [Name("StudentTypeName")]
        [Optional]
        public string StudentTypeName { get; set; }

        // Case Load information
        [Name("ServiceCodeId")]
        [Optional]
        public string ServiceCodeId { get; set; }

        [Name("ServiceCodeName")]
        [Optional]
        public string ServiceCodeName { get; set; }

        [Name("CaseLoadDiagnosisCode")]
        [Optional]
        public string CaseLoadDiagnosisCode { get; set; }

        [Name("IEPStartDate")]
        [Optional]
        public string IEPStartDate { get; set; }

        [Name("IEPEndDate")]
        [Optional]
        public string IEPEndDate { get; set; }

        // Prescription/Script information
        [Name("DoctorFirstName")]
        [Optional]
        public string DoctorFirstName { get; set; }

        [Name("DoctorLastName")]
        [Optional]
        public string DoctorLastName { get; set; }

        [Name("DoctorNPI")]
        [Optional]
        public string DoctorNPI { get; set; }

        [Name("PrescriptionInitiationDate")]
        [Optional]
        public string PrescriptionInitiationDate { get; set; }

        [Name("PrescriptionExpirationDate")]
        [Optional]
        public string PrescriptionExpirationDate { get; set; }

        [Name("CaseLoadScriptDiagnosisCode")]
        [Optional]
        public string CaseLoadScriptDiagnosisCode { get; set; }

        // Encounter data
        [Name("EncounterDate")]
        [Optional]
        public string EncounterDate { get; set; }

        [Name("EncounterStartTime")]
        [Optional]
        public string EncounterStartTime { get; set; }

        [Name("EncounterEndTime")]
        [Optional]
        public string EncounterEndTime { get; set; }

        [Name("ServiceTypeId")]
        [Optional]
        public string ServiceTypeId { get; set; }

        [Name("EvaluationTypeId")]
        [Optional]
        public string EvaluationTypeId { get; set; }

        [Name("EncounterDiagnosisCode")]
        [Optional]
        public string EncounterDiagnosisCode { get; set; }

        [Name("IsGroup")]
        [Optional]
        public string IsGroup { get; set; }

        [Name("AdditionalStudents")]
        [Optional]
        public string AdditionalStudents { get; set; }

        // EncounterStudent data
        [Name("EncounterLocation")]
        [Optional]
        public string EncounterLocation { get; set; }

        [Name("StudentStartTime")]
        [Optional]
        public string StudentStartTime { get; set; }

        [Name("StudentEndTime")]
        [Optional]
        public string StudentEndTime { get; set; }

        [Name("EncounterStudentDate")]
        [Optional]
        public string EncounterStudentDate { get; set; }

        [Name("EncounterStudentDiagnosisCode")]
        [Optional]
        public string EncounterStudentDiagnosisCode { get; set; }

        [Name("CPTCode")]
        [Optional]
        public string CPTCode { get; set; }

        [Name("TherapyCaseNotes")]
        [Optional]
        public string TherapyCaseNotes { get; set; }

        [Name("SupervisorComments")]
        [Optional]
        public string SupervisorComments { get; set; }

        [Name("IsTelehealth")]
        [Optional]
        public string IsTelehealth { get; set; }
    }

    public class ImportRow
    {
        [Name("ValidationErrors")]
        [Optional]
        public string ValidationErrors { get; set; }
    }

    /// <summary>
    /// Represents a service record from MST (Medical Service Technology)
    /// </summary>
    public class MstService
    {
        public string Cpt1 { get; set; }
        public string Cpt1Duration { get; set; }
        public string Cpt2 { get; set; }
        public string Cpt2Duration { get; set; }
        public string Cpt3 { get; set; }
        public string Cpt3Duration { get; set; }
        public string District { get; set; }
        public string GroupNumber { get; set; }
        public string Icd10 { get; set; }
        public string Location { get; set; }
        [JsonProperty("ProviderMSTKey")]
        public string ProviderMstKey { get; set; }
        [JsonProperty("ProviderNPI")]
        public string ProviderNpi { get; set; }
        public string ProviderFirstName { get; set; }
        public string ProviderLastName { get; set; }
        public string ProviderTitle { get; set; }
        public string ReferralDate { get; set; }
        [JsonProperty("ReferralTherapistNPI")]
        public string ReferralTherapistNpi { get; set; }
        public string ReferralTherapistFirstName { get; set; }
        public string ReferralTherapistLastName { get; set; }
        public string ServiceDate { get; set; }
        public string ServiceType { get; set; }
        public string SessionEnd { get; set; }
        [JsonProperty("SessionMSTKey")]
        public string SessionMstKey { get; set; }
        public string SessionStart { get; set; }
        public string StudentDob { get; set; }
        public string StudentId { get; set; }
        [JsonProperty("StudentMSTKey")]
        public string StudentMstKey { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        [JsonProperty("TherapistSuperMSTKey")]
        public string TherapistSuperMstKey { get; set; }
        [JsonProperty("TherapistSuperNPI")]
        public string TherapistSuperNpi { get; set; }
        public string TherapistSuperFirstName { get; set; }
        public string TherapistSuperLastName { get; set; }
    }
} 