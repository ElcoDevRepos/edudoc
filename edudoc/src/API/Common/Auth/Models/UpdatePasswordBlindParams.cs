using Service.Auth.Validation;

namespace API.Auth.Models
{
    /// <summary>
    ///      Parameters for updating a user's password, without having to know the existing one.
    /// </summary>
    public class UpdatePasswordBlindParams : IPasswordConfirmer
    {
        public int AuthUserId { get; set; }
        public string Confirmation { get; set; }
        public string Password { get; set; }
    }
}