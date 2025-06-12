using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Custom;
using System.Collections.Generic;

namespace Templator.Models
{
    public class FiscalRevenueParams : BreckTemplatorBase
    {

        public FiscalRevenueParams() : base() { }

        public FiscalRevenueParams(IConfiguration configuration) : base(configuration) { }

        public FiscalRevenueData data;
    }

}
