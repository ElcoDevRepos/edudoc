using Service.Auth.Validation;

namespace API.Auth.Models
{
    /// <summary>
    ///      Parameter object for client applications to use when logging in with the API.
    /// </summary>
    public class LoginParams : IAuthClientParams
    {
        public int AuthClientId { get; set; }
        public string AuthClientSecret { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
    }
}