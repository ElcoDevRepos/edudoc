using Model;
using Service.Common.Address;
using Service.Utilities.Validators;
using System.Data.Entity;
using System.Linq;


namespace Service
{
    public abstract class BaseService : BasicService
    {
        protected IPrimaryContext Context;

        protected BaseService(IPrimaryContext context) : base(context)
        {
            Context = context;
        }


        /// <summary>
        ///     Updates a Note.
        /// </summary>
        /// <param name="note"></param>
        protected void UpdateNote(Note note)
        {
            ThrowIfNull(note);
            ValidateAndThrow(note, new NoteValidator());
            Context.Notes.Attach(note);
            Context.SetEntityState(note, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Create's an Address for an entity implementing the IHasAddress interface.
        ///     Returns an object containing the updated rowversion of the entity, and the
        ///     id of the new Address record.
        /// </summary>
        protected CreateAddressResult CreateAddress<T>(int id, Address address) where T : class, IEntity, IHasAddress<Address>
        {
            ThrowIfNull(address);
            ValidateAndThrow(address, new AddressValidator());
            var ent = Context.Set<T>().Find(id);
            ThrowIfNull(ent);
            Context.Addresses.Add(address);
            // ReSharper disable once PossibleNullReferenceException
            ent.Address = address;
            Context.SaveChanges();
            return new CreateAddressResult { AddressId = address.Id };
        }

        /// <summary>
        ///     Updates an Address.
        /// </summary>
        /// <param name="address"></param>
        protected void UpdateAddress(Address address)
        {
            ThrowIfNull(address);
            ValidateAndThrow(address, new AddressValidator());
            Context.Addresses.Attach(address);
            Context.SetEntityState(address, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Deletes an Address underneath an entity implementing
        ///     the IHasAddress interface, and returns the new rowversion
        ///     of the entity.
        /// </summary>
        protected void DeleteAddress<T>(int id) where T : class, IEntity, IHasAddress<Address>
        {
            T ent = Context.Set<T>()
                .Include(e => e.Address)
                .SingleOrDefault(e => e.Id == id);
            ThrowIfNull(ent);
            // ReSharper disable once PossibleNullReferenceException
            if (ent.Address == null) return;
            Address addr = ent.Address;
            ent.Address = null;
            ent.AddressId = null;
            Context.SetEntityState(ent, EntityState.Modified);
            Context.Addresses.Remove(addr);
            Context.SaveChanges();
        }
    }
}
