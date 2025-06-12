using System;

namespace Model.DTOs
{
    public class EncounterStudentStatusesLogDto
    {
        public string StatusName { get; set; }
        public int StatusId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
