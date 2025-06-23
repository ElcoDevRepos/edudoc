using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Esc
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string? Notes { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public int? AddressId { get; set; }

    public virtual Address? Address { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual ICollection<EscSchoolDistrict> EscSchoolDistricts { get; set; } = new List<EscSchoolDistrict>();

    public virtual ICollection<MessageDocument> MessageDocuments { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageLink> MessageLinks { get; set; } = new List<MessageLink>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<ProviderEscAssignment> ProviderEscAssignments { get; set; } = new List<ProviderEscAssignment>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
