using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Custom;
using System.Collections.Generic;

namespace Templator.Models
{
    public class BasicEncounterParams : BreckTemplatorBase
    {

        public BasicEncounterParams() : base() { }

        public BasicEncounterParams(IConfiguration configuration) : base(configuration) { }

        public List<EncounterDistrictData<BasicEncounterLineData>> districtData;
    }

}
