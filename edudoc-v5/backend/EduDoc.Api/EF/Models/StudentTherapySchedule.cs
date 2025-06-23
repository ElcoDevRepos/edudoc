using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class StudentTherapySchedule
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int StudentTherapyId { get; set; }

    public TimeOnly? ScheduleStartTime { get; set; }

    public TimeOnly? ScheduleEndTime { get; set; }

    public DateTime? ScheduleDate { get; set; }

    public int? DeviationReasonId { get; set; }

    public DateTime? DeviationReasonDate { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<EncounterStudent> EncounterStudents { get; set; } = new List<EncounterStudent>();

    public virtual User? ModifiedBy { get; set; }

    public virtual StudentTherapy StudentTherapy { get; set; } = null!;
}
