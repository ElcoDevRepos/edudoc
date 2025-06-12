using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model.Custom;
using System.Collections.Generic;

namespace Templator.Models
{
    public class VoucherReportParams : BreckTemplatorBase
    {

        public VoucherReportParams() : base() { }

        public VoucherReportParams(IConfiguration configuration) : base(configuration) { }
        public string DistrictName;
        public string SchoolYear;
        public string Total;
        public List<VoucherReportData> Data;
    }

}
