using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model.DTOs
{
    public class DistrictProgressReportStudentsDto
    {
            public int ProviderId { get; set; }
            public int StudentId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public int TotalEncounters { get; set; }
            public IEnumerable<ProgressReport> ProgressReports { get; set; }
    }

}

