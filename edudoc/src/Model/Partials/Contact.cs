using System.Data.SqlClient;
using System.Data.SqlClient;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(ContactMetaData))]
    public partial class Contact : IHasAddress<Address>
    {
        internal sealed class ContactMetaData
        {
            private ContactMetaData()
            {
            }

        }
    }
}
