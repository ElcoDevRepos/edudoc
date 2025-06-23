using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Contact
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int? AddressId { get; set; }

    public int RoleId { get; set; }

    public int StatusId { get; set; }

    public int? CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<ContactPhone> ContactPhones { get; set; } = new List<ContactPhone>();

    public virtual User? CreatedBy { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual ContactRole Role { get; set; } = null!;

    public virtual ICollection<SchoolDistrict> SchoolDistrictSpecialEducationDirectors { get; set; } = new List<SchoolDistrict>();

    public virtual ICollection<SchoolDistrict> SchoolDistrictTreasurers { get; set; } = new List<SchoolDistrict>();

    public virtual ContactStatus Status { get; set; } = null!;

    public virtual ICollection<SchoolDistrict> SchoolDistricts { get; set; } = new List<SchoolDistrict>();
}
