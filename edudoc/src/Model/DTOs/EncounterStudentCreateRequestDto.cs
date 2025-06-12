using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.DTOs
{
    public class EncounterStudentCreateRequestDto
    {
        public int StudentId { get; set; }
        public int EncounterId { get; set; }
        public int EncounterLocationId { get; set; }
        public int? StudentDeviationReasonId { get; set; }
    }

}
