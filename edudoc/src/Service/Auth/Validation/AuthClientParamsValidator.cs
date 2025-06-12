using FluentValidation;

namespace Service.Auth.Validation
{
    public class AuthClientParamsValidator<T> : AbstractValidator<T> where T : IAuthClientParams
    {
        public AuthClientParamsValidator()
        {
            RuleFor(ac => ac.AuthClientId).NotEmpty();
            RuleFor(ac => ac.AuthClientSecret).NotEmpty();
        }
    }
}