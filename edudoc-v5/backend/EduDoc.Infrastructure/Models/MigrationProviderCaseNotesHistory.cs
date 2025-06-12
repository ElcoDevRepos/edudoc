using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class MigrationProviderCaseNotesHistory
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public int StudentId { get; set; }

    public string EncounterNumber { get; set; } = null!;

    public DateTime EncounterDate { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string ProviderNotes { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
