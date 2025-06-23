using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Iepservice
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public DateTime EtrexpirationDate { get; set; }

    public int? OtptotalMinutes { get; set; }

    public int? PttotalMinutes { get; set; }

    public int? StptotalMinutes { get; set; }

    public int? AudtotalMinutes { get; set; }

    public int? NursingTotalMinutes { get; set; }

    public int? CctotalMinutes { get; set; }

    public int? SoctotalMinutes { get; set; }

    public int? PsytotalMinutes { get; set; }

    public DateTime? Otpdate { get; set; }

    public DateTime? Ptdate { get; set; }

    public DateTime? Stpdate { get; set; }

    public DateTime? Auddate { get; set; }

    public DateTime? NursingDate { get; set; }

    public DateTime? Ccdate { get; set; }

    public DateTime? Socdate { get; set; }

    public DateTime? Psydate { get; set; }

    public int StudentId { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Student Student { get; set; } = null!;
}
