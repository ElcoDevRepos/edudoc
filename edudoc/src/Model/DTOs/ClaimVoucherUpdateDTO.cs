using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class ClaimVoucherUpdateDTO
    {
        public int Id { get; set; }
        public string VoucherAmount { get; set; }
        public string PaidAmount { get; set; }
        public int ServiceCodeId { get; set; }
        public string SchoolYear { get; set; }
        public int SchoolDistrictId { get; set; }
    }
}
