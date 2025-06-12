using Service.Auth.Validation;

namespace API.Auth.Models
{
    /// <summary>
    ///      Parameters for resetting a password from the ForgotPassword flow.
    /// </summary>
    public class ResetPasswordParams : IPasswordConfirmer, IAuthClientParams
    {
        public int AuthClientId { get; set; }
        public string AuthClientSecret { get; set; }
        public int AuthUserId { get; set; }
        public string Confirmation { get; set; }
        public string Password { get; set; }
        public string ResetKey { get; set; }
    }
}