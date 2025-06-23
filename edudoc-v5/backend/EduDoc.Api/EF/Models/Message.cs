using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Message
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string Body { get; set; } = null!;

    public DateTime? ValidTill { get; set; }

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

    public int? SortOrder { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Esc? Esc { get; set; }

    public virtual MessageFilterType MessageFilterType { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Provider? Provider { get; set; }

    public virtual ProviderTitle? ProviderTitle { get; set; }

    public virtual ICollection<ReadMessage> ReadMessages { get; set; } = new List<ReadMessage>();

    public virtual SchoolDistrict? SchoolDistrict { get; set; }

    public virtual ServiceCode? ServiceCode { get; set; }
}
