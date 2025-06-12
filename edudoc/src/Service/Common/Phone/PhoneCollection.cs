using Model;
using System.Collections.Generic;

namespace Service.Common.Phone
{
    public class PhoneCollection<T> where T : IHasPhoneNumber
    {
        public IEnumerable<T> Phones { get; set; }
    }
}
