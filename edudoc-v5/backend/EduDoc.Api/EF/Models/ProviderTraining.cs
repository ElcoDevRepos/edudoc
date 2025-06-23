using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class ProviderTraining
{
    public int Id { get; set; }

    public int? DocumentId { get; set; }

    public int? LinkId { get; set; }

    public int ProviderId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? DateCompleted { get; set; }

    public DateTime? LastReminder { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual MessageDocument? Document { get; set; }

    public virtual MessageLink? Link { get; set; }

    public virtual Provider Provider { get; set; } = null!;
}
