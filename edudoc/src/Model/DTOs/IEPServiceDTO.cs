using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Security.Policy;

namespace Model.DTOs
{
    public class IEPServiceDTO
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public DateTime DateOfBirth { get; set; }   
        public DateTime IEPStartDate { get; set; }
        public DateTime IEPEndDate { get; set; }
        public DateTime ETRExpirationDate { get; set; }
        public string ServiceArea { get; set; }
        public int TotalMinutes { get; set; }
        public int MinutesUsed { get; set; }
    }
}
