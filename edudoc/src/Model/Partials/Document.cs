using System.Data.SqlClient;
using System.Data.SqlClient;
using Model.Partials.Interfaces;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(DocumentMetaData))]
    public partial class Document : IBaseDocument
    {
        internal sealed class DocumentMetaData
        {
            private DocumentMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<User> Users { get; set; } // Many to many mapping

        }
    }
}
