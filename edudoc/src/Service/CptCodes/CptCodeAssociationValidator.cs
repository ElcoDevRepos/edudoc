using FluentValidation;
using Model;

namespace Service.CptCodes
{
    public class CptCodeAssociationValidator : AbstractValidator<CptCodeAssocation>
    {
        public CptCodeAssociationValidator()
        {
            RuleFor(a => a.ServiceCodeId).NotNull();
            RuleFor(a => a.ProviderTitleId).NotNull();
            RuleFor(a => a.ServiceTypeId).NotNull();
            RuleFor(a => a.CptCodeId).NotNull();
        }

    }
}
