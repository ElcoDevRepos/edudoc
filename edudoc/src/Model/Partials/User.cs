using System.Data.SqlClient;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(UserMetaData))]
    public partial class User : IHasDocuments<Document>, IHasAddress<Address>
    {
        internal sealed class UserMetaData
        {
            private UserMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<Document> Documents_UploadedBy { get; set; } // Documents.FK_Documents_Users
        }
    }
}
