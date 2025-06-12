using Service.Auth.Validation;

namespace API.Auth.Models
{
    public class DomainEmailPasswordParams : IAuthClientParams
    {
        public int AuthClientId { get; set; }
        public string AuthClientSecret { get; set; }
        public string ResetKey { get; set; }
    }

    public class ImpersonationParameters : IAuthClientParams
    {
        public int AuthClientId { get; set; }
        public string AuthClientSecret { get; set; }
        public int ImpersonateeUserId { get; set; }
        public int ImpersonatingUserId { get; set; }
    }

}
