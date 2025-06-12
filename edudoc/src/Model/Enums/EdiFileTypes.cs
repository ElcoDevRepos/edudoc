using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.Enums
{
    public enum EdiFileTypes
    {
        HealthCareClaim837 = 1,
        HealthCareClaimResponse835,
        RosterValidation271,
        RosterValidationResponse270
    }
}
