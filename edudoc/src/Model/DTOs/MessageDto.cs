using System.Data.SqlClient;
using System.Data.SqlClient;


namespace DTO
{
    public class MessageDto 
    {
     public bool IsRead { get; set; }
        public int Id { get; set; }
        public string Description { get; set; }
        public string Body { get; set; }
    }
}
