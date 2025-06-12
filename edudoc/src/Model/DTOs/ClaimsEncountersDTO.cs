using System.Data.SqlClient;
using System.Data.SqlClient;

using System.Collections.Generic;

namespace Model.DTOs
{
    public class ClaimsEncountersDTO
    {
        public List<ClaimsEncounter> ClaimsEncountersToAdd { get; set; }
        public List<ClaimsEncounter> RedundantEncounters { get; set; }
    }
}
