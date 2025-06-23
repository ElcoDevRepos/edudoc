using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class MessageDocument
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string FileName { get; set; } = null!;

    public DateTime? ValidTill { get; set; }

    public bool Mandatory { get; set; }

    public int? TrainingTypeId { get; set; }

    public DateTime? DueDate { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public int MessageFilterTypeId { get; set; }

    public int? ServiceCodeId { get; set; }

    public int? SchoolDistrictId { get; set; }

    public bool ForDistrictAdmins { get; set; }

    public int? ProviderTitleId { get; set; }

    public int? ProviderId { get; set; }

    public int? EscId { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Esc? Esc { get; set; }

    public virtual MessageFilterType MessageFilterType { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Provider? Provider { get; set; }

    public virtual ProviderTitle? ProviderTitle { get; set; }

    public virtual ICollection<ProviderTraining> ProviderTrainings { get; set; } = new List<ProviderTraining>();

    public virtual SchoolDistrict? SchoolDistrict { get; set; }

    public virtual ServiceCode? ServiceCode { get; set; }

    public virtual TrainingType? TrainingType { get; set; }
}
