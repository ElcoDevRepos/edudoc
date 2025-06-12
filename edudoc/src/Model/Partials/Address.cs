using System.Data.SqlClient;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(AddressMetaData))]
    public partial class Address
    {
        internal sealed class AddressMetaData
        {
            private AddressMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<User> Users { get; set; } // Users.FK_Users_Addresses


        }
    }
}
