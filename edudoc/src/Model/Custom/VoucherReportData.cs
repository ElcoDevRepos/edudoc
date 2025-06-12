using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.Custom
{
    public class VoucherReportData
    {
        public DateTime VoucherDate { get; set; }
        public string VoucherAmount { get; set; }
        public IList<VoucherServiceCodeData> ServiceCodeData { get; set; }
    }

    public class VoucherServiceCodeData
    {
        public string ServiceCodeName { get; set; }
        public string PaidAmount { get; set; }
        public string SchoolYear { get; set; }
    }
}
