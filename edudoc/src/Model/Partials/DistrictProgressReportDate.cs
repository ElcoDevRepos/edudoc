using System;

namespace Model
{
    public partial class DistrictProgressReportDate
    {
        partial void InitializePartial()
        {
            var currentSchoolYear =
                DateTime.Now.Month >= 7 ? DateTime.Now.Year + 1 : DateTime.Now.Year;

            // There's no way to make entity framework respect the SQL default value for a non-nullable column, so we have to set it here.
            // Duplicate data in DistrictProgressReportDates.sql
            FirstQuarterStartDate = new DateTime(currentSchoolYear - 1, 9, 1, 12, 0, 0);
            FirstQuarterEndDate = new DateTime(currentSchoolYear - 1, 11, 30, 12, 0, 0);
            SecondQuarterStartDate = new DateTime(currentSchoolYear - 1, 12, 1, 12, 0, 0);
            SecondQuarterEndDate = new DateTime(currentSchoolYear, 3, 1, 12, 0, 0);
            ThirdQuarterStartDate = new DateTime(currentSchoolYear, 3, 2, 12, 0, 0);
            ThirdQuarterEndDate = new DateTime(currentSchoolYear, 5, 31, 12, 0, 0);
            FourthQuarterStartDate = new DateTime(currentSchoolYear, 6, 1, 12, 0, 0);
            FourthQuarterEndDate = new DateTime(currentSchoolYear, 8, 31, 12, 0, 0);
        }
    }
}
