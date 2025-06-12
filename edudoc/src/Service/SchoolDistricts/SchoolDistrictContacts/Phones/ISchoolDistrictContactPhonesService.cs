using Model;
using Service.Common.Phone;

namespace Service.SchoolDistricts.SchoolDistrictContacts.Phones
{
    public interface ISchoolDistrictContactPhonesService
    {
        void MergeContactPhones(int contactId, PhoneCollection<ContactPhone> phones);
    }
}
