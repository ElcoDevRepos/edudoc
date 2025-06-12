using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;

namespace API.Auth.Validators
{
    public class ResetPasswordParamsValidator : PasswordConfirmerValidator<ResetPasswordParams>
    {
        public ResetPasswordParamsValidator()
        {
            RuleFor(rp => rp.AuthUserId).NotEmpty();
            RuleFor(rp => rp.ResetKey).NotEmpty();
            // since we can't inherit AuthClientParamsValidator too,
            // need to check the AuthClient params explicitly
            RuleFor(rp => rp.AuthClientId).NotEmpty();
            RuleFor(rp => rp.AuthClientSecret).NotEmpty();
        }
    }
}