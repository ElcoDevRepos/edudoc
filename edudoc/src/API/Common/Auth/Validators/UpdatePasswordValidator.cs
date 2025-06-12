using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;

namespace API.Auth.Validators
{
    public class UpdatePasswordValidator : PasswordConfirmerValidator<UpdatePasswordParams>
    {
        public UpdatePasswordValidator()
        {
            RuleFor(up => up.AuthUserId)
                .NotEmpty();
            RuleFor(up => up.OldPassword)
                .NotEmpty()
                .Length(0, 50);
        }
    }
}