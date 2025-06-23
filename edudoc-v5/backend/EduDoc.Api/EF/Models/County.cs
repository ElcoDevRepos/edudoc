using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class County
{
    public string Zip { get; set; } = null!;

    public string City { get; set; } = null!;

    public string StateCode { get; set; } = null!;

    public string CountyName { get; set; } = null!;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public int Id { get; set; }
}
