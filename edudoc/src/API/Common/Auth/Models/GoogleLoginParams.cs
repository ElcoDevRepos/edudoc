using Service.Auth.Validation;

namespace API.Auth.Models
{
    /// <summary>
    ///      Parameter object for client applications to use when logging in with the API.
    /// </summary>
    public class GoogleLoginParams : IAuthClientParams
    {
        public int AuthClientId { get; set; }
        public string AuthClientSecret { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
