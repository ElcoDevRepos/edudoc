using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class ClaimVoucherDTO
    {
        public int? ClaimEncounterId { get; set; }
        public int? VoucherId { get; set; }
        public string VoucherAmount { get; set; }
        public string PaidAmount { get; set; }
        public DateTime VoucherDate { get; set; }
        public string ServiceCode { get; set; }
        public int ServiceCodeId { get; set; }
        public string SchoolYear { get; set; }
        public string SchoolDistrict { get; set; }
        public int? SchoolDistrictId { get; set; }
        public DateTime? ServiceDate { get; set; }
        public VoucherType VoucherType { get; set; }
        public bool Unmatched { get; set; }
        public bool Archived { get; set; }
    }
}
