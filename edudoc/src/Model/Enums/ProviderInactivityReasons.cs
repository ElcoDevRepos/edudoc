using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.Enums
{
    public enum ProviderInactivityReasons
    {
        LeaveOfAbsence = 1,
        Exit,
        LicenseIssue,
        Deceased,
        Other,
    }
}
