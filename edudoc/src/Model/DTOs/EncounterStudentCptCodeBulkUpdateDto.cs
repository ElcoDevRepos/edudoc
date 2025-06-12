using System.Data.SqlClient;
using System.Data.SqlClient;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class EncounterStudentCptCodeBulkUpdateDto
    {
        public int EncounterStudentId { get; set; }
        public List<int> SelectedCptCodeIds { get; set; }
        public int EncounterStudentMinutes { get; set; }
    }
}
