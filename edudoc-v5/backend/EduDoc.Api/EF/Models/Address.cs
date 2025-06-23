using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Address
{
    public int Id { get; set; }

    public string Address1 { get; set; } = null!;

    public string Address2 { get; set; } = null!;

    public string City { get; set; } = null!;

    public string StateCode { get; set; } = null!;

    public string Zip { get; set; } = null!;

    public string? CountryCode { get; set; }

    public string Province { get; set; } = null!;

    public string? County { get; set; }

    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();

    public virtual Country? CountryCodeNavigation { get; set; }

    public virtual ICollection<Esc> Escs { get; set; } = new List<Esc>();

    public virtual ICollection<MergedStudent> MergedStudents { get; set; } = new List<MergedStudent>();

    public virtual ICollection<SchoolDistrict> SchoolDistricts { get; set; } = new List<SchoolDistrict>();

    public virtual State StateCodeNavigation { get; set; } = null!;

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
