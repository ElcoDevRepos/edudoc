using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class StudentParentalConsent
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public DateTime? ParentalConsentEffectiveDate { get; set; }

    public DateTime ParentalConsentDateEntered { get; set; }

    public int ParentalConsentTypeId { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual User CreatedBy { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual StudentParentalConsentType ParentalConsentType { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
