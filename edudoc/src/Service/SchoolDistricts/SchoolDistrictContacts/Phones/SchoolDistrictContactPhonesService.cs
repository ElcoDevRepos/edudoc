using Model;
using Service.Common.Phone;
using Service.Utilities;
using System.Linq;

namespace Service.SchoolDistricts.SchoolDistrictContacts.Phones
{
    public class SchoolDistrictContactPhonesService : BaseService, ISchoolDistrictContactPhonesService
    {
        public SchoolDistrictContactPhonesService(IPrimaryContext context) : base(context)
        { }

        public void MergeContactPhones(int contactId, PhoneCollection<ContactPhone> phones)
        {
            ThrowIfNull(phones);
            ValidateAndThrow(phones, new ContactPhoneCollectionValidator());

            var phonesArray = phones.Phones as ContactPhone[] ?? phones.Phones.ToArray();

            foreach (var p in phonesArray)
            {
                p.PhoneType = null; // clean out PhoneType if present for adds
                p.ContactId = contactId; // in case it wasn't set...
            }

            PrimaryHelper.EnsureOneIsPrimary(phonesArray);

            var existing = Context.ContactPhones.Where(cp => cp.ContactId == contactId);
            Context.Merge<ContactPhone>()
                .SetExisting(existing)
                .SetUpdates(phonesArray)
                .MergeBy((e, u) => e.Phone == u.Phone && e.Extension == u.Extension)
                .MapUpdatesBy((e, u) =>
                {
                    e.IsPrimary = u.IsPrimary;
                    e.PhoneTypeId = u.PhoneTypeId;
                })
                .Merge();
            Context.SaveChanges();
        }

    }
}
