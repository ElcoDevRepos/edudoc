using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;
using Service.Utilities;

namespace API.Auth.Validators
{
    public class CreateUserParamsValidator : PasswordCreationParamsValidator<CreateUserParams>
    {
        public CreateUserParamsValidator()
        {
            RuleFor(cp => cp.Username).NotEmpty()
                .Length(0, 50)
                .Matches(RegexPatterns.UsernamePattern)
                .WithMessage(RegexPatterns.UsernameErrorMsg);
        }
    }
}
