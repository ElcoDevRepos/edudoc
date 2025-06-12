using System.Data.SqlClient;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(AuthUserMetaData))]
    public partial class AuthUser : IVerifiable
    {
        internal sealed class AuthUserMetaData
        {
            private AuthUserMetaData()
            {
            }

            // ignore fields we don't want indexed or sent to front end
            [JsonIgnore]
            public byte[] Password { get; set; } // Password

            [JsonIgnore]
            public byte[] Salt { get; set; } // Salt

            [JsonIgnore]
            public byte[] ResetKey { get; set; } // ResetKey

            [JsonIgnore]
            public DateTime ResetKeyExpirationUtc { get; set; } // ResetKeyExpirationUtc
        }
    }
}