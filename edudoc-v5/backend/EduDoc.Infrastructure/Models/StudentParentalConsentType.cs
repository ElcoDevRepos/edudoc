using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class StudentParentalConsentType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<StudentParentalConsent> StudentParentalConsents { get; set; } = new List<StudentParentalConsent>();
}
