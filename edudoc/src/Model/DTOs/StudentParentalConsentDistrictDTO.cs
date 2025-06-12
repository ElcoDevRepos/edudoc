using System.Data.SqlClient;
using System.Data.SqlClient;

using System;

namespace Model.DTOs
{
    public class StudentWithParentalConsentDistrictDTO
    {
        public int Id { get; set; }
        public string DistrictName { get; set; }
        public int TotalEncounters { get; set; }
    }
}
