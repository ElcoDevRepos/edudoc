using FluentValidation;

namespace Service.Auth.Validation
{
    public class PasswordConfirmerValidator<T> : PasswordCreationParamsValidator<T> where T : IPasswordConfirmer
    {
        private const string NoMatchErrorMessage = "Password must match confirmation";

        public PasswordConfirmerValidator()
        {
            RuleFor(pc => pc.Confirmation)
                .NotEmpty()
                .Length(0, 50)
                .Must(MatchPassword)
                .WithMessage(NoMatchErrorMessage);
        }

        private static bool MatchPassword(T confirmer, string confirm)
        {
            return confirm == confirmer.Password;
        }
    }
}