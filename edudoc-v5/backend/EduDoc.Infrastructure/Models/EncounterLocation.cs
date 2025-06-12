using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class EncounterLocation
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<EncounterStudent> EncounterStudents { get; set; } = new List<EncounterStudent>();

    public virtual ICollection<StudentTherapy> StudentTherapies { get; set; } = new List<StudentTherapy>();
}
