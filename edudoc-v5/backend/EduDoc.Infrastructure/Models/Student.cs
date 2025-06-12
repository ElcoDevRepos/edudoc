using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class Student
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string? MiddleName { get; set; }

    public string LastName { get; set; } = null!;

    public string? StudentCode { get; set; }

    public string? MedicaidNo { get; set; }

    public string Grade { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public string? Notes { get; set; }

    public int? AddressId { get; set; }

    public int SchoolId { get; set; }

    public int? DistrictId { get; set; }

    public DateTime? EnrollmentDate { get; set; }

    public int? EscId { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<CaseLoad> CaseLoads { get; set; } = new List<CaseLoad>();

    public virtual ICollection<ClaimsStudent> ClaimsStudents { get; set; } = new List<ClaimsStudent>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual SchoolDistrict? District { get; set; }

    public virtual ICollection<EncounterStudent> EncounterStudents { get; set; } = new List<EncounterStudent>();

    public virtual Esc? Esc { get; set; }

    public virtual ICollection<Iepservice> Iepservices { get; set; } = new List<Iepservice>();

    public virtual ICollection<MergedStudent> MergedStudents { get; set; } = new List<MergedStudent>();

    public virtual ICollection<MigrationProviderCaseNotesHistory> MigrationProviderCaseNotesHistories { get; set; } = new List<MigrationProviderCaseNotesHistory>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<PendingReferral> PendingReferrals { get; set; } = new List<PendingReferral>();

    public virtual ICollection<ProgressReport> ProgressReports { get; set; } = new List<ProgressReport>();

    public virtual ICollection<ProviderCaseUpload> ProviderCaseUploads { get; set; } = new List<ProviderCaseUpload>();

    public virtual ICollection<ProviderStudentHistory> ProviderStudentHistories { get; set; } = new List<ProviderStudentHistory>();

    public virtual ICollection<ProviderStudentSupervisor> ProviderStudentSupervisors { get; set; } = new List<ProviderStudentSupervisor>();

    public virtual ICollection<ProviderStudent> ProviderStudents { get; set; } = new List<ProviderStudent>();

    public virtual ICollection<RosterValidationStudent> RosterValidationStudents { get; set; } = new List<RosterValidationStudent>();

    public virtual School School { get; set; } = null!;

    public virtual ICollection<SchoolDistrictRoster> SchoolDistrictRosters { get; set; } = new List<SchoolDistrictRoster>();

    public virtual ICollection<StudentDisabilityCode> StudentDisabilityCodes { get; set; } = new List<StudentDisabilityCode>();

    public virtual ICollection<StudentDistrictWithdrawal> StudentDistrictWithdrawals { get; set; } = new List<StudentDistrictWithdrawal>();

    public virtual ICollection<StudentParentalConsent> StudentParentalConsents { get; set; } = new List<StudentParentalConsent>();

    public virtual ICollection<SupervisorProviderStudentReferalSignOff> SupervisorProviderStudentReferalSignOffs { get; set; } = new List<SupervisorProviderStudentReferalSignOff>();
}
