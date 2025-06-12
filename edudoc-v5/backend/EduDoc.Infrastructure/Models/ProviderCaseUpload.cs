using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderCaseUpload
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int? ProviderId { get; set; }

    public int DistrictId { get; set; }

    public string? FirstName { get; set; }

    public string? MiddleName { get; set; }

    public string? LastName { get; set; }

    public string? Grade { get; set; }

    public string? DateOfBirth { get; set; }

    public string? School { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public int ProviderCaseUploadDocumentId { get; set; }

    public bool? HasDuplicates { get; set; }

    public bool? HasDataIssues { get; set; }

    public bool Archived { get; set; }

    public int? StudentId { get; set; }

    public virtual SchoolDistrict District { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual Provider? Provider { get; set; }

    public virtual ProviderCaseUploadDocument ProviderCaseUploadDocument { get; set; } = null!;

    public virtual Student? Student { get; set; }
}
