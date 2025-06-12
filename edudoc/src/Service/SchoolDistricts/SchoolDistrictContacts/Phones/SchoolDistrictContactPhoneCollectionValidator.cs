using Model;
using Service.Utilities.Validators;

namespace Service.SchoolDistricts.SchoolDistrictContacts.Phones
{
    public class SchoolDistrictContactPhoneCollectionValidator : PhoneCollectionValidator<ContactPhone>
    {
        public SchoolDistrictContactPhoneCollectionValidator() : base(new SchoolDistrictPhoneValidator())
        { }

    }
}
