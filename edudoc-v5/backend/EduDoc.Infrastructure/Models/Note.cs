using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class Note
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string NoteText { get; set; } = null!;
}
