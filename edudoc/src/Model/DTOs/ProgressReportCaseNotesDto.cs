using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class ProgressReportCaseNotesDto
    {
        public DateTime Date { get; set; }
        public string Notes { get; set; }
    }
}
