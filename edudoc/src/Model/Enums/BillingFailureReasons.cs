using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.Enums
{
    public enum BillingFailureReasons
    {
        MedicaidNo = 1,
        Parental_Consent,
        Provider_Signature,
        Supervisor_Signature,
        Referral,
        CPT_Code,
        Address_Over_Max_Length,
        Address,
        Service_Unit_Rule_Violation
    }
}
