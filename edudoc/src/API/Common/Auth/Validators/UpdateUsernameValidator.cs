using API.Auth.Models;
using FluentValidation;
using Service.Utilities;

namespace API.Auth.Validators
{
    public class UpdateUsernameValidator : AbstractValidator<UpdateUsernameParams>
    {
        public UpdateUsernameValidator()
        {
            RuleFor(uu => uu.AuthUserId)
                .NotEmpty();
            RuleFor(uu => uu.Username)
                .NotEmpty()
                .Matches(RegexPatterns.UsernamePattern)
                .WithMessage(RegexPatterns.UsernameErrorMsg);
        }
    }
}