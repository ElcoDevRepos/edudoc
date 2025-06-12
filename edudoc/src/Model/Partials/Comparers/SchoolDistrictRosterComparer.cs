using System.Data.SqlClient;
using System.Data.SqlClient;
using System.Collections.Generic;

namespace Model.Partials.Comparers
{
    public class SchoolDistrictRosterComparer : IEqualityComparer<SchoolDistrictRoster>
    {

        public bool Equals(SchoolDistrictRoster x, SchoolDistrictRoster y)
        {
            return (x.StudentCode.Trim() == y.StudentCode.Trim() && x.FirstName.ToLower().Trim() == y.FirstName.ToLower().Trim()) ||
                          (x.StudentCode.Trim() == y.StudentCode.Trim() && x.LastName.ToLower().Trim() == y.LastName.ToLower().Trim()) ||
                         (x.FirstName.ToLower().Trim() == y.FirstName.ToLower().Trim() && x.LastName.ToLower().Trim() == y.LastName.ToLower().Trim()) ||
                           (x.LastName.ToLower().Trim() == y.LastName.ToLower().Trim() && x.DateOfBirth == y.DateOfBirth);
        }

        public int GetHashCode(SchoolDistrictRoster obj)
        {
            return obj.SchoolDistrictId.GetHashCode();
        }
    }
}
