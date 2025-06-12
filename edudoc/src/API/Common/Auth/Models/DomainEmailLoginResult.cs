namespace API.Auth.Models
{
    public class DomainEmailLoginResult : ILoginResultDto
    {
        public string Email { get; set; }
        public LoginResult LoginResult { get; set; }
        public bool SentEmail { get; set; }
    }
}