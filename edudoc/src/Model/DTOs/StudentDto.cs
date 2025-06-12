using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.DTOs
{
    public class StudentDto
    {
        public Student Student { get; set; }
        public bool CanBeArchived { get; set; }
        public int SignedEncounterCount { get; set; }
    }
}
