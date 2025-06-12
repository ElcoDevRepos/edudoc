using Model;

namespace Service.SchoolDistricts.Schools
{
    public interface ISchoolService
    {
        School Update(School school, int districtId, int userId);
        int GetSchoolIdByNameAndDistrictId(string schoolName, int schoolDistrictId);
    }
}
