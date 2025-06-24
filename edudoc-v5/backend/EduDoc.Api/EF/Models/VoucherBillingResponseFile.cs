using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class VoucherBillingResponseFile
{
    public int Id { get; set; }

    public int VoucherId { get; set; }

    public int BillingResponseFileId { get; set; }

    public int CreatedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public virtual BillingResponseFile BillingResponseFile { get; set; } = null!;

    public virtual User CreatedBy { get; set; } = null!;

    public virtual Voucher Voucher { get; set; } = null!;
}
