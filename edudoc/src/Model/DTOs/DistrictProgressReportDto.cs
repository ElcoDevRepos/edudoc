using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class DistrictProgressReportDto
    {
        public int ProviderId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int ServiceAreaId { get; set; }
        public string ServiceAreaName { get; set; }
        public int TotalIEPStudents { get; set; }
        public int TotalEncounters { get; set; }
        public int TotalCompletedReports { get; set; }
    }

}
