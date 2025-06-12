using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class ReferralsPendingDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StudentCode { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Grade { get; set; }
        public int TotalBillableClaims { get; set; }
    }
}
