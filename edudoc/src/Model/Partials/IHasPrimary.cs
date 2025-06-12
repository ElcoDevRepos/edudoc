using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.Partials
{
    public interface IHasPrimary
    {
        bool IsPrimary { get; set; }
    }
}
