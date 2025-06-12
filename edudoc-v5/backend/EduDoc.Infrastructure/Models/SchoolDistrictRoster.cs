using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class SchoolDistrictRoster
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int SchoolDistrictId { get; set; }

    public string? FirstName { get; set; }

    public string? MiddleName { get; set; }

    public string? LastName { get; set; }

    public string? StudentCode { get; set; }

    public string? Grade { get; set; }

    public string? DateOfBirth { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? City { get; set; }

    public string? StateCode { get; set; }

    public string Zip { get; set; } = null!;

    public string? SchoolBuilding { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public int SchoolDistrictRosterDocumentId { get; set; }

    public bool? HasDuplicates { get; set; }

    public bool? HasDataIssues { get; set; }

    public bool Archived { get; set; }

    public int? StudentId { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual SchoolDistrict SchoolDistrict { get; set; } = null!;

    public virtual SchoolDistrictRosterDocument SchoolDistrictRosterDocument { get; set; } = null!;

    public virtual Student? Student { get; set; }
}
