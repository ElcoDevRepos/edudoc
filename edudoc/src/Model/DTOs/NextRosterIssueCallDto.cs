using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.DTOs
{
    public class NextRosterIssueCallDto
    {
        public int RosterIssueId { get; set; }
        public string Order { get; set; }
        public string OrderDirection { get; set; }
    }
}
