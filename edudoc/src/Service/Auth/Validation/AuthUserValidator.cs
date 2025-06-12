using FluentValidation;
using Model;
using Service.Utilities;

namespace Service.Auth.Validation
{
    internal class AuthUserValidator : AbstractValidator<AuthUser>
    {
        private const int UserNameLength = 50;

        public AuthUserValidator(IAuthService service)
        {
            RuleFor(a => a.Username)
                .NotEmpty()
                .Length(0, UserNameLength)
                .Matches(RegexPatterns.UsernamePattern)
                .WithMessage(RegexPatterns.UsernameErrorMsg);
            RuleFor(a => a.Username)
                .Must(service.IsUniqueUsername)
                .WithMessage("Username already taken");
            RuleFor(a => a.UserRole).NotEmpty();
        }
    }
}
