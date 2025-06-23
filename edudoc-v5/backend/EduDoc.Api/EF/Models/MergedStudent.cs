using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class MergedStudent
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string? MiddleName { get; set; }

    public string LastName { get; set; } = null!;

    public string StudentCode { get; set; } = null!;

    public string Grade { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public int? AddressId { get; set; }

    public int SchoolId { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public int MergedToStudentId { get; set; }

    public virtual Address? Address { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Student MergedToStudent { get; set; } = null!;

    public virtual School School { get; set; } = null!;
}
