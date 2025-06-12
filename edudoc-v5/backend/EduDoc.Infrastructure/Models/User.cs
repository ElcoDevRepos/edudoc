using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class User
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int AuthUserId { get; set; }

    public int? ImageId { get; set; }

    public int? AddressId { get; set; }

    public int? SchoolDistrictId { get; set; }

    public byte[] Version { get; set; } = null!;

    public int? CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual ICollection<ActivitySummary> ActivitySummaries { get; set; } = new List<ActivitySummary>();

    public virtual ICollection<ActivitySummaryDistrict> ActivitySummaryDistricts { get; set; } = new List<ActivitySummaryDistrict>();

    public virtual ICollection<ActivitySummaryProvider> ActivitySummaryProviders { get; set; } = new List<ActivitySummaryProvider>();

    public virtual ICollection<ActivitySummaryServiceArea> ActivitySummaryServiceAreas { get; set; } = new List<ActivitySummaryServiceArea>();

    public virtual Address? Address { get; set; }

    public virtual ICollection<AdminSchoolDistrict> AdminSchoolDistrictAdmins { get; set; } = new List<AdminSchoolDistrict>();

    public virtual ICollection<AdminSchoolDistrict> AdminSchoolDistrictCreatedBies { get; set; } = new List<AdminSchoolDistrict>();

    public virtual ICollection<AdminSchoolDistrict> AdminSchoolDistrictModifiedBies { get; set; } = new List<AdminSchoolDistrict>();

    public virtual AuthUser AuthUser { get; set; } = null!;

    public virtual ICollection<BillingFailure> BillingFailures { get; set; } = new List<BillingFailure>();

    public virtual ICollection<BillingFile> BillingFiles { get; set; } = new List<BillingFile>();

    public virtual ICollection<BillingResponseFile> BillingResponseFiles { get; set; } = new List<BillingResponseFile>();

    public virtual ICollection<BillingScheduleAdminNotification> BillingScheduleAdminNotificationAdmins { get; set; } = new List<BillingScheduleAdminNotification>();

    public virtual ICollection<BillingScheduleAdminNotification> BillingScheduleAdminNotificationCreatedBies { get; set; } = new List<BillingScheduleAdminNotification>();

    public virtual ICollection<BillingSchedule> BillingScheduleCreatedBies { get; set; } = new List<BillingSchedule>();

    public virtual ICollection<BillingScheduleDistrict> BillingScheduleDistricts { get; set; } = new List<BillingScheduleDistrict>();

    public virtual ICollection<BillingScheduleExcludedCptCode> BillingScheduleExcludedCptCodes { get; set; } = new List<BillingScheduleExcludedCptCode>();

    public virtual ICollection<BillingScheduleExcludedProvider> BillingScheduleExcludedProviders { get; set; } = new List<BillingScheduleExcludedProvider>();

    public virtual ICollection<BillingScheduleExcludedServiceCode> BillingScheduleExcludedServiceCodes { get; set; } = new List<BillingScheduleExcludedServiceCode>();

    public virtual ICollection<BillingSchedule> BillingScheduleModifiedBies { get; set; } = new List<BillingSchedule>();

    public virtual ICollection<CaseLoadCptCode> CaseLoadCptCodeCreatedBies { get; set; } = new List<CaseLoadCptCode>();

    public virtual ICollection<CaseLoadCptCode> CaseLoadCptCodeModifiedBies { get; set; } = new List<CaseLoadCptCode>();

    public virtual ICollection<CaseLoad> CaseLoadCreatedBies { get; set; } = new List<CaseLoad>();

    public virtual ICollection<CaseLoadGoal> CaseLoadGoalCreatedBies { get; set; } = new List<CaseLoadGoal>();

    public virtual ICollection<CaseLoadGoal> CaseLoadGoalModifiedBies { get; set; } = new List<CaseLoadGoal>();

    public virtual ICollection<CaseLoadMethod> CaseLoadMethodCreatedBies { get; set; } = new List<CaseLoadMethod>();

    public virtual ICollection<CaseLoadMethod> CaseLoadMethodModifiedBies { get; set; } = new List<CaseLoadMethod>();

    public virtual ICollection<CaseLoad> CaseLoadModifiedBies { get; set; } = new List<CaseLoad>();

    public virtual ICollection<CaseLoadScriptGoal> CaseLoadScriptGoalCreatedBies { get; set; } = new List<CaseLoadScriptGoal>();

    public virtual ICollection<CaseLoadScriptGoal> CaseLoadScriptGoalModifiedBies { get; set; } = new List<CaseLoadScriptGoal>();

    public virtual ICollection<CaseLoadScript> CaseLoadScriptModifiedBies { get; set; } = new List<CaseLoadScript>();

    public virtual ICollection<CaseLoadScript> CaseLoadScriptUploadedBies { get; set; } = new List<CaseLoadScript>();

    public virtual ICollection<Contact> ContactCreatedBies { get; set; } = new List<Contact>();

    public virtual ICollection<Contact> ContactModifiedBies { get; set; } = new List<Contact>();

    public virtual ICollection<CptcodeAssocation> CptcodeAssocationCreatedBies { get; set; } = new List<CptcodeAssocation>();

    public virtual ICollection<CptcodeAssocation> CptcodeAssocationModifiedBies { get; set; } = new List<CptcodeAssocation>();

    public virtual ICollection<Cptcode> CptcodeCreatedBies { get; set; } = new List<Cptcode>();

    public virtual ICollection<Cptcode> CptcodeModifiedBies { get; set; } = new List<Cptcode>();

    public virtual User? CreatedBy { get; set; }

    public virtual ICollection<DiagnosisCodeAssociation> DiagnosisCodeAssociationCreatedBies { get; set; } = new List<DiagnosisCodeAssociation>();

    public virtual ICollection<DiagnosisCodeAssociation> DiagnosisCodeAssociationModifiedBies { get; set; } = new List<DiagnosisCodeAssociation>();

    public virtual ICollection<DiagnosisCode> DiagnosisCodeCreatedBies { get; set; } = new List<DiagnosisCode>();

    public virtual ICollection<DiagnosisCode> DiagnosisCodeModifiedBies { get; set; } = new List<DiagnosisCode>();

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

    public virtual ICollection<EdiErrorCodeAdminNotification> EdiErrorCodeAdminNotifications { get; set; } = new List<EdiErrorCodeAdminNotification>();

    public virtual ICollection<EdiErrorCode> EdiErrorCodeCreatedBies { get; set; } = new List<EdiErrorCode>();

    public virtual ICollection<EdiErrorCode> EdiErrorCodeModifiedBies { get; set; } = new List<EdiErrorCode>();

    public virtual ICollection<Encounter> EncounterCreatedBies { get; set; } = new List<Encounter>();

    public virtual ICollection<Encounter> EncounterModifiedBies { get; set; } = new List<Encounter>();

    public virtual ICollection<EncounterReasonForReturn> EncounterReasonForReturnCreatedBies { get; set; } = new List<EncounterReasonForReturn>();

    public virtual ICollection<EncounterReasonForReturn> EncounterReasonForReturnHpcUsers { get; set; } = new List<EncounterReasonForReturn>();

    public virtual ICollection<EncounterReasonForReturn> EncounterReasonForReturnModifiedBies { get; set; } = new List<EncounterReasonForReturn>();

    public virtual ICollection<EncounterStudentCptCode> EncounterStudentCptCodeCreatedBies { get; set; } = new List<EncounterStudentCptCode>();

    public virtual ICollection<EncounterStudentCptCode> EncounterStudentCptCodeModifiedBies { get; set; } = new List<EncounterStudentCptCode>();

    public virtual ICollection<EncounterStudent> EncounterStudentCreatedBies { get; set; } = new List<EncounterStudent>();

    public virtual ICollection<EncounterStudent> EncounterStudentEsignedBies { get; set; } = new List<EncounterStudent>();

    public virtual ICollection<EncounterStudentGoal> EncounterStudentGoalCreatedBies { get; set; } = new List<EncounterStudentGoal>();

    public virtual ICollection<EncounterStudentGoal> EncounterStudentGoalModifiedBies { get; set; } = new List<EncounterStudentGoal>();

    public virtual ICollection<EncounterStudentMethod> EncounterStudentMethodCreatedBies { get; set; } = new List<EncounterStudentMethod>();

    public virtual ICollection<EncounterStudentMethod> EncounterStudentMethodModifiedBies { get; set; } = new List<EncounterStudentMethod>();

    public virtual ICollection<EncounterStudent> EncounterStudentModifiedBies { get; set; } = new List<EncounterStudent>();

    public virtual ICollection<EncounterStudentStatus> EncounterStudentStatuses { get; set; } = new List<EncounterStudentStatus>();

    public virtual ICollection<EncounterStudent> EncounterStudentSupervisorEsignedBies { get; set; } = new List<EncounterStudent>();

    public virtual ICollection<Esc> EscCreatedBies { get; set; } = new List<Esc>();

    public virtual ICollection<Esc> EscModifiedBies { get; set; } = new List<Esc>();

    public virtual ICollection<EscSchoolDistrict> EscSchoolDistrictCreatedBies { get; set; } = new List<EscSchoolDistrict>();

    public virtual ICollection<EscSchoolDistrict> EscSchoolDistrictModifiedBies { get; set; } = new List<EscSchoolDistrict>();

    public virtual ICollection<EvaluationTypesDiagnosisCode> EvaluationTypesDiagnosisCodeCreatedBies { get; set; } = new List<EvaluationTypesDiagnosisCode>();

    public virtual ICollection<EvaluationTypesDiagnosisCode> EvaluationTypesDiagnosisCodeModifiedBies { get; set; } = new List<EvaluationTypesDiagnosisCode>();

    public virtual ICollection<Goal> GoalCreatedBies { get; set; } = new List<Goal>();

    public virtual ICollection<Goal> GoalModifiedBies { get; set; } = new List<Goal>();

    public virtual ICollection<Iepservice> IepserviceCreatedBies { get; set; } = new List<Iepservice>();

    public virtual ICollection<Iepservice> IepserviceModifiedBies { get; set; } = new List<Iepservice>();

    public virtual Image? Image { get; set; }

    public virtual ICollection<ImpersonationLog> ImpersonationLogs { get; set; } = new List<ImpersonationLog>();

    public virtual ICollection<User> InverseCreatedBy { get; set; } = new List<User>();

    public virtual ICollection<User> InverseModifiedBy { get; set; } = new List<User>();

    public virtual ICollection<JobsAudit> JobsAudits { get; set; } = new List<JobsAudit>();

    public virtual ICollection<MergedStudent> MergedStudents { get; set; } = new List<MergedStudent>();

    public virtual ICollection<Message> MessageCreatedBies { get; set; } = new List<Message>();

    public virtual ICollection<MessageDocument> MessageDocumentCreatedBies { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageDocument> MessageDocumentModifiedBies { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageLink> MessageLinkCreatedBies { get; set; } = new List<MessageLink>();

    public virtual ICollection<MessageLink> MessageLinkModifiedBies { get; set; } = new List<MessageLink>();

    public virtual ICollection<Message> MessageModifiedBies { get; set; } = new List<Message>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<PendingReferralReportJobRun> PendingReferralReportJobRuns { get; set; } = new List<PendingReferralReportJobRun>();

    public virtual ICollection<ProgressReport> ProgressReportCreatedBies { get; set; } = new List<ProgressReport>();

    public virtual ICollection<ProgressReport> ProgressReportEsignedBies { get; set; } = new List<ProgressReport>();

    public virtual ICollection<ProgressReport> ProgressReportModifiedBies { get; set; } = new List<ProgressReport>();

    public virtual ICollection<ProgressReport> ProgressReportSupervisorEsignedBies { get; set; } = new List<ProgressReport>();

    public virtual ICollection<ProviderCaseUploadDocument> ProviderCaseUploadDocuments { get; set; } = new List<ProviderCaseUploadDocument>();

    public virtual ICollection<ProviderCaseUpload> ProviderCaseUploads { get; set; } = new List<ProviderCaseUpload>();

    public virtual ICollection<Provider> ProviderCreatedBies { get; set; } = new List<Provider>();

    public virtual ICollection<ProviderEscAssignment> ProviderEscAssignmentCreatedBies { get; set; } = new List<ProviderEscAssignment>();

    public virtual ICollection<ProviderEscAssignment> ProviderEscAssignmentModifiedBies { get; set; } = new List<ProviderEscAssignment>();

    public virtual ICollection<ProviderLicense> ProviderLicenses { get; set; } = new List<ProviderLicense>();

    public virtual ICollection<Provider> ProviderModifiedBies { get; set; } = new List<Provider>();

    public virtual ICollection<ProviderOdecertification> ProviderOdecertifications { get; set; } = new List<ProviderOdecertification>();

    public virtual ICollection<Provider> ProviderProviderUsers { get; set; } = new List<Provider>();

    public virtual ICollection<ProviderStudentSupervisor> ProviderStudentSupervisorCreatedBies { get; set; } = new List<ProviderStudentSupervisor>();

    public virtual ICollection<ProviderStudentSupervisor> ProviderStudentSupervisorModifiedBies { get; set; } = new List<ProviderStudentSupervisor>();

    public virtual ICollection<ProviderStudent> ProviderStudents { get; set; } = new List<ProviderStudent>();

    public virtual ICollection<ProviderTitle> ProviderTitleCreatedBies { get; set; } = new List<ProviderTitle>();

    public virtual ICollection<ProviderTitle> ProviderTitleModifiedBies { get; set; } = new List<ProviderTitle>();

    public virtual ICollection<ProviderTraining> ProviderTrainings { get; set; } = new List<ProviderTraining>();

    public virtual ICollection<ReadMessage> ReadMessages { get; set; } = new List<ReadMessage>();

    public virtual ICollection<RosterValidationFile> RosterValidationFiles { get; set; } = new List<RosterValidationFile>();

    public virtual ICollection<RosterValidationResponseFile> RosterValidationResponseFiles { get; set; } = new List<RosterValidationResponseFile>();

    public virtual ICollection<School> SchoolCreatedBies { get; set; } = new List<School>();

    public virtual SchoolDistrict? SchoolDistrict { get; set; }

    public virtual ICollection<SchoolDistrict> SchoolDistrictAccountAssistants { get; set; } = new List<SchoolDistrict>();

    public virtual ICollection<SchoolDistrict> SchoolDistrictAccountManagers { get; set; } = new List<SchoolDistrict>();

    public virtual ICollection<SchoolDistrict> SchoolDistrictCreatedBies { get; set; } = new List<SchoolDistrict>();

    public virtual ICollection<SchoolDistrict> SchoolDistrictModifiedBies { get; set; } = new List<SchoolDistrict>();

    public virtual ICollection<SchoolDistrictRosterDocument> SchoolDistrictRosterDocuments { get; set; } = new List<SchoolDistrictRosterDocument>();

    public virtual ICollection<SchoolDistrictRoster> SchoolDistrictRosters { get; set; } = new List<SchoolDistrictRoster>();

    public virtual ICollection<SchoolDistrictsAccountAssistant> SchoolDistrictsAccountAssistants { get; set; } = new List<SchoolDistrictsAccountAssistant>();

    public virtual ICollection<SchoolDistrictsFinancialRep> SchoolDistrictsFinancialReps { get; set; } = new List<SchoolDistrictsFinancialRep>();

    public virtual ICollection<SchoolDistrictsSchool> SchoolDistrictsSchoolCreatedBies { get; set; } = new List<SchoolDistrictsSchool>();

    public virtual ICollection<SchoolDistrictsSchool> SchoolDistrictsSchoolModifiedBies { get; set; } = new List<SchoolDistrictsSchool>();

    public virtual ICollection<School> SchoolModifiedBies { get; set; } = new List<School>();

    public virtual ICollection<ServiceOutcome> ServiceOutcomeCreatedBies { get; set; } = new List<ServiceOutcome>();

    public virtual ICollection<ServiceOutcome> ServiceOutcomeModifiedBies { get; set; } = new List<ServiceOutcome>();

    public virtual ICollection<ServiceUnitRule> ServiceUnitRuleCreatedBies { get; set; } = new List<ServiceUnitRule>();

    public virtual ICollection<ServiceUnitRule> ServiceUnitRuleModifiedBies { get; set; } = new List<ServiceUnitRule>();

    public virtual ICollection<ServiceUnitTimeSegment> ServiceUnitTimeSegmentCreatedBies { get; set; } = new List<ServiceUnitTimeSegment>();

    public virtual ICollection<ServiceUnitTimeSegment> ServiceUnitTimeSegmentModifiedBies { get; set; } = new List<ServiceUnitTimeSegment>();

    public virtual ICollection<Student> StudentCreatedBies { get; set; } = new List<Student>();

    public virtual ICollection<StudentDisabilityCode> StudentDisabilityCodeCreatedBies { get; set; } = new List<StudentDisabilityCode>();

    public virtual ICollection<StudentDisabilityCode> StudentDisabilityCodeModifiedBies { get; set; } = new List<StudentDisabilityCode>();

    public virtual ICollection<StudentDistrictWithdrawal> StudentDistrictWithdrawalCreatedBies { get; set; } = new List<StudentDistrictWithdrawal>();

    public virtual ICollection<StudentDistrictWithdrawal> StudentDistrictWithdrawalModifiedBies { get; set; } = new List<StudentDistrictWithdrawal>();

    public virtual ICollection<Student> StudentModifiedBies { get; set; } = new List<Student>();

    public virtual ICollection<StudentParentalConsent> StudentParentalConsentCreatedBies { get; set; } = new List<StudentParentalConsent>();

    public virtual ICollection<StudentParentalConsent> StudentParentalConsentModifiedBies { get; set; } = new List<StudentParentalConsent>();

    public virtual ICollection<StudentTherapy> StudentTherapyCreatedBies { get; set; } = new List<StudentTherapy>();

    public virtual ICollection<StudentTherapy> StudentTherapyModifiedBies { get; set; } = new List<StudentTherapy>();

    public virtual ICollection<StudentTherapySchedule> StudentTherapyScheduleCreatedBies { get; set; } = new List<StudentTherapySchedule>();

    public virtual ICollection<StudentTherapySchedule> StudentTherapyScheduleModifiedBies { get; set; } = new List<StudentTherapySchedule>();

    public virtual ICollection<SupervisorProviderStudentReferalSignOff> SupervisorProviderStudentReferalSignOffCreatedBies { get; set; } = new List<SupervisorProviderStudentReferalSignOff>();

    public virtual ICollection<SupervisorProviderStudentReferalSignOff> SupervisorProviderStudentReferalSignOffModifiedBies { get; set; } = new List<SupervisorProviderStudentReferalSignOff>();

    public virtual ICollection<SupervisorProviderStudentReferalSignOff> SupervisorProviderStudentReferalSignOffSignedOffBies { get; set; } = new List<SupervisorProviderStudentReferalSignOff>();

    public virtual ICollection<TherapyCaseNote> TherapyCaseNotes { get; set; } = new List<TherapyCaseNote>();

    public virtual ICollection<TherapyGroup> TherapyGroupCreatedBies { get; set; } = new List<TherapyGroup>();

    public virtual ICollection<TherapyGroup> TherapyGroupModifiedBies { get; set; } = new List<TherapyGroup>();

    public virtual ICollection<UserPhone> UserPhones { get; set; } = new List<UserPhone>();

    public virtual ICollection<UserRole> UserRoleCreatedBies { get; set; } = new List<UserRole>();

    public virtual ICollection<UserRole> UserRoleModifiedBies { get; set; } = new List<UserRole>();

    public virtual ICollection<VoucherBillingResponseFile> VoucherBillingResponseFiles { get; set; } = new List<VoucherBillingResponseFile>();

    public virtual ICollection<SchoolDistrict> Districts { get; set; } = new List<SchoolDistrict>();

    public virtual ICollection<Document> DocumentsNavigation { get; set; } = new List<Document>();
}
