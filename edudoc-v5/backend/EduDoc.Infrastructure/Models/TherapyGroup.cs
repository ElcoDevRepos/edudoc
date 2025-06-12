using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class TherapyGroup
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int ProviderId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool Monday { get; set; }

    public bool Tuesday { get; set; }

    public bool Wednesday { get; set; }

    public bool Thursday { get; set; }

    public bool Friday { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Provider Provider { get; set; } = null!;

    public virtual ICollection<StudentTherapy> StudentTherapies { get; set; } = new List<StudentTherapy>();
}
