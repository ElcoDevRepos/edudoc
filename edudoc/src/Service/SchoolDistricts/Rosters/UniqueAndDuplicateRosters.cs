using Model;
using System.Collections.Generic;

namespace Service.SchoolDistricts.Rosters
{
    public class UniqueAndDuplicateRosters
    {
        public List<SchoolDistrictRoster> UniqueRosters { get; internal set; }
        public List<SchoolDistrictRoster> DuplicateRosters { get; internal set; }
    }
}
