using System.Text.RegularExpressions;
using FluentValidation;
using Model;
using Service.Base.Validation;

namespace Service.Providers
{
    internal class ProviderValidator : AbstractValidator<Provider>
    {
        private const int NpiLength = 10;

        public ProviderValidator()
        {
            RuleFor(p => p.Npi)
                .Must(BeAnOptionalValidNpi)
                .WithMessage($"Provider NPI must have exactly {NpiLength} digits");
        }

        public bool BeAnOptionalValidNpi(string npi)
        {
            Regex regex = RegexHelper.GetAllDigitsRegex(NpiLength);
            return regex.IsMatch(npi) || npi.Length == 0;
        }
    }
}

