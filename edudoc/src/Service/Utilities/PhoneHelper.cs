using Model;
using System.Collections.Generic;
using System.Linq;

namespace Service.Utilities
{
    public static class PhoneHelper
    {

        /// <summary>
        ///     Ensures there are no duplicate phone numbers.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="nums"></param>
        /// <returns>Returns a bool indicating whether there are duplicates.</returns>
        public static bool NotHaveDuplicatePhoneNumbers<T>(ICollection<T> nums) where T : IHasPhoneNumber
        {
            return nums.Select(n => n.Phone + n.Extension).Distinct().Count() == nums.Count;
        }

    }

}
