using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class ReadyForSchedulingDTO
    {
        public DateTime EndTime { get; set; }
        public int GroupId { get; set; }
        public string ServiceType { get; set; }
        public DateTime StartTime { get; set; }
        public IEnumerable<string> Students { get; set; }
        public string Name { get; set; }
    }
}
