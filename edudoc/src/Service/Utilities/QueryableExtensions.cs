using Service.Core.Utilities;
using Service.Core.Utilities;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;

namespace Service.Utilities
{
    public static class QueryableExtensions
    {
        public static IOrderedQueryable<TSource> OrderByDir<TSource, TKey>(this IQueryable<TSource> query, Expression<Func<TSource, TKey>> orderBy, string orderDir)
        {
            var dir = orderDir.ToLower();
            if (dir == "asc" || dir == "ascending")
                return query.OrderBy(orderBy);

            return query.OrderByDescending(orderBy);
        }
        public static IOrderedQueryable<TSource> ThenByDir<TSource, TKey>(this IOrderedQueryable<TSource> query, Expression<Func<TSource, TKey>> orderBy, string orderDir)
        {
            var dir = orderDir.ToLower();
            if (dir == "asc" || dir == "ascending")
                return query.ThenBy(orderBy);

            return query.ThenByDescending(orderBy);
        }
    }
}
