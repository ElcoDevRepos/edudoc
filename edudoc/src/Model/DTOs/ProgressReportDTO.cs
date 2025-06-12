using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class ProgressReportDto
    {
        public int StudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DistrictProgressReportDate DateRanges {get;set;}
        public IEnumerable<ProgressReport> FirstQuarterProgressReports { get; set; }
        public IEnumerable<ProgressReport> SecondQuarterProgressReports { get; set; }
        public IEnumerable<ProgressReport> ThirdQuarterProgressReports { get; set; }
        public IEnumerable<ProgressReport> FourthQuarterProgressReports { get; set; }
        public IEnumerable<ProgressReport> PreviousProgressReports { get; set; }
        public IEnumerable<ProgressReport> ProgressReports { get; set; }
        public IEnumerable<int> Quarters {get; set; }
        public int SupervisorId { get; set; }
    }
}
