using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;

namespace API.Auth.Validators
{
    public class GoogleLoginParamsValidator : AuthClientParamsValidator<GoogleLoginParams>
    {
        public GoogleLoginParamsValidator()
        {
            RuleFor(lp => lp.Email).NotEmpty();
            RuleFor(lp => lp.Token).NotEmpty();
        }
    }
}
