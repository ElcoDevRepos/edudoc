using Model;
using Service.Common.Address;

namespace Service.Addresses
{
    public interface IAddressService
    {
        CreateAddressResult CreateEntityAddress<T>(int id, Address address) where T : class, IEntity, IHasAddress<Address>;
        void TrimWhiteSpace(Address address);
        void UpdateEntityAddress(Address address);
        void DeleteEntityAddress<T>(int id) where T : class, IEntity, IHasAddress<Address>;
    }
}
