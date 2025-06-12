using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.ManagedListItems.Base
{
    /// <summary>
    /// Generic class for managing meta item likes.  Just inherit, call super() in the constructor with the appropriate fields,
    /// and set UpdateFunc in the constructor
    /// </summary>
    /// <typeparam name="TItem">Type of meta item to manage</typeparam>
    /// <typeparam name="TParentItem">Type that the meta item is attached to (foreign key referenced)</typeparam>
    /// <seealso cref="ProviderTitlesController"/>
    public class ManagedListItemBaseController<TItem, TParentItem> : CrudBaseController<TItem>
        where TItem : class, IEntity, new()
        where TParentItem : class, IEntity, new()
    {
        private readonly string fkName;
        private readonly string entityName;

        /// <summary>
        /// Property that must be set by subclasses.  This will usually be something like
        /// (existing, update) => {
        ///     existing.Name = update.Name;
        ///     etc.
        /// }
        /// </summary>
        protected Action<TItem, TItem> UpdateFunc
        {
            get; set;
        }

        /// <summary>
        /// Base class that handles common functionality of managing "Meta Item" likes, i.e.,
        /// entities that only contain Name and Sort properties, that can be managed by end users.
        /// </summary>
        /// <param name="foreignKeyName"></param>
        /// <param name="entityName"></param>
        /// <param name="crudService"></param>
        public ManagedListItemBaseController(string foreignKeyName,
            string entityName, ICRUDService crudService) : base(crudService)
        {
            this.fkName = foreignKeyName;
            this.entityName = entityName;
        }

        /// <summary>
        /// Common function for updating managed items that handles the following:
        /// 1. checking if the items passed as an argument are referenced by any parent items (and throwing an exception if so)
        /// 2. initiating the update functionality on the database level
        /// </summary>
        /// <param name="sources">Set of meta items to check and update</param>
        /// <returns>Ok if the update was successful, throws exception otherwise</returns>
        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.ManagedListItems, ClaimValues.FullAccess)]
        public IActionResult Update([FromBody]IEnumerable<TItem> sources)
        {
            return ExecuteValidatedAction(() =>
            {
                if (UpdateFunc == null)
                {
                    throw new ArgumentNullException("Update func must be set before updating with ManagedListItemBaseController");
                }
                var sourcesArray = sources.ToArray();
                Crudservice.CheckEntityInUse<TItem, TParentItem>(sourcesArray, fkName,
                    $"{entityName} is currently in use.  Please remove all associations before deleting.");

                Crudservice.Update(sourcesArray, UpdateFunc);
                return Ok();
            });
        }
    }
}
