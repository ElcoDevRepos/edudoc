using System.Data.SqlClient;
using System.Data.SqlClient;

namespace Model.DTOs
{
    public class ClaimAuditRequestDto
    {
        public int EncounterStudentId { get; set; }
        public int StatusId { get; set; }
        public string ReasonForReturn { get; set; }
        public string ReasonForAbandonment { get; set; }
    }
}
