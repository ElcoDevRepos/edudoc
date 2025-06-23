using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class VoucherType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int? Sort { get; set; }

    public bool Editable { get; set; }

    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
}
