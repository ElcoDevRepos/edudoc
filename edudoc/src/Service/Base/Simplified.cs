using Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service
{
    /// <summary>
    ///     A class for easy mapping to association lists.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Simplified<T>
        where T : class, IEntity
    {
        public Simplified(T entity, Func<T, string> nameSelector)
        {
            Id = entity.Id;
            Name = nameSelector(entity);
        }

        public static IEnumerable<Simplified<T>> FromEnum(IEnumerable<T> entity, Func<T, string> nameSelector)
        {
            return entity.Select(t => new Simplified<T>(t, nameSelector));
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
