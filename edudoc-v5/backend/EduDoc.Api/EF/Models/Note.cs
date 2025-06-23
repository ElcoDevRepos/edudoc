using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Note
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string NoteText { get; set; } = null!;
}
