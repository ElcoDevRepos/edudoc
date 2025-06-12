using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.Partials.Interfaces
{
    public interface IHasStartEndDate
    {
        DateTime AsOfDate { get; set; }
        DateTime ExpirationDate { get; set; }
    }
}
