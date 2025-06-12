using Model;
using Service.Common.Address;
using Service.Utilities.Validators;
using System.Data.Entity;
using System.Linq;

namespace Service.Addresses
{
    public class AddressService : BaseService, IAddressService
    {
        private IPrimaryContext _context;
        public AddressService(IPrimaryContext context) : base(context)
        {
            _context = context;
        }

        public void TrimWhiteSpace(Address address) {
                address.Address1 = address.Address1?.Trim();
                address.Address2 = address.Address2?.Trim();
                address.City = address.City?.Trim();
                address.County = address.County?.Trim();
                address.Province = address.Province?.Trim();
                address.Zip = address.Zip?.Trim();
        }

        public CreateAddressResult CreateEntityAddress<T>(int id, Address address) where T : class, IEntity, IHasAddress<Address>
        {
            ThrowIfNull(address);
            ValidateAndThrow(address, new AddressValidator());
            var ent = _context.Set<T>().Find(id);
            ThrowIfNull(ent);
            TrimWhiteSpace(address);
            _context.Addresses.Add(address);
            ent.Address = address;
            Context.SaveChanges();
            return new CreateAddressResult { AddressId = address.Id };
        }


        public void UpdateEntityAddress(Address address)
        {
            ThrowIfNull(address);
            ValidateAndThrow(address, new AddressValidator());
            TrimWhiteSpace(address);
            _context.Addresses.Attach(address);
            _context.SetEntityState(address, EntityState.Modified);
            _context.SaveChanges();
        }

        public void DeleteEntityAddress<T>(int id) where T : class, IEntity, IHasAddress<Address>
        {
            T ent = _context.Set<T>()
                .Include(e => e.Address)
                .SingleOrDefault(e => e.Id == id);
            ThrowIfNull(ent);
            if (ent.Address == null) return;
            Address addr = ent.Address;
            ent.Address = null;
            ent.AddressId = null;
            _context.SetEntityState(ent, EntityState.Modified);
            _context.Addresses.Remove(addr);
            Context.SaveChanges();
        }
    }
}
