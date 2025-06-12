using Service.Auth.Validation;

namespace API.Auth.Models
{
    /// <summary>
    ///      Parameter object for client applications to use when submitting a refresh token request
    ///      to the API.
    /// </summary>
    public class RefreshParams : IAuthClientParams
    {
        public int AuthClientId { get; set; }
        public string AuthClientSecret { get; set; }
        public int AuthUserId { get; set; }
        public string TokenIdentifier { get; set; }
    }
}