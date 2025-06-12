using System.Data.SqlClient;
using System.Data.SqlClient;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(SchoolDistrictMetaData))]
    public partial class SchoolDistrict : IHasAddress<Address>
    {
        internal sealed class SchoolDistrictMetaData
        {
            private SchoolDistrictMetaData()
            {
            }

        }

    }
}
