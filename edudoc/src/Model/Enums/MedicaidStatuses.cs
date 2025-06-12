using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model.Enums
{
    public enum MedicaidStatuses
    {
        Confirmed = 1,
        NoAcknowledgement,
        Pending
    }
}
