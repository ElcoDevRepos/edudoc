using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class StudentTherapy
{
    public int Id { get; set; }

    public int CaseLoadId { get; set; }

    public int? ProviderId { get; set; }

    public int EncounterLocationId { get; set; }

    public int? TherapyGroupId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool Monday { get; set; }

    public bool Tuesday { get; set; }

    public bool Wednesday { get; set; }

    public bool Thursday { get; set; }

    public bool Friday { get; set; }

    public string? SessionName { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual CaseLoad CaseLoad { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual EncounterLocation EncounterLocation { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Provider? Provider { get; set; }

    public virtual ICollection<StudentTherapySchedule> StudentTherapySchedules { get; set; } = new List<StudentTherapySchedule>();

    public virtual TherapyGroup? TherapyGroup { get; set; }
}
