using Model;
using Service.Utilities.Validators;

namespace Service.SchoolDistricts.SchoolDistrictContacts
{
    public class ContactPhoneCollectionValidator : PhoneCollectionValidator<ContactPhone>
    {
        public ContactPhoneCollectionValidator()
            : base(new ContactPhoneValidator())
        { }

    }
}

