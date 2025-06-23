using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EncounterReasonForReturn
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int ReturnReasonCategoryId { get; set; }

    public int HpcUserId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User HpcUser { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual EncounterReturnReasonCategory ReturnReasonCategory { get; set; } = null!;
}
