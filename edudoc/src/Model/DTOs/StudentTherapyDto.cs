using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class StudentTherapiesDto
    {
        public int Id { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime StartTime { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> Location { get; set; }
        public IEnumerable<string> Students { get; set; }
        public IEnumerable<StudentTherapySchedule> TherapySchedules { get; set; }
        public int? GroupId { get; set; }
        public bool? IsEsigned { get; set; }
    }

}
