using System.Data.SqlClient;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(PhoneTypeMetaData))]
    public partial class PhoneType
    {
        internal sealed class PhoneTypeMetaData
        {
            private PhoneTypeMetaData()
            {
            }


            [JsonIgnore]
            public ICollection<UserPhone> UserPhones { get; set; } // UserPhones.FK_UserPhones_PhoneTypes


        }
    }
}
