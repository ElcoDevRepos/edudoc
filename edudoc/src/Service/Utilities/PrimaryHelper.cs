using Model;
using Model.Partials;
using System.Collections.Generic;
using System.Linq;

namespace Service.Utilities
{
    public static class PrimaryHelper
    {
        public static void EnsureOneIsPrimaryAndSaveChanges<T>(T[] entityList, IPrimaryContext context) where T : IHasPrimary
        {
            if (!entityList.Any() || entityList.Count(ca => ca.IsPrimary) == 1)
            {
                return;
            }

            entityList[0].IsPrimary = true;

            context.SaveChanges();
        }

        public static void EnsureOneIsPrimary<T>(T[] entityList) where T : IHasPrimary
        {
            if (!entityList.Any() || entityList.Count(ca => ca.IsPrimary) == 1)
            {
                return;
            }

            entityList[0].IsPrimary = true;
        }

        public static bool HasAtMostOnePrimary<T>(IEnumerable<T> entityList) where T : IHasPrimary
        {
            return entityList == null || entityList.Count(a => a.IsPrimary) <= 1;
        }

    }
}
