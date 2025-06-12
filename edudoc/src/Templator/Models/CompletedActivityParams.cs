using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Custom;
using System.Collections.Generic;

namespace Templator.Models
{
    public class CompletedActivityParams : BreckTemplatorBase
    {

        public CompletedActivityParams() : base() { }

        public CompletedActivityParams(IConfiguration configuration) : base(configuration) { }

        public CompletedActivityData data;
    }

}
