using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ProviderEscAssignment
{
    public int Id { get; set; }

    public int ProviderId { get; set; }

    public int? EscId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public int? CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public bool Archived { get; set; }

    public int? AgencyTypeId { get; set; }

    public int? AgencyId { get; set; }

    public virtual Agency? Agency { get; set; }

    public virtual AgencyType? AgencyType { get; set; }

    public virtual User? CreatedBy { get; set; }

    public virtual Esc? Esc { get; set; }

    public virtual User? ModifiedBy { get; set; }

    public virtual Provider Provider { get; set; } = null!;

    public virtual ICollection<ProviderEscSchoolDistrict> ProviderEscSchoolDistricts { get; set; } = new List<ProviderEscSchoolDistrict>();
}
