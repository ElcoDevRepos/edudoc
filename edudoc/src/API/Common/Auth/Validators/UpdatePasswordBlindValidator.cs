using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;

namespace API.Auth.Validators
{
    public class UpdatePasswordBlindValidator : PasswordConfirmerValidator<UpdatePasswordBlindParams>
    {
        public UpdatePasswordBlindValidator()
        {
            RuleFor(upbp => upbp.AuthUserId).NotEmpty();
        }
    }
}