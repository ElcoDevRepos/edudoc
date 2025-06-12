using Service.Auth.Validation;

namespace API.Auth.Models
{
    /// <summary>
    ///      Parameter object for client applications to use when creating a new AuthUser through the API.
    /// </summary>
    public class CreateUserParams : IPasswordCreationParams
    {
        public string Password { get; set; }
        public string Username { get; set; }
    }
}
