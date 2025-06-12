using BreckServiceBase.Utilities.Interfaces;
using Model;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.SchoolDistricts.SchoolDistrictContacts
{
    public class SchoolDistrictContactService : BaseService, ISchoolDistrictContactService
    {
        private readonly IEmailHelper _emailHelper;
        public SchoolDistrictContactService(IPrimaryContext context, IEmailHelper emailHelper) : base(context)
        {
            _emailHelper = emailHelper;
        }

        public int CreateContact(int districtId, Contact contact)
        {
            ThrowIfNull(contact);
            contact.Address = null;
            contact.ContactStatus = null;
            ValidateAndThrow(contact, new ContactValidator(_emailHelper));
            var district = Spoof<SchoolDistrict>(districtId);
            Context.SchoolDistricts.Attach(district);
            Context.Contacts.Add(contact);
            district.Contacts.Add(contact);
            Context.SaveChanges();
            return contact.Id;
        }

        public int DeactivateContact(int contactId)
        {
            var contact = Context.Contacts
                .SingleOrDefault(cc => cc.Id == contactId);
            ThrowIfNull(contact);

            contact.StatusId = contact.StatusId == (int)CommonStatuses.Inactive ? (int)CommonStatuses.Active : (int)CommonStatuses.Inactive;

            return Context.SaveChanges();
        }

        public void DeleteContact(int districtId, int contactId)
        {
            var contact = Context.Contacts
                .Include(cc => cc.ContactPhones)
                .SingleOrDefault(cc => cc.Id == contactId);
            ThrowIfNull(contact);

            // delete phones
            Context.ContactPhones.RemoveRange(contact.ContactPhones);

            // delete address
            RemoveContactAddress(contact);

            // delete the contact from district and context
            var district = Spoof<SchoolDistrict>(districtId);
            district.Contacts = new List<Contact> { contact };
            Context.SchoolDistricts.Attach(district);
            district.Contacts.Remove(contact);
            Context.Contacts.Remove(contact);

            // save
            Context.SaveChanges();
        }

        public void UpdateContact(Contact contact)
        {
            ThrowIfNull(contact);
            contact.ContactStatus = null;
            contact.Address = null;
            contact.ContactRole = Context.ContactRoles.FirstOrDefault(cr => cr.Id == contact.RoleId);
            ValidateAndThrow(contact, new ContactValidator(_emailHelper));
            Context.Contacts.Attach(contact);
            Context.SetEntityState(contact, EntityState.Modified);
            Context.SaveChanges();
        }

        private void RemoveContactAddress(Contact cc)
        {
            if (cc.AddressId == null) return;
            var addr = Spoof<Model.Address>(cc.AddressId.Value);
            cc.AddressId = null;
            Context.Addresses.Attach(addr);
            Context.Addresses.Remove(addr);
        }

    }
}
