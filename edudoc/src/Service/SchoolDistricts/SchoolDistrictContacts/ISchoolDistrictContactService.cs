using Model;

namespace Service.SchoolDistricts.SchoolDistrictContacts
{
    public interface ISchoolDistrictContactService
    {
        int CreateContact(int districtId, Contact contact);
        void UpdateContact(Contact contact);
        void DeleteContact(int districtId, int contactId);
        int DeactivateContact(int contactId);
    }
}
