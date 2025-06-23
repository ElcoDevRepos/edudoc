using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class Image
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string ImagePath { get; set; } = null!;

    public string ThumbnailPath { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
