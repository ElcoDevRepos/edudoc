using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ServiceOutcome
{
    public int Id { get; set; }

    public string Notes { get; set; } = null!;

    public int GoalId { get; set; }

    public int? CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual User? CreatedBy { get; set; }

    public virtual Goal Goal { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }
}
