using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.DTOs
{
    public class AuthUserDTO
    {
        public string Username { get; set; }
        public int RoleId { get; set; }
        public string Password { get; set; }
    }
}
