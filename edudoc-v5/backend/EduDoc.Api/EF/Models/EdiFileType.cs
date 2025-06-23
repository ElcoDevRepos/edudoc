using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EdiFileType
{
    public int Id { get; set; }

    public string EdiFileFormat { get; set; } = null!;

    public string Name { get; set; } = null!;

    public bool IsResponse { get; set; }

    public virtual ICollection<EdiErrorCode> EdiErrorCodes { get; set; } = new List<EdiErrorCode>();
}
