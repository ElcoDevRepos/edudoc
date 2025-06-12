using System.Data.SqlClient;
using System.Data.SqlClient;

using System;

namespace Model.DTOs
{
    public class StudentWithParentalConsentDTO
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string StudentCode { get; set; }
        public School School { get; set; }
        public string Grade { get; set; }
        public StudentParentalConsentType Consent { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int TotalBillableClaims { get; set; }
        public DateTime? EffectiveDate { get; set; }
    }
}
