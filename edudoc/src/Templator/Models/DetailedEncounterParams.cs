using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model.Custom;
using System.Collections.Generic;

namespace Templator.Models
{
    public class DetailedEncounterParams : BreckTemplatorBase
    {

        public DetailedEncounterParams() : base() { }

        public DetailedEncounterParams(IConfiguration configuration) : base(configuration) { }

        public List<EncounterDistrictData<DetailedEncounterLineData>> districtData;
    }

}
