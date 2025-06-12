using API.Auth.Models;
using FluentValidation;
using Service.Auth.Validation;

namespace API.Auth.Validators
{
    public class DomainEmailPasswordParamsValidator : AuthClientParamsValidator<DomainEmailPasswordParams>
    {
        public DomainEmailPasswordParamsValidator()
        {
            RuleFor(depp => depp.ResetKey).NotEmpty();
        }
    }
}