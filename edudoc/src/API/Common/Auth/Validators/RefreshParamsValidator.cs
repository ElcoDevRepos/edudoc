using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;

namespace API.Auth.Validators
{
    public class RefreshParamsValidator : AuthClientParamsValidator<RefreshParams>
    {
        public RefreshParamsValidator()
        {
            RuleFor(rp => rp.TokenIdentifier).NotEmpty();
            RuleFor(rp => rp.AuthUserId).NotEmpty();
        }
    }
}