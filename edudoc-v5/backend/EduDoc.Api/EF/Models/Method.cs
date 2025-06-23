using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Method
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<CaseLoadMethod> CaseLoadMethods { get; set; } = new List<CaseLoadMethod>();

    public virtual ICollection<EncounterStudentMethod> EncounterStudentMethods { get; set; } = new List<EncounterStudentMethod>();
}
