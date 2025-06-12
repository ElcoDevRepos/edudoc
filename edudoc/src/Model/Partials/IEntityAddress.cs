using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.Partials
{
    public interface IEntityAddress : IHasPrimary
    {
        int AddressId { get; set; }
    }
}
