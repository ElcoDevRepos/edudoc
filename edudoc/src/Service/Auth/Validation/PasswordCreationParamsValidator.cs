using FluentValidation;
using Service.Utilities;

namespace Service.Auth.Validation
{
    public class PasswordCreationParamsValidator<T> : AbstractValidator<T> where T : IPasswordCreationParams
    {
        public PasswordCreationParamsValidator()
        {
            RuleFor(pas => pas.Password)
                .NotEmpty()
                .Length(0, 50)
                .Must(PasswordHelper.BeAStrongPassword)
                .WithMessage(RegexPatterns.PasswordErrorMsg);
        }
    }
}
