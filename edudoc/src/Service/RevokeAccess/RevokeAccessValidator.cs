using System.Text.RegularExpressions;
using FluentValidation;
using Model;
using Service.Base.Validation;

namespace Service.RevokeAccesses
{
    internal class RevokeAccessValidator : AbstractValidator<RevokeAccess>
    {
        public RevokeAccessValidator()
        {
            RuleFor(r => r.ProviderId).NotNull();
            RuleFor(r => r.Date).NotNull();
        }
    }
}

