using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class EncounterEsignRejectionDTO
    {
        public int EncounterStatusId { get; set; }
        public string SupervisorComments { get; set; }
        public int? SupervisorESignedById { get; set; }
    }
}
