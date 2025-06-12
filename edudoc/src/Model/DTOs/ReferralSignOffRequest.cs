using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class ReferralSignOffRequest
    {
        public DateTime EffectiveStartDate { get; set; }
        public string SignOffText { get; set; }
        public int StudentId { get; set; }
    }
}
