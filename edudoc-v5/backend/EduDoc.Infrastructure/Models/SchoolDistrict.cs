using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class SchoolDistrict
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string Einnumber { get; set; } = null!;

    public string Irnnumber { get; set; } = null!;

    public string Npinumber { get; set; } = null!;

    public string ProviderNumber { get; set; } = null!;

    public DateTime? BecameTradingPartnerDate { get; set; }

    public DateTime? BecameClientDate { get; set; }

    public DateTime? RevalidationDate { get; set; }

    public DateTime? ValidationExpirationDate { get; set; }

    public bool ProgressReports { get; set; }

    public DateTime? ProgressReportsSent { get; set; }

    public bool RequireNotesForAllEncountersSent { get; set; }

    public DateTime? NotesRequiredDate { get; set; }

    public string? Notes { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool UseDisabilityCodes { get; set; }

    public bool Archived { get; set; }

    public int? AddressId { get; set; }

    public int? AccountManagerId { get; set; }

    public int? AccountAssistantId { get; set; }

    public int? TreasurerId { get; set; }

    public int? SpecialEducationDirectorId { get; set; }

    public int? MerId { get; set; }

    public bool ActiveStatus { get; set; }

    public bool CaseNotesRequired { get; set; }

    public bool IepDatesRequired { get; set; }

    public virtual User? AccountAssistant { get; set; }

    public virtual User? AccountManager { get; set; }

    public virtual ICollection<ActivitySummaryDistrict> ActivitySummaryDistricts { get; set; } = new List<ActivitySummaryDistrict>();

    public virtual Address? Address { get; set; }

    public virtual ICollection<AdminSchoolDistrict> AdminSchoolDistricts { get; set; } = new List<AdminSchoolDistrict>();

    public virtual ICollection<AnnualEntry> AnnualEntries { get; set; } = new List<AnnualEntry>();

    public virtual ICollection<BillingScheduleDistrict> BillingScheduleDistricts { get; set; } = new List<BillingScheduleDistrict>();

    public virtual ICollection<ClaimsDistrict> ClaimsDistricts { get; set; } = new List<ClaimsDistrict>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<DistrictProgressReportDate> DistrictProgressReportDates { get; set; } = new List<DistrictProgressReportDate>();

    public virtual ICollection<EncounterIdentifier> EncounterIdentifiers { get; set; } = new List<EncounterIdentifier>();

    public virtual ICollection<EscSchoolDistrict> EscSchoolDistricts { get; set; } = new List<EscSchoolDistrict>();

    public virtual Document? Mer { get; set; }

    public virtual ICollection<MessageDocument> MessageDocuments { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageLink> MessageLinks { get; set; } = new List<MessageLink>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<PendingReferral> PendingReferrals { get; set; } = new List<PendingReferral>();

    public virtual ICollection<ProviderCaseUploadDocument> ProviderCaseUploadDocuments { get; set; } = new List<ProviderCaseUploadDocument>();

    public virtual ICollection<ProviderCaseUpload> ProviderCaseUploads { get; set; } = new List<ProviderCaseUpload>();

    public virtual ICollection<ProviderEscSchoolDistrict> ProviderEscSchoolDistricts { get; set; } = new List<ProviderEscSchoolDistrict>();

    public virtual ICollection<RosterValidationDistrict> RosterValidationDistricts { get; set; } = new List<RosterValidationDistrict>();

    public virtual ICollection<SchoolDistrictProviderCaseNote> SchoolDistrictProviderCaseNotes { get; set; } = new List<SchoolDistrictProviderCaseNote>();

    public virtual ICollection<SchoolDistrictRosterDocument> SchoolDistrictRosterDocuments { get; set; } = new List<SchoolDistrictRosterDocument>();

    public virtual ICollection<SchoolDistrictRoster> SchoolDistrictRosters { get; set; } = new List<SchoolDistrictRoster>();

    public virtual ICollection<SchoolDistrictsAccountAssistant> SchoolDistrictsAccountAssistants { get; set; } = new List<SchoolDistrictsAccountAssistant>();

    public virtual ICollection<SchoolDistrictsFinancialRep> SchoolDistrictsFinancialReps { get; set; } = new List<SchoolDistrictsFinancialRep>();

    public virtual ICollection<SchoolDistrictsSchool> SchoolDistrictsSchools { get; set; } = new List<SchoolDistrictsSchool>();

    public virtual Contact? SpecialEducationDirector { get; set; }

    public virtual ICollection<StudentDistrictWithdrawal> StudentDistrictWithdrawals { get; set; } = new List<StudentDistrictWithdrawal>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual Contact? Treasurer { get; set; }

    public virtual ICollection<UnmatchedClaimResponse> UnmatchedClaimResponses { get; set; } = new List<UnmatchedClaimResponse>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();

    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();

    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();

    public virtual ICollection<User> DistrictAdmins { get; set; } = new List<User>();
}
