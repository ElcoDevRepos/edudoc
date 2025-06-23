using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ClaimsEncounter
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string ClaimAmount { get; set; } = null!;

    public string ProcedureIdentifier { get; set; } = null!;

    public string BillingUnits { get; set; } = null!;

    public DateTime ServiceDate { get; set; }

    public string? PhysicianFirstName { get; set; }

    public string? PhysicianLastName { get; set; }

    public string? PhysicianId { get; set; }

    public string? ReferringProviderFirstName { get; set; }

    public string? ReferringProviderLastName { get; set; }

    public string ReasonForServiceCode { get; set; } = null!;

    public string ReferringProviderId { get; set; } = null!;

    public bool IsTelehealth { get; set; }

    public bool Rebilled { get; set; }

    public bool Response { get; set; }

    public int? EdiErrorCodeId { get; set; }

    public string? ClaimId { get; set; }

    public int? ClaimsStudentId { get; set; }

    public int EncounterStudentId { get; set; }

    public int? AggregateId { get; set; }

    public int EncounterStudentCptCodeId { get; set; }

    public string? PaidAmount { get; set; }

    public DateTime? VoucherDate { get; set; }

    public string? ReferenceNumber { get; set; }

    public string? AdjustmentReasonCode { get; set; }

    public string? AdjustmentAmount { get; set; }

    public string? ControlNumberPrefix { get; set; }

    public int? ReversedClaimId { get; set; }

    public virtual EncounterStudentCptCode? Aggregate { get; set; }

    public virtual ClaimsStudent? ClaimsStudent { get; set; }

    public virtual EdiErrorCode? EdiErrorCode { get; set; }

    public virtual EncounterStudent EncounterStudent { get; set; } = null!;

    public virtual EncounterStudentCptCode EncounterStudentCptCode { get; set; } = null!;

    public virtual HealthCareClaim? ReversedClaim { get; set; }
}
