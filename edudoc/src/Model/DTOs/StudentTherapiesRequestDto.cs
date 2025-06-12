using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model.DTOs
{
    public class StudentTherapiesRequestDto
    {
        public int StudentTherapyScheduleId { get; set; }
        public int TimeZoneOffsetMinutes { get; set; }
    }
}
