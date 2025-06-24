using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EsignatureContent
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Content { get; set; } = null!;
}
