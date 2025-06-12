using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class School
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<MergedStudent> MergedStudents { get; set; } = new List<MergedStudent>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<SchoolDistrictsSchool> SchoolDistrictsSchools { get; set; } = new List<SchoolDistrictsSchool>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
