using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Provider
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int ProviderUserId { get; set; }

    public int TitleId { get; set; }

    public bool VerifiedOrp { get; set; }

    public DateTime? OrpapprovalRequestDate { get; set; }

    public DateTime? OrpapprovalDate { get; set; }

    public DateTime? OrpdenialDate { get; set; }

    public string? Npi { get; set; }

    public string? Phone { get; set; }

    public int ProviderEmploymentTypeId { get; set; }

    public string? Notes { get; set; }

    public DateTime? DocumentationDate { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public string? BlockedReason { get; set; }

    public int? DoNotBillReasonId { get; set; }

    public virtual ICollection<ActivitySummaryProvider> ActivitySummaryProviders { get; set; } = new List<ActivitySummaryProvider>();

    public virtual ICollection<BillingScheduleExcludedProvider> BillingScheduleExcludedProviders { get; set; } = new List<BillingScheduleExcludedProvider>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ProviderDoNotBillReason? DoNotBillReason { get; set; }

    public virtual ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();

    public virtual ICollection<MessageDocument> MessageDocuments { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageLink> MessageLinks { get; set; } = new List<MessageLink>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<MigrationProviderCaseNotesHistory> MigrationProviderCaseNotesHistories { get; set; } = new List<MigrationProviderCaseNotesHistory>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<PendingReferral> PendingReferrals { get; set; } = new List<PendingReferral>();

    public virtual ICollection<ProviderAcknowledgmentLog> ProviderAcknowledgmentLogs { get; set; } = new List<ProviderAcknowledgmentLog>();

    public virtual ICollection<ProviderCaseUpload> ProviderCaseUploads { get; set; } = new List<ProviderCaseUpload>();

    public virtual ProviderEmploymentType ProviderEmploymentType { get; set; } = null!;

    public virtual ICollection<ProviderEscAssignment> ProviderEscAssignments { get; set; } = new List<ProviderEscAssignment>();

    public virtual ICollection<ProviderInactivityDate> ProviderInactivityDates { get; set; } = new List<ProviderInactivityDate>();

    public virtual ICollection<ProviderLicense> ProviderLicenses { get; set; } = new List<ProviderLicense>();

    public virtual ICollection<ProviderOdecertification> ProviderOdecertifications { get; set; } = new List<ProviderOdecertification>();

    public virtual ICollection<ProviderStudentHistory> ProviderStudentHistories { get; set; } = new List<ProviderStudentHistory>();

    public virtual ICollection<ProviderStudentSupervisor> ProviderStudentSupervisorAssistants { get; set; } = new List<ProviderStudentSupervisor>();

    public virtual ICollection<ProviderStudentSupervisor> ProviderStudentSupervisorSupervisors { get; set; } = new List<ProviderStudentSupervisor>();

    public virtual ICollection<ProviderStudent> ProviderStudents { get; set; } = new List<ProviderStudent>();

    public virtual ICollection<ProviderTraining> ProviderTrainings { get; set; } = new List<ProviderTraining>();

    public virtual User ProviderUser { get; set; } = null!;

    public virtual ICollection<RevokeAccess> RevokeAccesses { get; set; } = new List<RevokeAccess>();

    public virtual ICollection<StudentTherapy> StudentTherapies { get; set; } = new List<StudentTherapy>();

    public virtual ICollection<SupervisorProviderStudentReferalSignOff> SupervisorProviderStudentReferalSignOffs { get; set; } = new List<SupervisorProviderStudentReferalSignOff>();

    public virtual ICollection<TherapyCaseNote> TherapyCaseNotes { get; set; } = new List<TherapyCaseNote>();

    public virtual ICollection<TherapyGroup> TherapyGroups { get; set; } = new List<TherapyGroup>();

    public virtual ProviderTitle Title { get; set; } = null!;
}
