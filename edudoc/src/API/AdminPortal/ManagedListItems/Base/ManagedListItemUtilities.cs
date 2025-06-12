using Model;
using System;

namespace API.ManagedListItems.Base
{
    /// <summary>
    /// Static class that provides default actions that make updating managed list items much easier.
    /// Could be extended by providing interfaces a la IBasicNameEntity that provide properties common to meta items.
    /// Ex: ISortedNameEntity { Name; Sort }
    /// </summary>
    public static class ManagedListItemUtilities
    {
        public static Action<TNamedEntity, TNamedEntity> GetDefaultNamedMappingFunction<TNamedEntity>()
            where TNamedEntity : class, IBasicNameEntity, new()
        {
            return (existing, update) =>
            {
                existing.Name = update.Name;
            };
        }
    }
}
