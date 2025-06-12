using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Custom;
using System.Collections.Generic;

namespace Templator.Models
{
    public class FiscalSummaryParams : BreckTemplatorBase
    {

        public FiscalSummaryParams() : base() { }

        public FiscalSummaryParams(IConfiguration configuration) : base(configuration) { }

        public FiscalSummaryData data;
    }

}
