using System;
using System.Collections.Generic;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace EduDoc.Api.EF;

public partial class EdudocSqlContext : DbContext
{
    public EdudocSqlContext(DbContextOptions<EdudocSqlContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Acknowledgement> Acknowledgements { get; set; }

    public virtual DbSet<ActivitySummary> ActivitySummaries { get; set; }

    public virtual DbSet<ActivitySummaryDistrict> ActivitySummaryDistricts { get; set; }

    public virtual DbSet<ActivitySummaryProvider> ActivitySummaryProviders { get; set; }

    public virtual DbSet<ActivitySummaryServiceArea> ActivitySummaryServiceAreas { get; set; }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<AdminSchoolDistrict> AdminSchoolDistricts { get; set; }

    public virtual DbSet<Agency> Agencies { get; set; }

    public virtual DbSet<AgencyType> AgencyTypes { get; set; }

    public virtual DbSet<AnnualEntry> AnnualEntries { get; set; }

    public virtual DbSet<AnnualEntryStatus> AnnualEntryStatuses { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<AuditLogDetail> AuditLogDetails { get; set; }

    public virtual DbSet<AuditLogRelationship> AuditLogRelationships { get; set; }

    public virtual DbSet<AuthApplicationType> AuthApplicationTypes { get; set; }

    public virtual DbSet<AuthClient> AuthClients { get; set; }

    public virtual DbSet<AuthToken> AuthTokens { get; set; }

    public virtual DbSet<AuthUser> AuthUsers { get; set; }

    public virtual DbSet<BillingFailure> BillingFailures { get; set; }

    public virtual DbSet<BillingFailureReason> BillingFailureReasons { get; set; }

    public virtual DbSet<BillingFile> BillingFiles { get; set; }

    public virtual DbSet<BillingResponseFile> BillingResponseFiles { get; set; }

    public virtual DbSet<BillingSchedule> BillingSchedules { get; set; }

    public virtual DbSet<BillingScheduleAdminNotification> BillingScheduleAdminNotifications { get; set; }

    public virtual DbSet<BillingScheduleDistrict> BillingScheduleDistricts { get; set; }

    public virtual DbSet<BillingScheduleExcludedCptCode> BillingScheduleExcludedCptCodes { get; set; }

    public virtual DbSet<BillingScheduleExcludedProvider> BillingScheduleExcludedProviders { get; set; }

    public virtual DbSet<BillingScheduleExcludedServiceCode> BillingScheduleExcludedServiceCodes { get; set; }

    public virtual DbSet<CaseLoad> CaseLoads { get; set; }

    public virtual DbSet<CaseLoadCptCode> CaseLoadCptCodes { get; set; }

    public virtual DbSet<CaseLoadGoal> CaseLoadGoals { get; set; }

    public virtual DbSet<CaseLoadMethod> CaseLoadMethods { get; set; }

    public virtual DbSet<CaseLoadScript> CaseLoadScripts { get; set; }

    public virtual DbSet<CaseLoadScriptGoal> CaseLoadScriptGoals { get; set; }

    public virtual DbSet<ClaimType> ClaimTypes { get; set; }

    public virtual DbSet<ClaimValue> ClaimValues { get; set; }

    public virtual DbSet<ClaimsDistrict> ClaimsDistricts { get; set; }

    public virtual DbSet<ClaimsEncounter> ClaimsEncounters { get; set; }

    public virtual DbSet<ClaimsStudent> ClaimsStudents { get; set; }

    public virtual DbSet<ClearedAuthToken> ClearedAuthTokens { get; set; }

    public virtual DbSet<ConsoleJobLog> ConsoleJobLogs { get; set; }

    public virtual DbSet<ConsoleJobType> ConsoleJobTypes { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<ContactPhone> ContactPhones { get; set; }

    public virtual DbSet<ContactRole> ContactRoles { get; set; }

    public virtual DbSet<ContactStatus> ContactStatuses { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<County> Counties { get; set; }

    public virtual DbSet<Cptcode> Cptcodes { get; set; }

    public virtual DbSet<CptcodeAssocation> CptcodeAssocations { get; set; }

    public virtual DbSet<DiagnosisCode> DiagnosisCodes { get; set; }

    public virtual DbSet<DiagnosisCodeAssociation> DiagnosisCodeAssociations { get; set; }

    public virtual DbSet<DisabilityCode> DisabilityCodes { get; set; }

    public virtual DbSet<DistrictProgressReportDate> DistrictProgressReportDates { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<DocumentType> DocumentTypes { get; set; }

    public virtual DbSet<EdiErrorCode> EdiErrorCodes { get; set; }

    public virtual DbSet<EdiErrorCodeAdminNotification> EdiErrorCodeAdminNotifications { get; set; }

    public virtual DbSet<EdiFileType> EdiFileTypes { get; set; }

    public virtual DbSet<EdiMetaData> EdiMetaDatas { get; set; }

    public virtual DbSet<Encounter> Encounters { get; set; }

    public virtual DbSet<EncounterIdentifier> EncounterIdentifiers { get; set; }

    public virtual DbSet<EncounterLocation> EncounterLocations { get; set; }

    public virtual DbSet<EncounterReasonForReturn> EncounterReasonForReturns { get; set; }

    public virtual DbSet<EncounterReturnReasonCategory> EncounterReturnReasonCategories { get; set; }

    public virtual DbSet<EncounterStatus> EncounterStatuses { get; set; }

    public virtual DbSet<EncounterStudent> EncounterStudents { get; set; }

    public virtual DbSet<EncounterStudentCptCode> EncounterStudentCptCodes { get; set; }

    public virtual DbSet<EncounterStudentGoal> EncounterStudentGoals { get; set; }

    public virtual DbSet<EncounterStudentMethod> EncounterStudentMethods { get; set; }

    public virtual DbSet<EncounterStudentStatus> EncounterStudentStatuses { get; set; }

    public virtual DbSet<Esc> Escs { get; set; }

    public virtual DbSet<EscSchoolDistrict> EscSchoolDistricts { get; set; }

    public virtual DbSet<EsignatureContent> EsignatureContents { get; set; }

    public virtual DbSet<EvaluationType> EvaluationTypes { get; set; }

    public virtual DbSet<EvaluationTypesDiagnosisCode> EvaluationTypesDiagnosisCodes { get; set; }

    public virtual DbSet<Goal> Goals { get; set; }

    public virtual DbSet<HealthCareClaim> HealthCareClaims { get; set; }

    public virtual DbSet<Iepservice> Iepservices { get; set; }

    public virtual DbSet<Image> Images { get; set; }

    public virtual DbSet<ImpersonationLog> ImpersonationLogs { get; set; }

    public virtual DbSet<JobsAudit> JobsAudits { get; set; }

    public virtual DbSet<LogMetadatum> LogMetadata { get; set; }

    public virtual DbSet<MergedStudent> MergedStudents { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<MessageDocument> MessageDocuments { get; set; }

    public virtual DbSet<MessageFilterType> MessageFilterTypes { get; set; }

    public virtual DbSet<MessageLink> MessageLinks { get; set; }

    public virtual DbSet<Method> Methods { get; set; }

    public virtual DbSet<MigrationProviderCaseNotesHistory> MigrationProviderCaseNotesHistories { get; set; }

    public virtual DbSet<NonMspService> NonMspServices { get; set; }

    public virtual DbSet<Note> Notes { get; set; }

    public virtual DbSet<NursingGoalResponse> NursingGoalResponses { get; set; }

    public virtual DbSet<NursingGoalResult> NursingGoalResults { get; set; }

    public virtual DbSet<PendingReferral> PendingReferrals { get; set; }

    public virtual DbSet<PendingReferralReportJobRun> PendingReferralReportJobRuns { get; set; }

    public virtual DbSet<PhoneType> PhoneTypes { get; set; }

    public virtual DbSet<ProgressReport> ProgressReports { get; set; }

    public virtual DbSet<Provider> Providers { get; set; }

    public virtual DbSet<ProviderAcknowledgmentLog> ProviderAcknowledgmentLogs { get; set; }

    public virtual DbSet<ProviderCaseUpload> ProviderCaseUploads { get; set; }

    public virtual DbSet<ProviderCaseUploadDocument> ProviderCaseUploadDocuments { get; set; }

    public virtual DbSet<ProviderDoNotBillReason> ProviderDoNotBillReasons { get; set; }

    public virtual DbSet<ProviderEmploymentType> ProviderEmploymentTypes { get; set; }

    public virtual DbSet<ProviderEscAssignment> ProviderEscAssignments { get; set; }

    public virtual DbSet<ProviderEscSchoolDistrict> ProviderEscSchoolDistricts { get; set; }

    public virtual DbSet<ProviderInactivityDate> ProviderInactivityDates { get; set; }

    public virtual DbSet<ProviderInactivityReason> ProviderInactivityReasons { get; set; }

    public virtual DbSet<ProviderLicense> ProviderLicenses { get; set; }

    public virtual DbSet<ProviderOdecertification> ProviderOdecertifications { get; set; }

    public virtual DbSet<ProviderStudent> ProviderStudents { get; set; }

    public virtual DbSet<ProviderStudentHistory> ProviderStudentHistories { get; set; }

    public virtual DbSet<ProviderStudentSupervisor> ProviderStudentSupervisors { get; set; }

    public virtual DbSet<ProviderTitle> ProviderTitles { get; set; }

    public virtual DbSet<ProviderTraining> ProviderTrainings { get; set; }

    public virtual DbSet<ReadMessage> ReadMessages { get; set; }

    public virtual DbSet<RevokeAccess> RevokeAccesses { get; set; }

    public virtual DbSet<RosterValidation> RosterValidations { get; set; }

    public virtual DbSet<RosterValidationDistrict> RosterValidationDistricts { get; set; }

    public virtual DbSet<RosterValidationFile> RosterValidationFiles { get; set; }

    public virtual DbSet<RosterValidationResponseFile> RosterValidationResponseFiles { get; set; }

    public virtual DbSet<RosterValidationStudent> RosterValidationStudents { get; set; }

    public virtual DbSet<School> Schools { get; set; }

    public virtual DbSet<SchoolDistrict> SchoolDistricts { get; set; }

    public virtual DbSet<SchoolDistrictProviderCaseNote> SchoolDistrictProviderCaseNotes { get; set; }

    public virtual DbSet<SchoolDistrictRoster> SchoolDistrictRosters { get; set; }

    public virtual DbSet<SchoolDistrictRosterDocument> SchoolDistrictRosterDocuments { get; set; }

    public virtual DbSet<SchoolDistrictsAccountAssistant> SchoolDistrictsAccountAssistants { get; set; }

    public virtual DbSet<SchoolDistrictsFinancialRep> SchoolDistrictsFinancialReps { get; set; }

    public virtual DbSet<SchoolDistrictsSchool> SchoolDistrictsSchools { get; set; }

    public virtual DbSet<ServiceCode> ServiceCodes { get; set; }

    public virtual DbSet<ServiceOutcome> ServiceOutcomes { get; set; }

    public virtual DbSet<ServiceType> ServiceTypes { get; set; }

    public virtual DbSet<ServiceUnitRule> ServiceUnitRules { get; set; }

    public virtual DbSet<ServiceUnitTimeSegment> ServiceUnitTimeSegments { get; set; }

    public virtual DbSet<Setting> Settings { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<StudentDeviationReason> StudentDeviationReasons { get; set; }

    public virtual DbSet<StudentDisabilityCode> StudentDisabilityCodes { get; set; }

    public virtual DbSet<StudentDistrictWithdrawal> StudentDistrictWithdrawals { get; set; }

    public virtual DbSet<StudentParentalConsent> StudentParentalConsents { get; set; }

    public virtual DbSet<StudentParentalConsentType> StudentParentalConsentTypes { get; set; }

    public virtual DbSet<StudentTherapy> StudentTherapies { get; set; }

    public virtual DbSet<StudentTherapySchedule> StudentTherapySchedules { get; set; }

    public virtual DbSet<StudentType> StudentTypes { get; set; }

    public virtual DbSet<SupervisorProviderStudentReferalSignOff> SupervisorProviderStudentReferalSignOffs { get; set; }

    public virtual DbSet<TherapyCaseNote> TherapyCaseNotes { get; set; }

    public virtual DbSet<TherapyGroup> TherapyGroups { get; set; }

    public virtual DbSet<TrainingType> TrainingTypes { get; set; }

    public virtual DbSet<UnmatchedClaimDistrict> UnmatchedClaimDistricts { get; set; }

    public virtual DbSet<UnmatchedClaimResponse> UnmatchedClaimResponses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserPhone> UserPhones { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<UserRoleClaim> UserRoleClaims { get; set; }

    public virtual DbSet<UserType> UserTypes { get; set; }

    public virtual DbSet<Voucher> Vouchers { get; set; }

    public virtual DbSet<VoucherBillingResponseFile> VoucherBillingResponseFiles { get; set; }

    public virtual DbSet<VoucherType> VoucherTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Acknowledgement>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).IsUnicode(false);
        });

        modelBuilder.Entity<ActivitySummary>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ActivitySummaries)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ActivitySummaries_Users");
        });

        modelBuilder.Entity<ActivitySummaryDistrict>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.ActivitySummary).WithMany(p => p.ActivitySummaryDistricts)
                .HasForeignKey(d => d.ActivitySummaryId)
                .HasConstraintName("FK_ActivitySummaryDistricts_ActivitySummaries");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ActivitySummaryDistricts)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_ActivitySummaryDistricts_Users");

