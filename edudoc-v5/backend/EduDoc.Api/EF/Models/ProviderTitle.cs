using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderTitle
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Code { get; set; }

    public int ServiceCodeId { get; set; }

    public int? SupervisorTitleId { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual ICollection<CptcodeAssocation> CptcodeAssocations { get; set; } = new List<CptcodeAssocation>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<ProviderTitle> InverseSupervisorTitle { get; set; } = new List<ProviderTitle>();

    public virtual ICollection<MessageDocument> MessageDocuments { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageLink> MessageLinks { get; set; } = new List<MessageLink>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<Provider> Providers { get; set; } = new List<Provider>();

    public virtual ICollection<SchoolDistrictProviderCaseNote> SchoolDistrictProviderCaseNotes { get; set; } = new List<SchoolDistrictProviderCaseNote>();

    public virtual ServiceCode ServiceCode { get; set; } = null!;

    public virtual ProviderTitle? SupervisorTitle { get; set; }
}
