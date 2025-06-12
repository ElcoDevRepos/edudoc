using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class ReadMessage
{
    public int Id { get; set; }

    public int MessageId { get; set; }

    public int ReadById { get; set; }

    public DateTime DateRead { get; set; }

    public virtual Message Message { get; set; } = null!;

    public virtual User ReadBy { get; set; } = null!;
}
