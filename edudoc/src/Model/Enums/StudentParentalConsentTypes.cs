using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.Enums
{
    public enum StudentParentalConsentTypes
    {
        ConfirmConsent = 1,
        NonConsent = 2,
        PendingConsent = 3,
    }
}
