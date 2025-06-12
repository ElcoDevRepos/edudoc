using System.Data.SqlClient;
using System.Data.SqlClient;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(EscMetaData))]
    public partial class Esc : IHasAddress<Address>
    {
        internal sealed class EscMetaData
        {
            private EscMetaData()
            {
            }

        }
    }
}
