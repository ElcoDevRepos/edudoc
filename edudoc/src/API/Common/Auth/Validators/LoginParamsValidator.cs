using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;

namespace API.Auth.Validators
{
    public class LoginParamsValidator : AuthClientParamsValidator<LoginParams>
    {
        public LoginParamsValidator()
        {
            //RuleFor(lp => lp.Password).NotEmpty();
            RuleFor(lp => lp.Username).NotEmpty();
        }
    }
}