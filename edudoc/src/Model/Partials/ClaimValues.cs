using System.Data.SqlClient;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(ClaimValueMetaData))]
    public partial class ClaimValue
    {
        internal sealed class ClaimValueMetaData
        {
            private ClaimValueMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<UserRoleClaim> UserRoleClaims { get; set; } // Many to many mapping
        }
    }
}