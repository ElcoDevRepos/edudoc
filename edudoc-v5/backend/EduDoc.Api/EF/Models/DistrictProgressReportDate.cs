using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class DistrictProgressReportDate
{
    /// <summary>
    /// Module
    /// </summary>
    public int Id { get; set; }

    public int DistrictId { get; set; }

    public DateTime FirstQuarterStartDate { get; set; }

    public DateTime FirstQuarterEndDate { get; set; }

    public DateTime SecondQuarterStartDate { get; set; }

    public DateTime SecondQuarterEndDate { get; set; }

    public DateTime ThirdQuarterStartDate { get; set; }

    public DateTime ThirdQuarterEndDate { get; set; }

    public DateTime FourthQuarterStartDate { get; set; }

    public DateTime FourthQuarterEndDate { get; set; }

    public virtual SchoolDistrict District { get; set; } = null!;
}
