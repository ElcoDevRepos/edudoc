using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class StudentTherapiesByDayDto
    {
        public int Weekday { get; set; }
        public int StudentId { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime StartTime { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SessionName { get; set; }
    }

}
