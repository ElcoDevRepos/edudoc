using System;
using System.Collections.Generic;

namespace EduDoc.Infrastructure.Models;

public partial class MessageFilterType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<MessageDocument> MessageDocuments { get; set; } = new List<MessageDocument>();

    public virtual ICollection<MessageLink> MessageLinks { get; set; } = new List<MessageLink>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