            entity.HasOne(d => d.District).WithMany(p => p.ActivitySummaryDistricts)
                .HasForeignKey(d => d.DistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ActivitySummaryDistricts_SchoolDistricts");
        });

        modelBuilder.Entity<ActivitySummaryProvider>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ProviderName)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.ActivitySummaryServiceArea).WithMany(p => p.ActivitySummaryProviders)
                .HasForeignKey(d => d.ActivitySummaryServiceAreaId)
                .HasConstraintName("FK_ActivitySummaryProviders_ActivitySummaryServiceAreas");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ActivitySummaryProviders)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_ActivitySummaryProviders_Users");

            entity.HasOne(d => d.Provider).WithMany(p => p.ActivitySummaryProviders)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ActivitySummaryProviders_Providers");
        });

        modelBuilder.Entity<ActivitySummaryServiceArea>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.ActivitySummaryDistrict).WithMany(p => p.ActivitySummaryServiceAreas)
                .HasForeignKey(d => d.ActivitySummaryDistrictId)
                .HasConstraintName("FK_ActivitySummaryServiceAreas_ActivitySummaryDistricts");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ActivitySummaryServiceAreas)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_ActivitySummaryServiceAreas_Users");

            entity.HasOne(d => d.ServiceArea).WithMany(p => p.ActivitySummaryServiceAreas)
                .HasForeignKey(d => d.ServiceAreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ActivitySummaryServiceAreas_ServiceCodes");
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.Property(e => e.Address1)
                .HasMaxLength(250)
                .HasDefaultValue("");
            entity.Property(e => e.Address2)
                .HasMaxLength(250)
                .HasDefaultValue("");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .HasDefaultValue("");
            entity.Property(e => e.CountryCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.County)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Province)
                .HasMaxLength(50)
                .HasDefaultValue("");
            entity.Property(e => e.StateCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasDefaultValue("")
                .IsFixedLength();
            entity.Property(e => e.Zip)
                .HasMaxLength(20)
                .HasDefaultValue("");

            entity.HasOne(d => d.CountryCodeNavigation).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.CountryCode)
                .HasConstraintName("FK_Addresses_Countries");

            entity.HasOne(d => d.StateCodeNavigation).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.StateCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Addresses_States");
        });

        modelBuilder.Entity<AdminSchoolDistrict>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_AdminSchoolDistrict");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.Admin).WithMany(p => p.AdminSchoolDistrictAdmins)
                .HasForeignKey(d => d.AdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AdminSchoolDistrict_Admin");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.AdminSchoolDistrictCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AdminSchoolDistrict_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.AdminSchoolDistrictModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_AdminSchoolDistrict_ModifiedBy");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.AdminSchoolDistricts)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AdminSchoolDistrict_SchoolDistrict");
        });

        modelBuilder.Entity<Agency>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AgencyType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AnnualEntry>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.AllowableCosts)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.InterimPayments)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.Mer)
                .HasMaxLength(18)
                .IsUnicode(false)
                .HasColumnName("MER");
            entity.Property(e => e.Rmts)
                .HasMaxLength(18)
                .IsUnicode(false)
                .HasColumnName("RMTS");
            entity.Property(e => e.SettlementAmount)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.Year)
                .HasMaxLength(4)
                .IsUnicode(false);

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.AnnualEntries)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AnnualEntries_SchoolDistricts");

            entity.HasOne(d => d.Status).WithMany(p => p.AnnualEntries)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AnnualEntries_AnnualEntryStatuses");
        });

        modelBuilder.Entity<AnnualEntryStatus>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditLogId).HasName("PK_dbo.AuditLogs");

            entity.Property(e => e.EventDateUtc)
                .HasColumnType("datetime")
                .HasColumnName("EventDateUTC");
            entity.Property(e => e.RecordId).HasMaxLength(256);
            entity.Property(e => e.TypeFullName).HasMaxLength(512);
        });

        modelBuilder.Entity<AuditLogDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_dbo.AuditLogDetails");

            entity.Property(e => e.PropertyName).HasMaxLength(256);

            entity.HasOne(d => d.AuditLog).WithMany(p => p.AuditLogDetails)
                .HasForeignKey(d => d.AuditLogId)
                .HasConstraintName("FK_dbo.AuditLogDetails_dbo.AuditLogs_AuditLogId");
        });

        modelBuilder.Entity<AuditLogRelationship>(entity =>
        {
            entity.HasIndex(e => new { e.AuditLogId, e.TypeFullName, e.KeyValue }, "IX_AuditLogRelationships_Search");

            entity.Property(e => e.KeyName).HasMaxLength(512);
            entity.Property(e => e.KeyValue).HasMaxLength(512);
            entity.Property(e => e.TypeFullName).HasMaxLength(512);

            entity.HasOne(d => d.AuditLog).WithMany(p => p.AuditLogRelationships)
                .HasForeignKey(d => d.AuditLogId)
                .HasConstraintName("FK_AuditLogRelationships_AuditLogs");
        });

        modelBuilder.Entity<AuthApplicationType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AuthClient>(entity =>
        {
            entity.Property(e => e.AllowedOrigin)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.AuthApplicationType).WithMany(p => p.AuthClients)
                .HasForeignKey(d => d.AuthApplicationTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuthClients_AuthApplicationTypes");
        });

        modelBuilder.Entity<AuthToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_RefreshTokens");

            entity.Property(e => e.ExpiresUtc).HasColumnType("datetime");
            entity.Property(e => e.IdentifierKey).HasMaxLength(64);
            entity.Property(e => e.IssuedUtc).HasColumnType("datetime");
            entity.Property(e => e.Salt).HasMaxLength(64);
            entity.Property(e => e.Token).IsUnicode(false);

            entity.HasOne(d => d.AuthClient).WithMany(p => p.AuthTokens)
                .HasForeignKey(d => d.AuthClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuthTokens_AuthClients");

            entity.HasOne(d => d.AuthUser).WithMany(p => p.AuthTokens)
                .HasForeignKey(d => d.AuthUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuthTokens_AuthUsers");
        });

        modelBuilder.Entity<AuthUser>(entity =>
        {
            entity.Property(e => e.HasAccess).HasDefaultValue(true);
            entity.Property(e => e.IsEditable).HasDefaultValue(true);
            entity.Property(e => e.Password).HasMaxLength(64);
            entity.Property(e => e.ResetKey)
                .HasMaxLength(64)
                .HasDefaultValueSql("(0x00)");
            entity.Property(e => e.ResetKeyExpirationUtc)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleId).HasComment("FK:UserRole");
            entity.Property(e => e.Salt).HasMaxLength(64);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComment("Username can be email or other.");

            entity.HasOne(d => d.Role).WithMany(p => p.AuthUsers)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuthUsers_UserRoles");
        });

        modelBuilder.Entity<BillingFailure>(entity =>
        {
            entity.Property(e => e.DateOfFailure)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateResolved).HasColumnType("datetime");

            entity.HasOne(d => d.BillingFailureReason).WithMany(p => p.BillingFailures)
                .HasForeignKey(d => d.BillingFailureReasonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingFailures_BillingFailureReason");

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.BillingFailures)
                .HasForeignKey(d => d.BillingScheduleId)
                .HasConstraintName("FK_BillingFailures_BillingSchedule");

            entity.HasOne(d => d.EncounterStudent).WithMany(p => p.BillingFailures)
                .HasForeignKey(d => d.EncounterStudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingFailures_EncounterStudent");

            entity.HasOne(d => d.ResolvedBy).WithMany(p => p.BillingFailures)
                .HasForeignKey(d => d.ResolvedById)
                .HasConstraintName("FK_BillingFailures_ResolvedBy");
        });

        modelBuilder.Entity<BillingFailureReason>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BillingFile>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.PageNumber).HasDefaultValue(1);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.BillingFiles)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_BillingFiles_Users");

            entity.HasOne(d => d.HealthCareClaim).WithMany(p => p.BillingFiles)
                .HasForeignKey(d => d.HealthCareClaimId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingFiles_HealthCareClaim");
        });

        modelBuilder.Entity<BillingResponseFile>(entity =>
        {
            entity.Property(e => e.DateProcessed).HasColumnType("datetime");
            entity.Property(e => e.DateUploaded)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.UploadedBy).WithMany(p => p.BillingResponseFiles)
                .HasForeignKey(d => d.UploadedById)
                .HasConstraintName("FK_BillingResponseFiles_Users");
        });

        modelBuilder.Entity<BillingSchedule>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Notes)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.ScheduledDate)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.BillingScheduleCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingSchedules_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.BillingScheduleModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_BillingSchedules_ModifiedBy");
        });

        modelBuilder.Entity<BillingScheduleAdminNotification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_BillingScheduleAdminNotfications");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Admin).WithMany(p => p.BillingScheduleAdminNotificationAdmins)
                .HasForeignKey(d => d.AdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleAdminNotifications_Admin");

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.BillingScheduleAdminNotifications)
                .HasForeignKey(d => d.BillingScheduleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleAdminNotifications_BillingSchedule");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.BillingScheduleAdminNotificationCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleAdminNotifications_CreatedBy");
        });

        modelBuilder.Entity<BillingScheduleDistrict>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.BillingScheduleDistricts)
                .HasForeignKey(d => d.BillingScheduleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleDistricts_BillingSchedule");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.BillingScheduleDistricts)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleDistricts_CreatedBy");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.BillingScheduleDistricts)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleDistricts_SchoolDistrict");
        });

        modelBuilder.Entity<BillingScheduleExcludedCptCode>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.BillingScheduleExcludedCptCodes)
                .HasForeignKey(d => d.BillingScheduleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedCptCodes_BillingSchedule");

            entity.HasOne(d => d.CptCode).WithMany(p => p.BillingScheduleExcludedCptCodes)
                .HasForeignKey(d => d.CptCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedCptCodes_CptCode");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.BillingScheduleExcludedCptCodes)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedCptCodes_CreatedBy");
        });

        modelBuilder.Entity<BillingScheduleExcludedProvider>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.BillingScheduleExcludedProviders)
                .HasForeignKey(d => d.BillingScheduleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedProviders_BillingSchedule");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.BillingScheduleExcludedProviders)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedProviders_CreatedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.BillingScheduleExcludedProviders)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedProviders_Provider");
        });

        modelBuilder.Entity<BillingScheduleExcludedServiceCode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_BillingScheduleExcludedServiceTypes");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.BillingScheduleExcludedServiceCodes)
                .HasForeignKey(d => d.BillingScheduleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedServiceTypes_BillingSchedule");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.BillingScheduleExcludedServiceCodes)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedServiceTypes_CreatedBy");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.BillingScheduleExcludedServiceCodes)
                .HasForeignKey(d => d.ServiceCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BillingScheduleExcludedServiceTypes_ServiceCode");
        });

        modelBuilder.Entity<CaseLoad>(entity =>
        {
            entity.HasIndex(e => e.StudentId, "IX_CaseLoads_1");

            entity.HasIndex(e => e.ServiceCodeId, "IX_CaseLoads_ServiceCodeId");

            entity.HasIndex(e => new { e.ServiceCodeId, e.StudentId }, "IX_CaseLoads_ServiceCodeId_StudentId");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.IependDate)
                .HasColumnType("datetime")
                .HasColumnName("IEPEndDate");
            entity.Property(e => e.IepstartDate)
                .HasColumnType("datetime")
                .HasColumnName("IEPStartDate");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.CaseLoadCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoads_CreatedBy");

            entity.HasOne(d => d.DiagnosisCode).WithMany(p => p.CaseLoads)
                .HasForeignKey(d => d.DiagnosisCodeId)
                .HasConstraintName("FK_CaseLoads_DiagnosisCodes");

            entity.HasOne(d => d.DisabilityCode).WithMany(p => p.CaseLoads)
                .HasForeignKey(d => d.DisabilityCodeId)
                .HasConstraintName("FK_CaseLoads_DisabilityCodes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CaseLoadModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CaseLoads_ModifiedBy");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.CaseLoads)
                .HasForeignKey(d => d.ServiceCodeId)
                .HasConstraintName("FK_CaseLoads_ServiceCode");

            entity.HasOne(d => d.Student).WithMany(p => p.CaseLoads)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoads_Student");

            entity.HasOne(d => d.StudentType).WithMany(p => p.CaseLoads)
                .HasForeignKey(d => d.StudentTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoads_StudentType");
        });

        modelBuilder.Entity<CaseLoadCptCode>(entity =>
        {
            entity.HasIndex(e => e.CaseLoadId, "IX_CaseLoadCptCodes");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Default).HasDefaultValue(false);

            entity.HasOne(d => d.CaseLoad).WithMany(p => p.CaseLoadCptCodes)
                .HasForeignKey(d => d.CaseLoadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadCptCodes_CaseLoad");

            entity.HasOne(d => d.CptCode).WithMany(p => p.CaseLoadCptCodes)
                .HasForeignKey(d => d.CptCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadCptCodes_CptCode");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.CaseLoadCptCodeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadCptCodes_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CaseLoadCptCodeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CaseLoadCptCodes_ModifiedBy");
        });

        modelBuilder.Entity<CaseLoadGoal>(entity =>
        {
            entity.HasIndex(e => e.CaseLoadId, "IX_CaseLoadGoals");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CaseLoad).WithMany(p => p.CaseLoadGoals)
                .HasForeignKey(d => d.CaseLoadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadGoals_CaseLoad");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.CaseLoadGoalCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadGoals_CreatedBy");

            entity.HasOne(d => d.Goal).WithMany(p => p.CaseLoadGoals)
                .HasForeignKey(d => d.GoalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadGoals_Goal");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CaseLoadGoalModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CaseLoadGoals_ModifiedBy");
        });

        modelBuilder.Entity<CaseLoadMethod>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CaseLoad).WithMany(p => p.CaseLoadMethods)
                .HasForeignKey(d => d.CaseLoadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadMethods_CaseLoad");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.CaseLoadMethodCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadMethods_CreatedBy");

            entity.HasOne(d => d.Method).WithMany(p => p.CaseLoadMethods)
                .HasForeignKey(d => d.MethodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadMethods_Method");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CaseLoadMethodModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CaseLoadMethods_ModifiedBy");
        });

        modelBuilder.Entity<CaseLoadScript>(entity =>
        {
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.DateUpload)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DoctorFirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DoctorLastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
            entity.Property(e => e.FileName)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.InitiationDate).HasColumnType("datetime");
            entity.Property(e => e.Npi)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NPI");

            entity.HasOne(d => d.CaseLoad).WithMany(p => p.CaseLoadScripts)
                .HasForeignKey(d => d.CaseLoadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadScripts_CaseLoad");

            entity.HasOne(d => d.DiagnosisCode).WithMany(p => p.CaseLoadScripts)
                .HasForeignKey(d => d.DiagnosisCodeId)
                .HasConstraintName("FK_CaseLoadScripts_DiagnosisCodes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CaseLoadScriptModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CaseLoadScripts_ModifiedBy");

            entity.HasOne(d => d.UploadedBy).WithMany(p => p.CaseLoadScriptUploadedBies)
                .HasForeignKey(d => d.UploadedById)
                .HasConstraintName("FK_CaseLoadScripts_UploadedBy");
        });

        modelBuilder.Entity<CaseLoadScriptGoal>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.MedicationName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.CaseLoadScript).WithMany(p => p.CaseLoadScriptGoals)
                .HasForeignKey(d => d.CaseLoadScriptId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadScriptGoals_CaseLoadScript");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.CaseLoadScriptGoalCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadScriptGoals_CreatedBy");

            entity.HasOne(d => d.Goal).WithMany(p => p.CaseLoadScriptGoals)
                .HasForeignKey(d => d.GoalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CaseLoadScriptGoals_Goal");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CaseLoadScriptGoalModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CaseLoadScriptGoals_ModifiedBy");
        });

        modelBuilder.Entity<ClaimType>(entity =>
        {
            entity.Property(e => e.Alias)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasMany(d => d.UserTypes).WithMany(p => p.ClaimTypes)
                .UsingEntity<Dictionary<string, object>>(
                    "UserTypesClaimType",
                    r => r.HasOne<UserType>().WithMany()
                        .HasForeignKey("UserTypeId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_UserTypesClaimTypes_UserType"),
                    l => l.HasOne<ClaimType>().WithMany()
                        .HasForeignKey("ClaimTypeId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_UserTypesClaimTypes_ClaimType"),
                    j =>
                    {
                        j.HasKey("ClaimTypeId", "UserTypeId");
                        j.ToTable("UserTypesClaimTypes");
                    });
        });

        modelBuilder.Entity<ClaimValue>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ClaimsDistrict>(entity =>
        {
            entity.Property(e => e.Address)
                .HasMaxLength(55)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.DistrictOrganizationName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.EmployerId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IdentificationCode)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false);

            entity.HasOne(d => d.HealthCareClaims).WithMany(p => p.ClaimsDistricts)
                .HasForeignKey(d => d.HealthCareClaimsId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClaimsDistricts_HealthCareClaims");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.ClaimsDistricts)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClaimsDistricts_SchoolDistrict");
        });

        modelBuilder.Entity<ClaimsEncounter>(entity =>
        {
            entity.HasIndex(e => e.AggregateId, "IX_ClaimsEncounters_AggregateId");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.AdjustmentAmount)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.AdjustmentReasonCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.BillingUnits)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ClaimAmount)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.ClaimId)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ControlNumberPrefix)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PaidAmount)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.PhysicianFirstName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.PhysicianId)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.PhysicianLastName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.ProcedureIdentifier)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ReasonForServiceCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ReferenceNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ReferringProviderFirstName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ReferringProviderId)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.ReferringProviderLastName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.ServiceDate).HasColumnType("datetime");
            entity.Property(e => e.VoucherDate).HasColumnType("datetime");

            entity.HasOne(d => d.Aggregate).WithMany(p => p.ClaimsEncounterAggregates)
                .HasForeignKey(d => d.AggregateId)
                .HasConstraintName("FK_ClaimsEncounters_AggregateCptCode");

            entity.HasOne(d => d.ClaimsStudent).WithMany(p => p.ClaimsEncounters)
                .HasForeignKey(d => d.ClaimsStudentId)
                .HasConstraintName("FK_ClaimsEncounters_ClaimsStudent");

            entity.HasOne(d => d.EdiErrorCode).WithMany(p => p.ClaimsEncounters)
                .HasForeignKey(d => d.EdiErrorCodeId)
                .HasConstraintName("FK_ClaimsEncounters_EdiErrorCode");

            entity.HasOne(d => d.EncounterStudentCptCode).WithMany(p => p.ClaimsEncounterEncounterStudentCptCodes)
                .HasForeignKey(d => d.EncounterStudentCptCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClaimsEncounters_EncounterStudentCptCode");

            entity.HasOne(d => d.EncounterStudent).WithMany(p => p.ClaimsEncounters)
                .HasForeignKey(d => d.EncounterStudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClaimsEncounters_EncounterStudent");

            entity.HasOne(d => d.ReversedClaim).WithMany(p => p.ClaimsEncounters)
                .HasForeignKey(d => d.ReversedClaimId)
                .HasConstraintName("FK_ClaimsEncounters_ReversedClaim");
        });

        modelBuilder.Entity<ClaimsStudent>(entity =>
        {
            entity.Property(e => e.Address)
                .HasMaxLength(55)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.IdentificationCode)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.InsuredDateTimePeriod)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ResponseFollowUpAction)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false);

            entity.HasOne(d => d.ClaimsDistrict).WithMany(p => p.ClaimsStudents)
                .HasForeignKey(d => d.ClaimsDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClaimsStudents_ClaimsDistrict");

            entity.HasOne(d => d.Student).WithMany(p => p.ClaimsStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClaimsStudents_Student");
        });

        modelBuilder.Entity<ClearedAuthToken>(entity =>
        {
            entity.Property(e => e.ClearedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ExpiresUtc).HasColumnType("datetime");
            entity.Property(e => e.IdentifierKey).HasMaxLength(64);
            entity.Property(e => e.IssuedUtc).HasColumnType("datetime");
            entity.Property(e => e.Salt).HasMaxLength(64);
            entity.Property(e => e.Token).IsUnicode(false);
        });

        modelBuilder.Entity<ConsoleJobLog>(entity =>
        {
            entity.Property(e => e.Date)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ErrorMessage).IsUnicode(false);
            entity.Property(e => e.StackTrace).IsUnicode(false);

            entity.HasOne(d => d.ConsoleJobType).WithMany(p => p.ConsoleJobLogs)
                .HasForeignKey(d => d.ConsoleJobTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ConsoleJobLogs_ConsoleJobTypes");
        });

        modelBuilder.Entity<ConsoleJobType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");

            entity.HasOne(d => d.Address).WithMany(p => p.Contacts)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK_Contacts_Addresses");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ContactCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_Contacts_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ContactModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Contacts_ModifiedBy");

            entity.HasOne(d => d.Role).WithMany(p => p.Contacts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Contacts_ContactRoles");

            entity.HasOne(d => d.Status).WithMany(p => p.Contacts)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Contacts_ContactStatuses");
        });

        modelBuilder.Entity<ContactPhone>(entity =>
        {
            entity.HasKey(e => new { e.ContactId, e.Phone });

            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Extension)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasDefaultValue("");

            entity.HasOne(d => d.Contact).WithMany(p => p.ContactPhones)
                .HasForeignKey(d => d.ContactId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ContactPhones_Contacts");

            entity.HasOne(d => d.PhoneType).WithMany(p => p.ContactPhones)
                .HasForeignKey(d => d.PhoneTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ContactPhones_PhoneTypes");
        });

        modelBuilder.Entity<ContactRole>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Sort).HasDefaultValue(0);
        });

        modelBuilder.Entity<ContactStatus>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.CountryCode);

            entity.Property(e => e.CountryCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Alpha3Code)
                .HasMaxLength(3)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<County>(entity =>
        {
            entity.HasKey(e => e.Zip);

            entity.Property(e => e.Zip).HasMaxLength(20);
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CountyName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Latitude).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.StateCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<Cptcode>(entity =>
        {
            entity.ToTable("CPTCodes");

            entity.Property(e => e.BillAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Lpndefault).HasColumnName("LPNDefault");
            entity.Property(e => e.Notes)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Rndefault).HasColumnName("RNDefault");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.CptcodeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTCodes_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CptcodeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CPTCodes_ModifiedBy");

            entity.HasOne(d => d.ServiceUnitRule).WithMany(p => p.Cptcodes)
                .HasForeignKey(d => d.ServiceUnitRuleId)
                .HasConstraintName("FK_CPTCodes_ServiceUnitRule");
        });

        modelBuilder.Entity<CptcodeAssocation>(entity =>
        {
            entity.ToTable("CPTCodeAssocations");

            entity.Property(e => e.CptcodeId).HasColumnName("CPTCodeId");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.Cptcode).WithMany(p => p.CptcodeAssocations)
                .HasForeignKey(d => d.CptcodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTCodeAssocations_CPTCodes");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.CptcodeAssocationCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTCodeAssocations_CreatedBy");

            entity.HasOne(d => d.EvaluationType).WithMany(p => p.CptcodeAssocations)
                .HasForeignKey(d => d.EvaluationTypeId)
                .HasConstraintName("FK_CPTCodeAssocations_EvaluationTypes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.CptcodeAssocationModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_CPTCodeAssocations_ModifiedBy");

            entity.HasOne(d => d.ProviderTitle).WithMany(p => p.CptcodeAssocations)
                .HasForeignKey(d => d.ProviderTitleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTCodeAssocations_ProviderTitles");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.CptcodeAssocations)
                .HasForeignKey(d => d.ServiceCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTCodeAssocations_ServiceCodes");

            entity.HasOne(d => d.ServiceType).WithMany(p => p.CptcodeAssocations)
                .HasForeignKey(d => d.ServiceTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CPTCodeAssocations_ServiceTypes");
        });

        modelBuilder.Entity<DiagnosisCode>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EffectiveDateFrom).HasColumnType("datetime");
            entity.Property(e => e.EffectiveDateTo).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.DiagnosisCodeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DiagnosisCodes_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.DiagnosisCodeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_DiagnosisCodes_ModifiedBy");
        });

        modelBuilder.Entity<DiagnosisCodeAssociation>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.DiagnosisCodeAssociationCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DiagnosisCodeAssociations_CreatedBy");

            entity.HasOne(d => d.DiagnosisCode).WithMany(p => p.DiagnosisCodeAssociations)
                .HasForeignKey(d => d.DiagnosisCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DiagnosisCodeAssociations_DiagnosisCodes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.DiagnosisCodeAssociationModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_DiagnosisCodeAssociations_ModifiedBy");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.DiagnosisCodeAssociations)
                .HasForeignKey(d => d.ServiceCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DiagnosisCodeAssociations_ServiceCodes");

            entity.HasOne(d => d.ServiceType).WithMany(p => p.DiagnosisCodeAssociations)
                .HasForeignKey(d => d.ServiceTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DiagnosisCodeAssociations_ServiceTypes");
        });

        modelBuilder.Entity<DisabilityCode>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DistrictProgressReportDate>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.FirstQuarterEndDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear]()-(1),(11),(30),(12),(0),(0),(0)))")
                .HasColumnType("datetime");
            entity.Property(e => e.FirstQuarterStartDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear]()-(1),(9),(1),(12),(0),(0),(0)))")
                .HasColumnType("datetime");
            entity.Property(e => e.FourthQuarterEndDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear](),(8),(31),(12),(0),(0),(0)))")
                .HasColumnType("datetime");
            entity.Property(e => e.FourthQuarterStartDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear](),(6),(1),(12),(0),(0),(0)))")
                .HasColumnType("datetime");
            entity.Property(e => e.SecondQuarterEndDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear](),(3),(1),(12),(0),(0),(0)))")
                .HasColumnType("datetime");
            entity.Property(e => e.SecondQuarterStartDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear]()-(1),(12),(1),(12),(0),(0),(0)))")
                .HasColumnType("datetime");
            entity.Property(e => e.ThirdQuarterEndDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear](),(5),(31),(12),(0),(0),(0)))")
                .HasColumnType("datetime");
            entity.Property(e => e.ThirdQuarterStartDate)
                .HasDefaultValueSql("(datetimefromparts([dbo].[CurrentSchoolYear](),(3),(2),(12),(0),(0),(0)))")
                .HasColumnType("datetime");

            entity.HasOne(d => d.District).WithMany(p => p.DistrictProgressReportDates)
                .HasForeignKey(d => d.DistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DistrictProgressReportDates_SchoolDistricts");
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.Property(e => e.DateUpload)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Documents)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK_Documents_Users");
        });

        modelBuilder.Entity<DocumentType>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EdiErrorCode>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.ErrorCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(750)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EdiErrorCodeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EdiErrorCodes_CreatedBy");

            entity.HasOne(d => d.EdiFileType).WithMany(p => p.EdiErrorCodes)
                .HasForeignKey(d => d.EdiFileTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EdiErrorCodes_EdiFileType");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EdiErrorCodeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EdiErrorCodes_ModifiedBy");
        });

        modelBuilder.Entity<EdiErrorCodeAdminNotification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_EdiErrorCodeAdminNotfications");

            entity.HasOne(d => d.Admin).WithMany(p => p.EdiErrorCodeAdminNotifications)
                .HasForeignKey(d => d.AdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EdiErrorCodeAdminNotifications_User");
        });

        modelBuilder.Entity<EdiFileType>(entity =>
        {
            entity.Property(e => e.EdiFileFormat)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EdiMetaData>(entity =>
        {
            entity.Property(e => e.ClaimImplementationReference)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ClaimNoteDescription)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.FacilityCode)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.ProviderCode)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.ProviderOrganizationName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.ReceiverId)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ReceiverOrganizationName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.ReferenceQlfrId)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.RosterValidationImplementationReference)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ServiceLocationCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.SubmitterEmail)
                .HasMaxLength(256)
                .IsUnicode(false);
            entity.Property(e => e.SubmitterName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.SubmitterOrganizationName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.SubmitterPhone)
                .HasMaxLength(256)
                .IsUnicode(false);
            entity.Property(e => e.SubmitterPhoneAlt)
                .HasMaxLength(256)
                .IsUnicode(false);
            entity.Property(e => e.SubmitterQlfrId)
                .HasMaxLength(2)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Encounter>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EncounterDate).HasColumnType("datetime");
            entity.Property(e => e.EncounterEndTime).HasPrecision(0);
            entity.Property(e => e.EncounterStartTime).HasPrecision(0);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EncounterCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Encounters_CreatedBy");

            entity.HasOne(d => d.DiagnosisCode).WithMany(p => p.Encounters)
                .HasForeignKey(d => d.DiagnosisCodeId)
                .HasConstraintName("FK_Encounters_DiagnosisCodes");

            entity.HasOne(d => d.EvaluationType).WithMany(p => p.Encounters)
                .HasForeignKey(d => d.EvaluationTypeId)
                .HasConstraintName("FK_Encounters_EvaluationType");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EncounterModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Encounters_ModifiedBy");

            entity.HasOne(d => d.NonMspServiceType).WithMany(p => p.Encounters)
                .HasForeignKey(d => d.NonMspServiceTypeId)
                .HasConstraintName("FK_Encounters_NonMspServices");

            entity.HasOne(d => d.Provider).WithMany(p => p.Encounters)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Encounters_Provider");

            entity.HasOne(d => d.ServiceType).WithMany(p => p.Encounters)
                .HasForeignKey(d => d.ServiceTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Encounters_ServiceType");
        });

        modelBuilder.Entity<EncounterIdentifier>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.EncounterIdentifiers)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterIdentifiers_SchoolDistricts");
        });

        modelBuilder.Entity<EncounterLocation>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EncounterReasonForReturn>(entity =>
        {
            entity.ToTable("EncounterReasonForReturn");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EncounterReasonForReturnCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterReasonForReturn_CreatedBy");

            entity.HasOne(d => d.HpcUser).WithMany(p => p.EncounterReasonForReturnHpcUsers)
                .HasForeignKey(d => d.HpcUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterReasonForReturn_HpcUser");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EncounterReasonForReturnModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EncounterReasonForReturn_ModifiedBy");

            entity.HasOne(d => d.ReturnReasonCategory).WithMany(p => p.EncounterReasonForReturns)
                .HasForeignKey(d => d.ReturnReasonCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterReasonForReturn_ReturnReasonCategories");
        });

        modelBuilder.Entity<EncounterReturnReasonCategory>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EncounterStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_EncounterStatusess");

            entity.Property(e => e.ForReview).HasDefaultValue(true);
            entity.Property(e => e.HpcadminOnly)
                .HasDefaultValue(true)
                .HasColumnName("HPCAdminOnly");
            entity.Property(e => e.IsAuditable).HasDefaultValue(true);
            entity.Property(e => e.IsBillable).HasDefaultValue(true);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EncounterStudent>(entity =>
        {
            entity.HasIndex(e => new { e.EncounterId, e.Archived }, "IX_EncounterId_Archived").HasFillFactor(100);

            entity.HasIndex(e => new { e.EncounterStatusId, e.SupervisorDateEsigned, e.EsignedById, e.Archived }, "IX_EncounterStudents_EncounterStatusId_SupervisorDateESigned_ESignedById_Archived");

            entity.HasIndex(e => new { e.StudentDeviationReasonId, e.EncounterId, e.EncounterStatusId, e.EsignedById, e.Archived }, "IX_EncounterStudents_StudentDeviationId_EncounterId_EncounterStatusId_ESignedById_Archived");

            entity.HasIndex(e => e.StudentId, "IX_EncounterStudents_StudentId");

            entity.HasIndex(e => e.StudentTherapyScheduleId, "IX_StudentTherapyScheduleId").HasFillFactor(100);

            entity.Property(e => e.AbandonmentNotes)
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateEsigned)
                .HasColumnType("datetime")
                .HasColumnName("DateESigned");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EncounterDate).HasColumnType("datetime");
            entity.Property(e => e.EncounterEndTime).HasPrecision(0);
            entity.Property(e => e.EncounterNumber)
                .HasMaxLength(14)
                .IsUnicode(false);
            entity.Property(e => e.EncounterStartTime).HasPrecision(0);
            entity.Property(e => e.EncounterStatusId).HasDefaultValue(1);
            entity.Property(e => e.EsignatureText)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("ESignatureText");
            entity.Property(e => e.EsignedById).HasColumnName("ESignedById");
            entity.Property(e => e.ReasonForReturn)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorComments)
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorDateEsigned)
                .HasColumnType("datetime")
                .HasColumnName("SupervisorDateESigned");
            entity.Property(e => e.SupervisorEsignatureText)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("SupervisorESignatureText");
            entity.Property(e => e.SupervisorEsignedById).HasColumnName("SupervisorESignedById");
            entity.Property(e => e.TherapyCaseNotes)
                .HasMaxLength(6000)
                .IsUnicode(false);

            entity.HasOne(d => d.CaseLoad).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.CaseLoadId)
                .HasConstraintName("FK_EncounterStudents_CaseLoad");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EncounterStudentCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudents_CreatedBy");

            entity.HasOne(d => d.DiagnosisCode).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.DiagnosisCodeId)
                .HasConstraintName("FK_EncounterStudents_DiagnosisCodes");

            entity.HasOne(d => d.DocumentType).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.DocumentTypeId)
                .HasConstraintName("FK_EncounterStudents_DocumentTypes");

            entity.HasOne(d => d.Encounter).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.EncounterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudents_Encounter");

            entity.HasOne(d => d.EncounterLocation).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.EncounterLocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudents_EncounterLocation");

            entity.HasOne(d => d.EncounterStatus).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.EncounterStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudents_EncounterStatus");

            entity.HasOne(d => d.EsignedBy).WithMany(p => p.EncounterStudentEsignedBies)
                .HasForeignKey(d => d.EsignedById)
                .HasConstraintName("FK_EncounterStudents_ESignedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EncounterStudentModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EncounterStudents_ModifiedBy");

            entity.HasOne(d => d.StudentDeviationReason).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.StudentDeviationReasonId)
                .HasConstraintName("FK_EncounterStudents_StudentDeviationReason");

            entity.HasOne(d => d.Student).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudents_Student");

            entity.HasOne(d => d.StudentTherapySchedule).WithMany(p => p.EncounterStudents)
                .HasForeignKey(d => d.StudentTherapyScheduleId)
                .HasConstraintName("FK_EncounterStudents_StudentTherapySchedules");

            entity.HasOne(d => d.SupervisorEsignedBy).WithMany(p => p.EncounterStudentSupervisorEsignedBies)
                .HasForeignKey(d => d.SupervisorEsignedById)
                .HasConstraintName("FK_EncounterStudents_SupervisorESignedBy");
        });

        modelBuilder.Entity<EncounterStudentCptCode>(entity =>
        {
            entity.HasIndex(e => e.EncounterStudentId, "IX_EncounterStudentCptCodes");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CptCode).WithMany(p => p.EncounterStudentCptCodes)
                .HasForeignKey(d => d.CptCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentCptCodes_CptCode");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EncounterStudentCptCodeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentCptCodes_CreatedBy");

            entity.HasOne(d => d.EncounterStudent).WithMany(p => p.EncounterStudentCptCodes)
                .HasForeignKey(d => d.EncounterStudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentCptCodes_EncounterStudent");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EncounterStudentCptCodeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EncounterStudentCptCodes_ModifiedBy");
        });

        modelBuilder.Entity<EncounterStudentGoal>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.NursingResponseNote)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.NursingResultNote)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ServiceOutcomes)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.CaseLoadScriptGoal).WithMany(p => p.EncounterStudentGoals)
                .HasForeignKey(d => d.CaseLoadScriptGoalId)
                .HasConstraintName("FK_EncounterStudentGoals_CaseLoadScriptGoals");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EncounterStudentGoalCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentGoals_CreatedBy");

            entity.HasOne(d => d.EncounterStudent).WithMany(p => p.EncounterStudentGoals)
                .HasForeignKey(d => d.EncounterStudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentGoals_EncounterStudent");

            entity.HasOne(d => d.Goal).WithMany(p => p.EncounterStudentGoals)
                .HasForeignKey(d => d.GoalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentGoals_Goal");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EncounterStudentGoalModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EncounterStudentGoals_ModifiedBy");

            entity.HasOne(d => d.NursingGoalResult).WithMany(p => p.EncounterStudentGoals)
                .HasForeignKey(d => d.NursingGoalResultId)
                .HasConstraintName("FK_EncounterStudentGoals_NursingGoalResult");
        });

        modelBuilder.Entity<EncounterStudentMethod>(entity =>
        {
            entity.HasIndex(e => new { e.EncounterStudentId, e.Archived }, "IX_EncounterStudentMethods_EncounterStudentId_Archived");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EncounterStudentMethodCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentMethods_CreatedBy");

            entity.HasOne(d => d.EncounterStudent).WithMany(p => p.EncounterStudentMethods)
                .HasForeignKey(d => d.EncounterStudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentMethods_EncounterStudent");

            entity.HasOne(d => d.Method).WithMany(p => p.EncounterStudentMethods)
                .HasForeignKey(d => d.MethodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentMethods_Method");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EncounterStudentMethodModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EncounterStudentMethods_ModifiedBy");
        });

        modelBuilder.Entity<EncounterStudentStatus>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EncounterStatusId).HasDefaultValue(1);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EncounterStudentStatuses)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentStatuses_CreatedBy");

            entity.HasOne(d => d.EncounterStatus).WithMany(p => p.EncounterStudentStatuses)
                .HasForeignKey(d => d.EncounterStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentStatuses_EncounterStatus");

            entity.HasOne(d => d.EncounterStudent).WithMany(p => p.EncounterStudentStatuses)
                .HasForeignKey(d => d.EncounterStudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EncounterStudentStatuses_EncounterStudent");
        });

        modelBuilder.Entity<Esc>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Notes)
                .HasMaxLength(1000)
                .IsUnicode(false);

            entity.HasOne(d => d.Address).WithMany(p => p.Escs)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK_Escs_Addresses");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EscCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Escs_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EscModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Escs_ModifiedBy");
        });

        modelBuilder.Entity<EscSchoolDistrict>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_EscSchoolDistrict");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EscSchoolDistrictCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EscSchoolDistricts_CreatedBy");

            entity.HasOne(d => d.Esc).WithMany(p => p.EscSchoolDistricts)
                .HasForeignKey(d => d.EscId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EscSchoolDistrict_Esc");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EscSchoolDistrictModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EscSchoolDistricts_ModifiedBy");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.EscSchoolDistricts)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EscSchoolDistrict_SchoolDistrict");
        });

        modelBuilder.Entity<EsignatureContent>(entity =>
        {
            entity.ToTable("ESignatureContents");

            entity.Property(e => e.Content)
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EvaluationType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_EvaluatonTypes");

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EvaluationTypesDiagnosisCode>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.EvaluationTypesDiagnosisCodeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EvaluationTypesDiagnosisCodes_CreatedBy");

            entity.HasOne(d => d.DiagnosisCode).WithMany(p => p.EvaluationTypesDiagnosisCodes)
                .HasForeignKey(d => d.DiagnosisCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EvaluationTypesDiagnosisCodes_DiagnosisCodes");

            entity.HasOne(d => d.EvaluationType).WithMany(p => p.EvaluationTypesDiagnosisCodes)
                .HasForeignKey(d => d.EvaluationTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EvaluationTypesDiagnosisCodes_EvaluationTypes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.EvaluationTypesDiagnosisCodeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_EvaluationTypesDiagnosisCodes_ModifiedBy");
        });

        modelBuilder.Entity<Goal>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.GoalCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Goals_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.GoalModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Goals_ModifiedBy");

            entity.HasOne(d => d.NursingResponse).WithMany(p => p.Goals)
                .HasForeignKey(d => d.NursingResponseId)
                .HasConstraintName("FK_Goals_NursingGoalResponse");

            entity.HasMany(d => d.ServiceCodes).WithMany(p => p.Goals)
                .UsingEntity<Dictionary<string, object>>(
                    "GoalServiceCode",
                    r => r.HasOne<ServiceCode>().WithMany()
                        .HasForeignKey("ServiceCodeId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_GoalServiceCodeServiceCodes"),
                    l => l.HasOne<Goal>().WithMany()
                        .HasForeignKey("GoalId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_GoalServiceCodeGoals"),
                    j =>
                    {
                        j.HasKey("GoalId", "ServiceCodeId");
                        j.ToTable("GoalServiceCodes");
                    });
        });

        modelBuilder.Entity<HealthCareClaim>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PageCount).HasDefaultValue(1);

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.HealthCareClaims)
                .HasForeignKey(d => d.BillingScheduleId)
                .HasConstraintName("FK_HealthCareClaims_BillingSchedules");
        });

        modelBuilder.Entity<Iepservice>(entity =>
        {
            entity.ToTable("IEPServices");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.Auddate)
                .HasColumnType("datetime")
                .HasColumnName("AUDDate");
            entity.Property(e => e.AudtotalMinutes)
                .HasDefaultValue(0)
                .HasColumnName("AUDTotalMinutes");
            entity.Property(e => e.Ccdate)
                .HasColumnType("datetime")
                .HasColumnName("CCDate");
            entity.Property(e => e.CctotalMinutes)
                .HasDefaultValue(0)
                .HasColumnName("CCTotalMinutes");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.EtrexpirationDate)
                .HasColumnType("datetime")
                .HasColumnName("ETRExpirationDate");
            entity.Property(e => e.NursingDate).HasColumnType("datetime");
            entity.Property(e => e.NursingTotalMinutes).HasDefaultValue(0);
            entity.Property(e => e.Otpdate)
                .HasColumnType("datetime")
                .HasColumnName("OTPDate");
            entity.Property(e => e.OtptotalMinutes)
                .HasDefaultValue(0)
                .HasColumnName("OTPTotalMinutes");
            entity.Property(e => e.Psydate)
                .HasColumnType("datetime")
                .HasColumnName("PSYDate");
            entity.Property(e => e.PsytotalMinutes)
                .HasDefaultValue(0)
                .HasColumnName("PSYTotalMinutes");
            entity.Property(e => e.Ptdate)
                .HasColumnType("datetime")
                .HasColumnName("PTDate");
            entity.Property(e => e.PttotalMinutes)
                .HasDefaultValue(0)
                .HasColumnName("PTTotalMinutes");
            entity.Property(e => e.Socdate)
                .HasColumnType("datetime")
                .HasColumnName("SOCDate");
            entity.Property(e => e.SoctotalMinutes)
                .HasDefaultValue(0)
                .HasColumnName("SOCTotalMinutes");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Stpdate)
                .HasColumnType("datetime")
                .HasColumnName("STPDate");
            entity.Property(e => e.StptotalMinutes)
                .HasDefaultValue(0)
                .HasColumnName("STPTotalMinutes");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.IepserviceCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IEPServices_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.IepserviceModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_IEPServices_ModifiedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.Iepservices)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IEPServices_Student");
        });

        modelBuilder.Entity<Image>(entity =>
        {
            entity.Property(e => e.ImagePath)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ThumbnailPath)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ImpersonationLog>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Impersonater).WithMany(p => p.ImpersonationLogs)
                .HasForeignKey(d => d.ImpersonaterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ImpersonationLogs_User");
        });

        modelBuilder.Entity<JobsAudit>(entity =>
        {
            entity.ToTable("JobsAudit");

            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.BillingSchedule).WithMany(p => p.JobsAudits)
                .HasForeignKey(d => d.BillingScheduleId)
                .HasConstraintName("FK_JobsAudit_BillingSchedule");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.JobsAudits)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_JobsAudit_CreatedBy");
        });

        modelBuilder.Entity<MergedStudent>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateOfBirth).HasColumnType("datetime");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MiddleName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StudentCode)
                .HasMaxLength(12)
                .IsUnicode(false);

            entity.HasOne(d => d.Address).WithMany(p => p.MergedStudents)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK_MergedStudents_Addresses");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.MergedStudents)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MergedStudents_CreatedBy");

            entity.HasOne(d => d.MergedToStudent).WithMany(p => p.MergedStudents)
                .HasForeignKey(d => d.MergedToStudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MergedStudents_Students");

            entity.HasOne(d => d.School).WithMany(p => p.MergedStudents)
                .HasForeignKey(d => d.SchoolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MergedStudents_School");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.Property(e => e.Body).HasColumnType("text");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.ValidTill).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.MessageCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Messages_CreatedBy");

            entity.HasOne(d => d.Esc).WithMany(p => p.Messages)
                .HasForeignKey(d => d.EscId)
                .HasConstraintName("FK_Message_Escs");

            entity.HasOne(d => d.MessageFilterType).WithMany(p => p.Messages)
                .HasForeignKey(d => d.MessageFilterTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Messages_MessageFilterTypes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.MessageModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Messages_ModifiedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ProviderId)
                .HasConstraintName("FK_Message_Providers");

            entity.HasOne(d => d.ProviderTitle).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ProviderTitleId)
                .HasConstraintName("FK_Message_ProviderTitles");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.Messages)
                .HasForeignKey(d => d.SchoolDistrictId)
                .HasConstraintName("FK_Message_SchoolDistricts");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ServiceCodeId)
                .HasConstraintName("FK_Message_ServiceCodes");
        });

        modelBuilder.Entity<MessageDocument>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.FileName)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.FilePath)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.ValidTill).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.MessageDocumentCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MessageDocuments_CreatedBy");

            entity.HasOne(d => d.Esc).WithMany(p => p.MessageDocuments)
                .HasForeignKey(d => d.EscId)
                .HasConstraintName("FK_MessageDocument_Escs");

            entity.HasOne(d => d.MessageFilterType).WithMany(p => p.MessageDocuments)
                .HasForeignKey(d => d.MessageFilterTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MessageDocuments_MessageFilterTypes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.MessageDocumentModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_MessageDocuments_ModifiedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.MessageDocuments)
                .HasForeignKey(d => d.ProviderId)
                .HasConstraintName("FK_MessageDocument_Providers");

            entity.HasOne(d => d.ProviderTitle).WithMany(p => p.MessageDocuments)
                .HasForeignKey(d => d.ProviderTitleId)
                .HasConstraintName("FK_MessageDocument_ProviderTitles");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.MessageDocuments)
                .HasForeignKey(d => d.SchoolDistrictId)
                .HasConstraintName("FK_MessageDocument_SchoolDistricts");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.MessageDocuments)
                .HasForeignKey(d => d.ServiceCodeId)
                .HasConstraintName("FK_MessageDocument_ServiceCodes");

            entity.HasOne(d => d.TrainingType).WithMany(p => p.MessageDocuments)
                .HasForeignKey(d => d.TrainingTypeId)
                .HasConstraintName("FK_MessageDocuments_TrainingType");
        });

        modelBuilder.Entity<MessageFilterType>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<MessageLink>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.Url)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("URL");
            entity.Property(e => e.ValidTill).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.MessageLinkCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MessageLinks_CreatedBy");

            entity.HasOne(d => d.Esc).WithMany(p => p.MessageLinks)
                .HasForeignKey(d => d.EscId)
                .HasConstraintName("FK_MessageLink_Escs");

            entity.HasOne(d => d.MessageFilterType).WithMany(p => p.MessageLinks)
                .HasForeignKey(d => d.MessageFilterTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MessageLinks_MessageFilterTypes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.MessageLinkModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_MessageLinks_ModifiedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.MessageLinks)
                .HasForeignKey(d => d.ProviderId)
                .HasConstraintName("FK_MessageLink_Providers");

            entity.HasOne(d => d.ProviderTitle).WithMany(p => p.MessageLinks)
                .HasForeignKey(d => d.ProviderTitleId)
                .HasConstraintName("FK_MessageLink_ProviderTitles");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.MessageLinks)
                .HasForeignKey(d => d.SchoolDistrictId)
                .HasConstraintName("FK_MessageLink_SchoolDistricts");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.MessageLinks)
                .HasForeignKey(d => d.ServiceCodeId)
                .HasConstraintName("FK_MessageLink_ServiceCodes");

            entity.HasOne(d => d.TrainingType).WithMany(p => p.MessageLinks)
                .HasForeignKey(d => d.TrainingTypeId)
                .HasConstraintName("FK_MessageLinks_TrainingType");
        });

        modelBuilder.Entity<Method>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<MigrationProviderCaseNotesHistory>(entity =>
        {
            entity.ToTable("Migration_ProviderCaseNotesHistory");

            entity.HasIndex(e => e.ProviderId, "IX_Migration_ProviderCaseNotesHistory_ProviderId");

            entity.Property(e => e.EncounterDate).HasColumnType("datetime");
            entity.Property(e => e.EncounterNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EndTime).HasColumnType("datetime");
            entity.Property(e => e.ProviderNotes).IsUnicode(false);
            entity.Property(e => e.StartTime).HasColumnType("datetime");

            entity.HasOne(d => d.Provider).WithMany(p => p.MigrationProviderCaseNotesHistories)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Migration_ProviderCaseNotesHistory_Provider");

            entity.HasOne(d => d.Student).WithMany(p => p.MigrationProviderCaseNotesHistories)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Migration_ProviderCaseNotesHistory_Student");
        });

        modelBuilder.Entity<NonMspService>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Note>(entity =>
        {
            entity.Property(e => e.NoteText)
                .HasMaxLength(5000)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
        });

        modelBuilder.Entity<NursingGoalResponse>(entity =>
        {
            entity.ToTable("NursingGoalResponse");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ResponseNoteLabel)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasMany(d => d.NursingGoalResults).WithMany(p => p.NursingGoalResponses)
                .UsingEntity<Dictionary<string, object>>(
                    "NursingGoalResponseResult",
                    r => r.HasOne<NursingGoalResult>().WithMany()
                        .HasForeignKey("NursingGoalResultId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_NursingGoalResponseResults_NursingGoalResults"),
                    l => l.HasOne<NursingGoalResponse>().WithMany()
                        .HasForeignKey("NursingGoalResponseId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_NursingGoalResponseResults_NursingGoalResponse"),
                    j =>
                    {
                        j.HasKey("NursingGoalResponseId", "NursingGoalResultId");
                        j.ToTable("NursingGoalResponseResults");
                    });
        });

        modelBuilder.Entity<NursingGoalResult>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PendingReferral>(entity =>
        {
            entity.Property(e => e.DistrictCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ProviderFirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ProviderLastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ProviderTitle)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ServiceName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StudentFirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StudentLastName)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.District).WithMany(p => p.PendingReferrals)
                .HasForeignKey(d => d.DistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PendingReferrals_SchoolDistricts");

            entity.HasOne(d => d.PendingReferralJobRun).WithMany(p => p.PendingReferrals)
                .HasForeignKey(d => d.PendingReferralJobRunId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PendingReferrals_PendingReferralJobRuns");

            entity.HasOne(d => d.Provider).WithMany(p => p.PendingReferrals)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PendingReferrals_Providers");

            entity.HasOne(d => d.ServiceType).WithMany(p => p.PendingReferrals)
                .HasForeignKey(d => d.ServiceTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PendingReferrals_ServiceTypes");

            entity.HasOne(d => d.Student).WithMany(p => p.PendingReferrals)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PendingReferrals_Students");
        });

        modelBuilder.Entity<PendingReferralReportJobRun>(entity =>
        {
            entity.Property(e => e.JobRunById).HasDefaultValue(1);
            entity.Property(e => e.JobRunDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.JobRunBy).WithMany(p => p.PendingReferralReportJobRuns)
                .HasForeignKey(d => d.JobRunById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PendingReferralReportJobRuns_Users");
        });

        modelBuilder.Entity<PhoneType>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ProgressReport>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateEsigned)
                .HasColumnType("datetime")
                .HasColumnName("DateESigned");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.EsignedById).HasColumnName("ESignedById");
            entity.Property(e => e.MedicalStatusChangeNotes)
                .HasMaxLength(5000)
                .IsUnicode(false);
            entity.Property(e => e.ProgressNotes)
                .HasMaxLength(5000)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.SupervisorDateEsigned)
                .HasColumnType("datetime")
                .HasColumnName("SupervisorDateESigned");
            entity.Property(e => e.SupervisorEsignedById).HasColumnName("SupervisorESignedById");
            entity.Property(e => e.TreatmentChangeNotes)
                .HasMaxLength(5000)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProgressReportCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProgressReports_CreatedBy");

            entity.HasOne(d => d.EsignedBy).WithMany(p => p.ProgressReportEsignedBies)
                .HasForeignKey(d => d.EsignedById)
                .HasConstraintName("FK_ProgressReports_ESignedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ProgressReportModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ProgressReports_ModifiedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.ProgressReports)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProgressReports_Student");

            entity.HasOne(d => d.SupervisorEsignedBy).WithMany(p => p.ProgressReportSupervisorEsignedBies)
                .HasForeignKey(d => d.SupervisorEsignedById)
                .HasConstraintName("FK_ProgressReports_SupervisorESignedBy");
        });

        modelBuilder.Entity<Provider>(entity =>
        {
            entity.HasIndex(e => e.ProviderUserId, "IX_Providers");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.BlockedReason)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.DocumentationDate)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Notes)
                .HasMaxLength(2000)
                .IsUnicode(false);
            entity.Property(e => e.Npi)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NPI");
            entity.Property(e => e.OrpapprovalDate)
                .HasColumnType("datetime")
                .HasColumnName("ORPApprovalDate");
            entity.Property(e => e.OrpapprovalRequestDate)
                .HasColumnType("datetime")
                .HasColumnName("ORPApprovalRequestDate");
            entity.Property(e => e.OrpdenialDate)
                .HasColumnType("datetime")
                .HasColumnName("ORPDenialDate");
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("(((0)-(0))-(0))");
            entity.Property(e => e.VerifiedOrp).HasColumnName("VerifiedORP");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Providers_CreatedBy");

            entity.HasOne(d => d.DoNotBillReason).WithMany(p => p.Providers)
                .HasForeignKey(d => d.DoNotBillReasonId)
                .HasConstraintName("FK_Providers_DoNotBillReason");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ProviderModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Providers_ModifiedBy");

            entity.HasOne(d => d.ProviderEmploymentType).WithMany(p => p.Providers)
                .HasForeignKey(d => d.ProviderEmploymentTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Providers_ProviderEmploymentTypes");

            entity.HasOne(d => d.ProviderUser).WithMany(p => p.ProviderProviderUsers)
                .HasForeignKey(d => d.ProviderUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Providers_ProviderUser");

            entity.HasOne(d => d.Title).WithMany(p => p.Providers)
                .HasForeignKey(d => d.TitleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Providers_ProviderTitle");
        });

        modelBuilder.Entity<ProviderAcknowledgmentLog>(entity =>
        {
            entity.Property(e => e.DateAcknowledged).HasColumnType("datetime");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderAcknowledgmentLogs)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderAcknowledgmentLogs_Providers");
        });

        modelBuilder.Entity<ProviderCaseUpload>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.DateOfBirth).IsUnicode(false);
            entity.Property(e => e.FirstName).IsUnicode(false);
            entity.Property(e => e.Grade).IsUnicode(false);
            entity.Property(e => e.HasDataIssues).HasDefaultValue(false);
            entity.Property(e => e.HasDuplicates).HasDefaultValue(false);
            entity.Property(e => e.LastName).IsUnicode(false);
            entity.Property(e => e.MiddleName).IsUnicode(false);
            entity.Property(e => e.School).IsUnicode(false);

            entity.HasOne(d => d.District).WithMany(p => p.ProviderCaseUploads)
                .HasForeignKey(d => d.DistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderCaseUploads_SchoolDistricts");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ProviderCaseUploads)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ProviderCaseUploads_ModifiedBy");

            entity.HasOne(d => d.ProviderCaseUploadDocument).WithMany(p => p.ProviderCaseUploads)
                .HasForeignKey(d => d.ProviderCaseUploadDocumentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderCaseUploads_ProviderCaseUploadDocuments");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderCaseUploads)
                .HasForeignKey(d => d.ProviderId)
                .HasConstraintName("FK_ProviderCaseUploads_Providers");

            entity.HasOne(d => d.Student).WithMany(p => p.ProviderCaseUploads)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK_ProviderCaseUploads_Students");
        });

        modelBuilder.Entity<ProviderCaseUploadDocument>(entity =>
        {
            entity.Property(e => e.DateError).HasColumnType("datetime");
            entity.Property(e => e.DateProcessed).HasColumnType("datetime");
            entity.Property(e => e.DateUpload)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.District).WithMany(p => p.ProviderCaseUploadDocuments)
                .HasForeignKey(d => d.DistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderCaseUploadDocuments_SchoolDistricts");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.ProviderCaseUploadDocuments)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK_ProviderCaseUploadDocuments_Users");
        });

        modelBuilder.Entity<ProviderDoNotBillReason>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ProviderEmploymentType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ProviderEscAssignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ProviderEscs");

            entity.HasIndex(e => new { e.ProviderId, e.Archived }, "IX_ProviderEscAssignments_ProviderId_Archived");

            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Agency).WithMany(p => p.ProviderEscAssignments)
                .HasForeignKey(d => d.AgencyId)
                .HasConstraintName("FK_ProviderEscs_Agencies");

            entity.HasOne(d => d.AgencyType).WithMany(p => p.ProviderEscAssignments)
                .HasForeignKey(d => d.AgencyTypeId)
                .HasConstraintName("FK_ProviderEscs_AgencyType");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderEscAssignmentCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_ProviderEscs_CreatedBy");

            entity.HasOne(d => d.Esc).WithMany(p => p.ProviderEscAssignments)
                .HasForeignKey(d => d.EscId)
                .HasConstraintName("FK_ProviderEscs_Esc");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ProviderEscAssignmentModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ProviderEscs_ModifiedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderEscAssignments)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderEscs_Providers");
        });

        modelBuilder.Entity<ProviderEscSchoolDistrict>(entity =>
        {
            entity.HasIndex(e => e.ProviderEscAssignmentId, "IX_ProviderEscSchoolDistricts_ProviderEscAssignmentId");

            entity.HasIndex(e => e.SchoolDistrictId, "IX_ProviderEscSchoolDistricts_SchoolDistrictId");

            entity.HasOne(d => d.ProviderEscAssignment).WithMany(p => p.ProviderEscSchoolDistricts)
                .HasForeignKey(d => d.ProviderEscAssignmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderEscSchoolDistricts_ProviderEsc");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.ProviderEscSchoolDistricts)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderEscSchoolDistricts_SchoolDistrict");
        });

        modelBuilder.Entity<ProviderInactivityDate>(entity =>
        {
            entity.Property(e => e.ProviderDoNotBillReasonId).HasDefaultValue(1);
            entity.Property(e => e.ProviderInactivityEndDate).HasColumnType("datetime");
            entity.Property(e => e.ProviderInactivityStartDate).HasColumnType("datetime");

            entity.HasOne(d => d.ProviderDoNotBillReason).WithMany(p => p.ProviderInactivityDates)
                .HasForeignKey(d => d.ProviderDoNotBillReasonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderInactivityDates_ProviderDoNotBillReasons");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderInactivityDates)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderInactivityDates_Providers");
        });

        modelBuilder.Entity<ProviderInactivityReason>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ProviderLicense>(entity =>
        {
            entity.Property(e => e.AsOfDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
            entity.Property(e => e.License)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderLicenses)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderLicenses_CreatedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderLicenses)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderLicenses_Providers");
        });

        modelBuilder.Entity<ProviderOdecertification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ProviderODECertifiactions");

            entity.ToTable("ProviderODECertifications");

            entity.Property(e => e.AsOfDate).HasColumnType("datetime");
            entity.Property(e => e.CertificationNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("0");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderOdecertifications)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderODECertifiactions_CreatedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderOdecertifications)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderODECertifiactions_Providers");
        });

        modelBuilder.Entity<ProviderStudent>(entity =>
        {
            entity.HasIndex(e => e.ProviderId, "IX_ProviderStudents_ProviderId");

            entity.HasIndex(e => new { e.StudentId, e.ProviderId }, "IX_ProviderStudents_StudentId_ProviderId");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderStudents)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudents_CreatedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderStudents)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudents_Providers");

            entity.HasOne(d => d.Student).WithMany(p => p.ProviderStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudents_Students");
        });

        modelBuilder.Entity<ProviderStudentHistory>(entity =>
        {
            entity.Property(e => e.DateArchived).HasColumnType("datetime");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderStudentHistories)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudentHistories_Providers");

            entity.HasOne(d => d.Student).WithMany(p => p.ProviderStudentHistories)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudentHistories_Students");
        });

        modelBuilder.Entity<ProviderStudentSupervisor>(entity =>
        {
            entity.HasIndex(e => e.AssistantId, "IX_ProviderStudentSupervisors_AssistantId");

            entity.HasIndex(e => new { e.StudentId, e.SupervisorId, e.EffectiveEndDate }, "IX_ProviderStudentSupervisors_StudentId_SupervisorId_EffectiveEndDate");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EffectiveEndDate).HasColumnType("datetime");
            entity.Property(e => e.EffectiveStartDate).HasColumnType("datetime");

            entity.HasOne(d => d.Assistant).WithMany(p => p.ProviderStudentSupervisorAssistants)
                .HasForeignKey(d => d.AssistantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudentSupervisors_Assistant");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderStudentSupervisorCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudentSupervisors_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ProviderStudentSupervisorModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ProviderStudentSupervisors_ModifiedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.ProviderStudentSupervisors)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudentSupervisors_Students");

            entity.HasOne(d => d.Supervisor).WithMany(p => p.ProviderStudentSupervisorSupervisors)
                .HasForeignKey(d => d.SupervisorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderStudentSupervisors_Supervisor");
        });

        modelBuilder.Entity<ProviderTitle>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderTitleCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderTitles_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ProviderTitleModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ProviderTitles_ModifiedBy");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.ProviderTitles)
                .HasForeignKey(d => d.ServiceCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderTitles_ServiceCodes");

            entity.HasOne(d => d.SupervisorTitle).WithMany(p => p.InverseSupervisorTitle)
                .HasForeignKey(d => d.SupervisorTitleId)
                .HasConstraintName("FK_ProviderTitle_SupervisorTitle");
        });

        modelBuilder.Entity<ProviderTraining>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCompleted).HasColumnType("datetime");
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.LastReminder).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ProviderTrainings)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderTrainings_CreatedBy");

            entity.HasOne(d => d.Document).WithMany(p => p.ProviderTrainings)
                .HasForeignKey(d => d.DocumentId)
                .HasConstraintName("FK_ProviderTrainings_MessageDocument");

            entity.HasOne(d => d.Link).WithMany(p => p.ProviderTrainings)
                .HasForeignKey(d => d.LinkId)
                .HasConstraintName("FK_ProviderTrainings_MessageLink");

            entity.HasOne(d => d.Provider).WithMany(p => p.ProviderTrainings)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProviderTrainings_Provider");
        });

        modelBuilder.Entity<ReadMessage>(entity =>
        {
            entity.Property(e => e.DateRead)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Message).WithMany(p => p.ReadMessages)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ReadMessages_Message");

            entity.HasOne(d => d.ReadBy).WithMany(p => p.ReadMessages)
                .HasForeignKey(d => d.ReadById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ReadMessages_ReadBy");
        });

        modelBuilder.Entity<RevokeAccess>(entity =>
        {
            entity.ToTable("RevokeAccess");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.AccessGranted).HasDefaultValue(false);
            entity.Property(e => e.Date)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.OtherReason)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.Provider).WithMany(p => p.RevokeAccesses)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RevokeAccess_Providers");

            entity.HasOne(d => d.RevocationReason).WithMany(p => p.RevokeAccesses)
                .HasForeignKey(d => d.RevocationReasonId)
                .HasConstraintName("FK_RevokeAccess_ProviderDoNotBillReasons");
        });

        modelBuilder.Entity<RosterValidation>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PageCount).HasDefaultValue(1);
        });

        modelBuilder.Entity<RosterValidationDistrict>(entity =>
        {
            entity.Property(e => e.Address)
                .HasMaxLength(55)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.DistrictOrganizationName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.EmployerId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IdentificationCode)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false);

            entity.HasOne(d => d.RosterValidation).WithMany(p => p.RosterValidationDistricts)
                .HasForeignKey(d => d.RosterValidationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterValidationDistricts_RosterValidations");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.RosterValidationDistricts)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterValidationDistricts_SchoolDistrict");
        });

        modelBuilder.Entity<RosterValidationFile>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.PageNumber).HasDefaultValue(1);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.RosterValidationFiles)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_RosterValidationFiles_Users");

            entity.HasOne(d => d.RosterValidation).WithMany(p => p.RosterValidationFiles)
                .HasForeignKey(d => d.RosterValidationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterValidationFiles_RosterValidation");
        });

        modelBuilder.Entity<RosterValidationResponseFile>(entity =>
        {
            entity.Property(e => e.DateUploaded)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.RosterValidationFile).WithMany(p => p.RosterValidationResponseFiles)
                .HasForeignKey(d => d.RosterValidationFileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterValidationResponseFiles_RosterValidationFile");

            entity.HasOne(d => d.UploadedBy).WithMany(p => p.RosterValidationResponseFiles)
                .HasForeignKey(d => d.UploadedById)
                .HasConstraintName("FK_RosterValidationResponseFiles_Users");
        });

        modelBuilder.Entity<RosterValidationStudent>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.Address)
                .HasMaxLength(55)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.FollowUpActionCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.IdentificationCode)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.InsuredDateTimePeriod)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ReferenceId)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.RejectReasonCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false);

            entity.HasOne(d => d.RosterValidationDistrict).WithMany(p => p.RosterValidationStudents)
                .HasForeignKey(d => d.RosterValidationDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterValidationStudents_RosterValidationDistrict");

            entity.HasOne(d => d.Student).WithMany(p => p.RosterValidationStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RosterValidationStudents_Student");
        });

        modelBuilder.Entity<School>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.SchoolCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Schools_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.SchoolModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Schools_ModifiedBy");
        });

        modelBuilder.Entity<SchoolDistrict>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.ActiveStatus).HasDefaultValue(true);
            entity.Property(e => e.BecameClientDate).HasColumnType("datetime");
            entity.Property(e => e.BecameTradingPartnerDate).HasColumnType("datetime");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Einnumber)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("EINNumber");
            entity.Property(e => e.Irnnumber)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("IRNNumber");
            entity.Property(e => e.Name)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Notes)
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.NotesRequiredDate).HasColumnType("datetime");
            entity.Property(e => e.Npinumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NPINumber");
            entity.Property(e => e.ProgressReportsSent).HasColumnType("datetime");
            entity.Property(e => e.ProviderNumber)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.RevalidationDate).HasColumnType("datetime");
            entity.Property(e => e.ValidationExpirationDate).HasColumnType("datetime");

            entity.HasOne(d => d.AccountAssistant).WithMany(p => p.SchoolDistrictAccountAssistants)
                .HasForeignKey(d => d.AccountAssistantId)
                .HasConstraintName("FK_SchoolDistricts_AccountAssistant");

            entity.HasOne(d => d.AccountManager).WithMany(p => p.SchoolDistrictAccountManagers)
                .HasForeignKey(d => d.AccountManagerId)
                .HasConstraintName("FK_SchoolDistricts_AccountManager");

            entity.HasOne(d => d.Address).WithMany(p => p.SchoolDistricts)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK_SchoolDistricts_Addresses");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.SchoolDistrictCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistricts_CreatedBy");

            entity.HasOne(d => d.Mer).WithMany(p => p.SchoolDistricts)
                .HasForeignKey(d => d.MerId)
                .HasConstraintName("FK_SchoolDistricts_MerFile");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.SchoolDistrictModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_SchoolDistricts_ModifiedBy");

            entity.HasOne(d => d.SpecialEducationDirector).WithMany(p => p.SchoolDistrictSpecialEducationDirectors)
                .HasForeignKey(d => d.SpecialEducationDirectorId)
                .HasConstraintName("FK_SchoolDistricts_SpecialEducationDirector");

            entity.HasOne(d => d.Treasurer).WithMany(p => p.SchoolDistrictTreasurers)
                .HasForeignKey(d => d.TreasurerId)
                .HasConstraintName("FK_SchoolDistricts_Treasurer");

            entity.HasMany(d => d.Contacts).WithMany(p => p.SchoolDistricts)
                .UsingEntity<Dictionary<string, object>>(
                    "SchoolDistrictContact",
                    r => r.HasOne<Contact>().WithMany()
                        .HasForeignKey("ContactId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_SchoolDistrictContacts_Contacts"),
                    l => l.HasOne<SchoolDistrict>().WithMany()
                        .HasForeignKey("SchoolDistrictId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_SchoolDistrictContacts_SchoolDistricts"),
                    j =>
                    {
                        j.HasKey("SchoolDistrictId", "ContactId");
                        j.ToTable("SchoolDistrictContacts");
                    });
        });

        modelBuilder.Entity<SchoolDistrictProviderCaseNote>(entity =>
        {
            entity.HasOne(d => d.ProviderTitle).WithMany(p => p.SchoolDistrictProviderCaseNotes)
                .HasForeignKey(d => d.ProviderTitleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictProviderCaseNotes_Providers");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.SchoolDistrictProviderCaseNotes)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictProviderCaseNotes_SchoolDistricts");
        });

        modelBuilder.Entity<SchoolDistrictRoster>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.Address1).IsUnicode(false);
            entity.Property(e => e.Address2).IsUnicode(false);
            entity.Property(e => e.City).IsUnicode(false);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.DateOfBirth).IsUnicode(false);
            entity.Property(e => e.FirstName).IsUnicode(false);
            entity.Property(e => e.Grade).IsUnicode(false);
            entity.Property(e => e.HasDataIssues).HasDefaultValue(false);
            entity.Property(e => e.HasDuplicates).HasDefaultValue(false);
            entity.Property(e => e.LastName).IsUnicode(false);
            entity.Property(e => e.MiddleName).IsUnicode(false);
            entity.Property(e => e.SchoolBuilding).IsUnicode(false);
            entity.Property(e => e.StateCode).IsUnicode(false);
            entity.Property(e => e.StudentCode).IsUnicode(false);
            entity.Property(e => e.Zip).IsUnicode(false);

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.SchoolDistrictRosters)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_SchoolDistrictRosters_ModifiedBy");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.SchoolDistrictRosters)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictRosters_SchoolDistricts");

            entity.HasOne(d => d.SchoolDistrictRosterDocument).WithMany(p => p.SchoolDistrictRosters)
                .HasForeignKey(d => d.SchoolDistrictRosterDocumentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictRosters_SchoolDistrictRosterDocuments");

            entity.HasOne(d => d.Student).WithMany(p => p.SchoolDistrictRosters)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK_SchoolDistrictRosters_Students");
        });

        modelBuilder.Entity<SchoolDistrictRosterDocument>(entity =>
        {
            entity.Property(e => e.DateError).HasColumnType("datetime");
            entity.Property(e => e.DateProcessed).HasColumnType("datetime");
            entity.Property(e => e.DateUpload)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FilePath)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.SchoolDistrictRosterDocuments)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictRosterDocuments_SchoolDistricts");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.SchoolDistrictRosterDocuments)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK_SchoolDistrictRosterDocuments_Users");
        });

        modelBuilder.Entity<SchoolDistrictsAccountAssistant>(entity =>
        {
            entity.HasOne(d => d.AccountAssistant).WithMany(p => p.SchoolDistrictsAccountAssistants)
                .HasForeignKey(d => d.AccountAssistantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictsAccountAssistants_AccountAssistant");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.SchoolDistrictsAccountAssistants)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictsAccountAssistants_SchoolDistrict");
        });

        modelBuilder.Entity<SchoolDistrictsFinancialRep>(entity =>
        {
            entity.HasOne(d => d.FinancialRep).WithMany(p => p.SchoolDistrictsFinancialReps)
                .HasForeignKey(d => d.FinancialRepId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictsFinancialReps_FinancialRep");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.SchoolDistrictsFinancialReps)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictsFinancialReps_SchoolDistrict");
        });

        modelBuilder.Entity<SchoolDistrictsSchool>(entity =>
        {
            entity.HasIndex(e => e.SchoolDistrictId, "IX_SchoolDistrictsSchools_SchoolDistrictId");

            entity.HasIndex(e => e.SchoolId, "IX_SchoolDistrictsSchools_SchoolId");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.SchoolDistrictsSchoolCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictsSchools_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.SchoolDistrictsSchoolModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_SchoolDistrictsSchools_ModifiedBy");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.SchoolDistrictsSchools)
                .HasForeignKey(d => d.SchoolDistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictsSchools_SchoolDistricts");

            entity.HasOne(d => d.School).WithMany(p => p.SchoolDistrictsSchools)
                .HasForeignKey(d => d.SchoolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SchoolDistrictsSchools_Schools");
        });

        modelBuilder.Entity<ServiceCode>(entity =>
        {
            entity.Property(e => e.Area)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ServiceOutcome>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Notes)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ServiceOutcomeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_ServiceOutcomes_CreatedBy");

            entity.HasOne(d => d.Goal).WithMany(p => p.ServiceOutcomes)
                .HasForeignKey(d => d.GoalId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ServiceOutcomes_Goal");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ServiceOutcomeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ServiceOutcomes_ModifiedBy");
        });

        modelBuilder.Entity<ServiceType>(entity =>
        {
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ServiceUnitRule>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EffectiveDate).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.CptCode).WithMany(p => p.ServiceUnitRules)
                .HasForeignKey(d => d.CptCodeId)
                .HasConstraintName("FK_ServiceUnitRules_CptCode");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ServiceUnitRuleCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_ServiceUnitRules_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ServiceUnitRuleModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ServiceUnitRules_ModifiedBy");
        });

        modelBuilder.Entity<ServiceUnitTimeSegment>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.ServiceUnitTimeSegmentCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_ServiceUnitTimeSegments_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.ServiceUnitTimeSegmentModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_ServiceUnitTimeSegments_ModifiedBy");

            entity.HasOne(d => d.ServiceUnitRule).WithMany(p => p.ServiceUnitTimeSegments)
                .HasForeignKey(d => d.ServiceUnitRuleId)
                .HasConstraintName("FK_ServiceUnitTimeSegments_ServiceUnitRule");
        });

        modelBuilder.Entity<Setting>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.Value)
                .IsUnicode(false)
                .HasDefaultValue("");
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.StateCode);

            entity.Property(e => e.StateCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Name)
                .HasMaxLength(64)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasIndex(e => new { e.DistrictId, e.Archived }, "IX_Students_DistrictId_Archived");

            entity.HasIndex(e => new { e.SchoolId, e.Archived }, "IX_Students_SchoolId_Archived");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.DateOfBirth).HasColumnType("datetime");
            entity.Property(e => e.EnrollmentDate)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grade)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MedicaidNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.MiddleName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Notes)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.StudentCode)
                .HasMaxLength(12)
                .IsUnicode(false);

            entity.HasOne(d => d.Address).WithMany(p => p.Students)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK_Students_Addresses");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.StudentCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Students_CreatedBy");

            entity.HasOne(d => d.District).WithMany(p => p.Students)
                .HasForeignKey(d => d.DistrictId)
                .HasConstraintName("FK_Students_SchoolDistrict");

            entity.HasOne(d => d.Esc).WithMany(p => p.Students)
                .HasForeignKey(d => d.EscId)
                .HasConstraintName("FK_Students_Esc");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.StudentModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Students_ModifiedBy");

            entity.HasOne(d => d.School).WithMany(p => p.Students)
                .HasForeignKey(d => d.SchoolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Students_School");
        });

        modelBuilder.Entity<StudentDeviationReason>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<StudentDisabilityCode>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.StudentDisabilityCodeCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentDisabilityCodes_CreatedBy");

            entity.HasOne(d => d.DisabilityCode).WithMany(p => p.StudentDisabilityCodes)
                .HasForeignKey(d => d.DisabilityCodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentDisabilityCodes_DisabilityCodes");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.StudentDisabilityCodeModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_StudentDisabilityCodes_ModifiedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentDisabilityCodes)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentDisabilityCodes_Student");
        });

        modelBuilder.Entity<StudentDistrictWithdrawal>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EnrollmentDate).HasColumnType("datetime");
            entity.Property(e => e.WithdrawalDate).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.StudentDistrictWithdrawalCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentDistrictWithdrawals_CreatedBy");

            entity.HasOne(d => d.District).WithMany(p => p.StudentDistrictWithdrawals)
                .HasForeignKey(d => d.DistrictId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentDistrictWithdrawals_SchoolDistrict");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.StudentDistrictWithdrawalModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_StudentDistrictWithdrawals_ModifiedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentDistrictWithdrawals)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentDistrictWithdrawals_Student");
        });

        modelBuilder.Entity<StudentParentalConsent>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.ParentalConsentDateEntered)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ParentalConsentEffectiveDate).HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.StudentParentalConsentCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentParentalConsents_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.StudentParentalConsentModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_StudentParentalConsents_ModifiedBy");

            entity.HasOne(d => d.ParentalConsentType).WithMany(p => p.StudentParentalConsents)
                .HasForeignKey(d => d.ParentalConsentTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentParentalConsents_StudentParentalConsentType");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentParentalConsents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentParentalConsents_Student");
        });

        modelBuilder.Entity<StudentParentalConsentType>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<StudentTherapy>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.SessionName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");

            entity.HasOne(d => d.CaseLoad).WithMany(p => p.StudentTherapies)
                .HasForeignKey(d => d.CaseLoadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentTherapies_CaseLoad");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.StudentTherapyCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentTherapies_CreatedBy");

            entity.HasOne(d => d.EncounterLocation).WithMany(p => p.StudentTherapies)
                .HasForeignKey(d => d.EncounterLocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentTherapies_EncounterLocation");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.StudentTherapyModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_StudentTherapies_ModifiedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.StudentTherapies)
                .HasForeignKey(d => d.ProviderId)
                .HasConstraintName("FK_StudentTherapies_Provider");

            entity.HasOne(d => d.TherapyGroup).WithMany(p => p.StudentTherapies)
                .HasForeignKey(d => d.TherapyGroupId)
                .HasConstraintName("FK_StudentTherapies_TherapyGroup");
        });

        modelBuilder.Entity<StudentTherapySchedule>(entity =>
        {
            entity.HasIndex(e => e.DeviationReasonId, "IX_StudentTherapySchedules");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.DeviationReasonDate).HasColumnType("datetime");
            entity.Property(e => e.ScheduleDate).HasColumnType("datetime");
            entity.Property(e => e.ScheduleEndTime).HasPrecision(0);
            entity.Property(e => e.ScheduleStartTime).HasPrecision(0);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.StudentTherapyScheduleCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentTherapySchedules_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.StudentTherapyScheduleModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_StudentTherapySchedules_ModifiedBy");

            entity.HasOne(d => d.StudentTherapy).WithMany(p => p.StudentTherapySchedules)
                .HasForeignKey(d => d.StudentTherapyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentTherapySchedules_StudentTherapy");
        });

        modelBuilder.Entity<StudentType>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SupervisorProviderStudentReferalSignOff>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_SupervisorProviderStudentReferalSignOff");

            entity.HasIndex(e => new { e.StudentId, e.SignOffDate }, "IX_SupervisorProviderStudentReferalSignOffs_1");

            entity.HasIndex(e => e.StudentId, "IX_SupervisorProviderStudentReferalSignOffs_2");

            entity.HasIndex(e => new { e.StudentId, e.ServiceCodeId }, "IX_SupervisorProviderStudentReferalSignOffs_StudentId_ServiceCodeId");

            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EffectiveDateFrom).HasColumnType("datetime");
            entity.Property(e => e.EffectiveDateTo).HasColumnType("datetime");
            entity.Property(e => e.SignOffDate).HasColumnType("datetime");
            entity.Property(e => e.SignOffText)
                .HasMaxLength(1000)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.SupervisorProviderStudentReferalSignOffCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SupervisorProviderStudentReferalSignOff_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.SupervisorProviderStudentReferalSignOffModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_SupervisorProviderStudentReferalSignOff_ModifiedBy");

            entity.HasOne(d => d.ServiceCode).WithMany(p => p.SupervisorProviderStudentReferalSignOffs)
                .HasForeignKey(d => d.ServiceCodeId)
                .HasConstraintName("FK_SupervisorProviderStudentReferalSignOff_ServiceCode");

            entity.HasOne(d => d.SignedOffBy).WithMany(p => p.SupervisorProviderStudentReferalSignOffSignedOffBies)
                .HasForeignKey(d => d.SignedOffById)
                .HasConstraintName("FK_SupervisorProviderStudentReferalSignOff_SignedOffBy");

            entity.HasOne(d => d.Student).WithMany(p => p.SupervisorProviderStudentReferalSignOffs)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SupervisorProviderStudentReferalSignOff_Student");

            entity.HasOne(d => d.Supervisor).WithMany(p => p.SupervisorProviderStudentReferalSignOffs)
                .HasForeignKey(d => d.SupervisorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SupervisorProviderStudentReferalSignOff_Supervisor");
        });

        modelBuilder.Entity<TherapyCaseNote>(entity =>
        {
            entity.HasIndex(e => e.ProviderId, "IX_TherapyCaseNotes_ProviderId");

            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Notes)
                .HasMaxLength(6000)
                .IsUnicode(false);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.TherapyCaseNotes)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TherapyCaseNotes_User");

            entity.HasOne(d => d.Provider).WithMany(p => p.TherapyCaseNotes)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TherapyCaseNotes_Provider");
        });

        modelBuilder.Entity<TherapyGroup>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated).HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.EndDate)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.TherapyGroupCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TherapyGroups_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.TherapyGroupModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_TherapyGroups_ModifiedBy");

            entity.HasOne(d => d.Provider).WithMany(p => p.TherapyGroups)
                .HasForeignKey(d => d.ProviderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TherapyGroups_Provider");
        });

        modelBuilder.Entity<TrainingType>(entity =>
        {
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UnmatchedClaimDistrict>(entity =>
        {
            entity.Property(e => e.Address)
                .HasMaxLength(55)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.DistrictOrganizationName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.EmployerId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IdentificationCode)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false);

            entity.HasOne(d => d.ResponseFile).WithMany(p => p.UnmatchedClaimDistricts)
                .HasForeignKey(d => d.ResponseFileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UnmatchedClaimDistricts_ResponseFile");
        });

        modelBuilder.Entity<UnmatchedClaimResponse>(entity =>
        {
            entity.Property(e => e.AdjustmentAmount)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.AdjustmentReasonCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ClaimAmount)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.ClaimId)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.PaidAmount)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.PatientFirstName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.PatientId)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.PatientLastName)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.ProcedureIdentifier)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ReferenceNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ServiceDate).HasColumnType("datetime");
            entity.Property(e => e.VoucherDate).HasColumnType("datetime");

            entity.HasOne(d => d.District).WithMany(p => p.UnmatchedClaimResponses)
                .HasForeignKey(d => d.DistrictId)
                .HasConstraintName("FK_UnmatchedClaimResponses_District");

            entity.HasOne(d => d.EdiErrorCode).WithMany(p => p.UnmatchedClaimResponses)
                .HasForeignKey(d => d.EdiErrorCodeId)
                .HasConstraintName("FK_UnmatchedClaimResponses_EdiErrorCode");

            entity.HasOne(d => d.ResponseFile).WithMany(p => p.UnmatchedClaimResponses)
                .HasForeignKey(d => d.ResponseFileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UnmatchedClaimResponses_ResponseFile");

            entity.HasOne(d => d.UnmatchedDistrict).WithMany(p => p.UnmatchedClaimResponses)
                .HasForeignKey(d => d.UnmatchedDistrictId)
                .HasConstraintName("FK_UnmatchedClaimResponses_UnmatchedDistrict");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();

            entity.HasOne(d => d.Address).WithMany(p => p.Users)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK_Users_Addresses");

            entity.HasOne(d => d.AuthUser).WithMany(p => p.Users)
                .HasForeignKey(d => d.AuthUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_AuthUsers");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.InverseCreatedBy)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_Users_CreatedBy");

            entity.HasOne(d => d.Image).WithMany(p => p.Users)
                .HasForeignKey(d => d.ImageId)
                .HasConstraintName("FK_Users_Images");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.InverseModifiedBy)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_Users_ModifiedBy");

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.Users)
                .HasForeignKey(d => d.SchoolDistrictId)
                .HasConstraintName("FK_Users_SchoolDistrict");

            entity.HasMany(d => d.Districts).WithMany(p => p.DistrictAdmins)
                .UsingEntity<Dictionary<string, object>>(
                    "SchoolDistrictAdmin",
                    r => r.HasOne<SchoolDistrict>().WithMany()
                        .HasForeignKey("DistrictId")
                        .OnDelete(DeleteBehavior.ClientSetNull),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("DistrictAdminId")
                        .OnDelete(DeleteBehavior.ClientSetNull),
                    j =>
                    {
                        j.HasKey("DistrictAdminId", "DistrictId");
                        j.ToTable("SchoolDistrictAdmins");
                    });

            entity.HasMany(d => d.DocumentsNavigation).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserDocument",
                    r => r.HasOne<Document>().WithMany()
                        .HasForeignKey("DocumentId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_UserDocuments_Documents"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_UserDocuments_Users"),
                    j =>
                    {
                        j.HasKey("UserId", "DocumentId");
                        j.ToTable("UserDocuments");
                    });
        });

        modelBuilder.Entity<UserPhone>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.Phone });

            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Extension)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasDefaultValue("");

            entity.HasOne(d => d.PhoneType).WithMany(p => p.UserPhones)
                .HasForeignKey(d => d.PhoneTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserPhones_PhoneTypes");

            entity.HasOne(d => d.User).WithMany(p => p.UserPhones)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserPhones_Users");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateModified).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.IsEditable).HasDefaultValue(true);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserTypeId).HasDefaultValue(1);

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.UserRoleCreatedBies)
                .HasForeignKey(d => d.CreatedById)
                .HasConstraintName("FK_UserRoles_CreatedBy");

            entity.HasOne(d => d.ModifiedBy).WithMany(p => p.UserRoleModifiedBies)
                .HasForeignKey(d => d.ModifiedById)
                .HasConstraintName("FK_UserRoles_ModifiedBy");

            entity.HasOne(d => d.UserType).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.UserTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRoles_UserType");
        });

        modelBuilder.Entity<UserRoleClaim>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.ClaimValueId, e.ClaimTypeId });

            entity.HasOne(d => d.ClaimType).WithMany(p => p.UserRoleClaims)
                .HasForeignKey(d => d.ClaimTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRoleClaims_ClaimTypes");

            entity.HasOne(d => d.ClaimValue).WithMany(p => p.UserRoleClaims)
                .HasForeignKey(d => d.ClaimValueId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRoleClaims_ClaimValues");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoleClaims)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRoleClaims_UserRoles");
        });

        modelBuilder.Entity<UserType>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.Property(e => e.Id).HasComment("Module");
            entity.Property(e => e.PaidAmount)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.SchoolYear)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.ServiceCode)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.VoucherAmount)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.VoucherDate).HasColumnType("datetime");
            entity.Property(e => e.VoucherTypeId).HasDefaultValue(1);

            entity.HasOne(d => d.SchoolDistrict).WithMany(p => p.Vouchers)
                .HasForeignKey(d => d.SchoolDistrictId)
                .HasConstraintName("FK_Vouchers_SchoolDistricts");

            entity.HasOne(d => d.UnmatchedClaimDistrict).WithMany(p => p.Vouchers)
                .HasForeignKey(d => d.UnmatchedClaimDistrictId)
                .HasConstraintName("FK_Vouchers_UnmatchedClaimDistricts");

            entity.HasOne(d => d.VoucherType).WithMany(p => p.Vouchers)
                .HasForeignKey(d => d.VoucherTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Vouchers_VoucherTypes");
        });

        modelBuilder.Entity<VoucherBillingResponseFile>(entity =>
        {
            entity.Property(e => e.CreatedById).HasDefaultValue(1);
            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.BillingResponseFile).WithMany(p => p.VoucherBillingResponseFiles)
                .HasForeignKey(d => d.BillingResponseFileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VoucherBillingResponseFiles_Students");

            entity.HasOne(d => d.CreatedBy).WithMany(p => p.VoucherBillingResponseFiles)
                .HasForeignKey(d => d.CreatedById)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VoucherBillingResponseFiles_CreatedBy");

            entity.HasOne(d => d.Voucher).WithMany(p => p.VoucherBillingResponseFiles)
                .HasForeignKey(d => d.VoucherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VoucherBillingResponseFiles_Providers");
        });

        modelBuilder.Entity<VoucherType>(entity =>
        {
            entity.Property(e => e.Editable).HasDefaultValue(true);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Sort).HasDefaultValue(2);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
