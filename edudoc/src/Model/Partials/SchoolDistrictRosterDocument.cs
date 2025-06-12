using System.Data.SqlClient;
using System.Data.SqlClient;
using Model.Partials.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(SchoolDistrictRosterDocumentMetaData))]
    public partial class SchoolDistrictRosterDocument : IBaseDocument
    {
        internal sealed class SchoolDistrictRosterDocumentMetaData
        {
            private SchoolDistrictRosterDocumentMetaData()
            {
            }

        }
    }
}
