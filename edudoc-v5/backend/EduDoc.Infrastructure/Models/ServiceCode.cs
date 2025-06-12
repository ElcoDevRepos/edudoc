using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ServiceCode
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string? Area { get; set; }

    public bool IsBillable { get; set; }

    public bool NeedsReferral { get; set; }

    public bool CanHaveMultipleProgressReportsPerStudent { get; set; }

    public bool CanCosignProgressReports { get; set; }

    public virtual ICollection<ActivitySummaryServiceArea> ActivitySummaryServiceAreas { get; set; } = new List<ActivitySummaryServiceArea>();

    public virtual ICollection<BillingScheduleExcludedServiceCode> BillingScheduleExcludedServiceCodes { get; set; } = new List<BillingScheduleExcludedServiceCode>();

    public virtual ICollection<CaseLoad> CaseLoads { get; set; } = new List<CaseLoad>();

    public virtual ICollection<CptcodeAssocation> CptcodeAssocations { get; set; } = new List<CptcodeAssocation>();

    public virtual ICollection<DiagnosisCodeAssociation> DiagnosisCodeAssociations { get; set; } = new List<DiagnosisCodeAssociation>();

    public virtual ICollection<MessageDocument> MessageDocuments { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageLink> MessageLinks { get; set; } = new List<MessageLink>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<ProviderTitle> ProviderTitles { get; set; } = new List<ProviderTitle>();

    public virtual ICollection<SupervisorProviderStudentReferalSignOff> SupervisorProviderStudentReferalSignOffs { get; set; } = new List<SupervisorProviderStudentReferalSignOff>();

    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();
}
