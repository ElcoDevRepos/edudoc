using Service.Auth.Validation;

namespace API.Auth.Models
{
    /// <summary>
    ///      Parameters for updating a user's password.
    /// </summary>
    public class UpdatePasswordParams : IPasswordConfirmer
    {
        public int AuthUserId { get; set; }
        public string Confirmation { get; set; }
        public string OldPassword { get; set; }
        public string Password { get; set; }
    }
}