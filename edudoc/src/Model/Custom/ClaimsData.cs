using System.Data.SqlClient;
using System.Data.SqlClient;

using System;
using System.Collections.Generic;

namespace Model.Custom
{
    public class EncounterClaimsData
    {
        public int EncounterStudentId { get; set; }
        public bool IsTreatment { get; set; }
        public bool IsTelehealth { get; set; }
        public DateTime EncounterDate { get; set; }
        public int ServiceCodeId { get; set; }
        public int ProviderId { get; set; }
        public string ProviderFirstName { get; set; }
        public string ProviderLastName { get; set; }
        public string StudentFirstName { get; set; }
        public int StudentId { get; set; }
        public string StudentLastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string ProviderNPI { get; set; }
        public bool VerifiedOrp { get; set; }
        public DateTime? OrpApprovalDate { get; set; }
        public int DistrictId { get; set; }
        public int? ESignedById { get; set; }
        public int? SupervisorESignedById { get; set; }
        public string SupervisorESignatureText { get; set; }
        public string CaseLoadDiagnosisCode { get; set; }
        public string EncounterDiagnosisCode { get; set; }
        public Address Address { get; set; }
        public string MedicaidNo { get; set; }
        public IList<StudentParentalConsent> ParentalConsents { get; set; }
        public bool HasReferral { get; set; }
        public IList<ClaimsScriptData> Scripts { get; set; }
        public IList<ClaimsData> Claims { get; set; }
    }

    public class ClaimsData
    {
        public int Id { get; set; }
        public bool Archived { get; set; }
        public int Minutes { get; set; }
        public CptCode CptCode { get; set; }
        public CptCode CrossoverCptCode { get; set; }
        public ServiceUnitRule ServiceUnitRule { get; set; }
        public IList<ServiceUnitTimeSegment> ServiceUnitTimeSegments { get; set; }
    }

    public class ClaimsDataMaster
    {
        public ClaimsData Claim { get; set; }
        public DateTime EncounterDate { get; set; }
        public int ProviderId { get; set; }
        public int EncounterStudentId { get; set; }
        public bool IsTreatment { get; set; }
        public bool IsTelehealth { get; set; }
        public int ServiceCodeId { get; set; }
        public string ProviderFirstName { get; set; }
        public string ProviderLastName { get; set; }
        public string ProviderNPI { get; set; }
        public string CaseLoadDiagnosisCode { get; set; }
        public string EncounterDiagnosisCode { get; set; }
        public IList<ClaimsScriptData> Scripts { get; set; }
    }

    public class EncounterClaimsDataDTO
    {
        public int EncounterStudentId { get; set; }
        public bool IsTreatment { get; set; }
        public bool IsTelehealth { get; set; }
        public DateTime EncounterDate { get; set; }
        public int ServiceCodeId { get; set; }
        public int ProviderId { get; set; }
        public Provider ReferringProvider { get; set; }
        public User ReferringProviderUser { get; set; }
        public string StudentFirstName { get; set; }
        public int StudentId { get; set; }
        public string StudentLastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int DistrictId { get; set; }
        public int? ESignedById { get; set; }
        public int? SupervisorESignedById { get; set; }
        public string SupervisorESignatureText { get; set; }
        public string CaseLoadDiagnosisCode { get; set; }
        public string EncounterDiagnosisCode { get; set; }
        public Address Address { get; set; }
        public string MedicaidNo { get; set; }
        public IList<StudentParentalConsent> ParentalConsents { get; set; }
        public bool HasReferral { get; set; }
        public IList<ClaimsScriptData> Scripts { get; set; }
        public IList<ClaimsData> Claims { get; set; }
    }
    
    public class ClaimsScriptData 
    {
        public int ScriptId { get; set; }
        public string DiagnosisCode { get; set; }
        public string DoctorFirstName { get; set; }
        public string DoctorLastName { get; set; }
        public string Npi { get; set; }
    }
}
