using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class EncounterEsignAssistantDTO
    {
        public bool AssistantSigning { get; set; }
        public DateTime DateESigned { get; set; }
        public string ESignatureText { get; set; }
        public int ESignedById { get; set; }
        public int EncounterStatusId { get; set; }
        public DateTime SupervisorDateESigned { get; set; }
        public string SupervisorESignatureText { get; set; }
        public int SupervisorESignedById { get; set; }
    }
}
