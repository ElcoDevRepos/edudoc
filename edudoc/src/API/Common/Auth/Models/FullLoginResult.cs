using Service.Auth.Models;

namespace API.Auth.Models
{
    public class FullLoginResult : ILoginResultDto
    {
        public LoginResult LoginResult { get; set; }
        public UserDetails UserDetails { get; set; }
    }
}
