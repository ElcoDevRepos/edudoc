using FluentValidation;
using Model;

namespace Service.Admin.ElectronicSignatures
{
    public class ElectronicSignatureValidator : AbstractValidator<ESignatureContent>
    {

        public ElectronicSignatureValidator()
        {
            RuleFor(s => s.Content).NotEmpty();
        }
    }
}
