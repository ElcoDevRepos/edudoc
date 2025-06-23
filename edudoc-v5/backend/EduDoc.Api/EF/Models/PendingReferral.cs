using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class PendingReferral
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public string StudentFirstName { get; set; } = null!;

    public string StudentLastName { get; set; } = null!;

    public int DistrictId { get; set; }

    public string DistrictCode { get; set; } = null!;

    public int ProviderId { get; set; }

    public string ProviderFirstName { get; set; } = null!;

    public string ProviderLastName { get; set; } = null!;

    public string ProviderTitle { get; set; } = null!;

    public int ServiceTypeId { get; set; }

    public string ServiceName { get; set; } = null!;

    public int PendingReferralJobRunId { get; set; }

    public virtual SchoolDistrict District { get; set; } = null!;

    public virtual PendingReferralReportJobRun PendingReferralJobRun { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;

    public virtual ServiceType ServiceType { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
