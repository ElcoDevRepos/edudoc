using Model;
using System.Collections.Generic;

namespace Service.SchoolDistricts
{
    public interface ISchoolDistrictService
    {
        SchoolDistrict Reload(int schoolDistrictId);
        bool CheckIfUserIsDistrictAdmin(int userId, int districtId);
        IEnumerable<SchoolDistrict> GetDistrictsByEscId(int userId, int escId);
        SchoolDistrict UpdateCaseNotesRequired(int districtId, List<int> providerTitleIds);
    }
}
