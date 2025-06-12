using FluentValidation;
using Model;

namespace Service.Utilities.Validators
{
    public class AddressValidator : AbstractValidator<Address>
    {
        public AddressValidator()
        {
            const int defaultLength = 50;
            const int codeLength = 2;
            const int zipLength = 20;

            RuleFor(a => a.Address1).NotEmpty().Length(0, defaultLength);
            RuleFor(a => a.Address2).Length(0, defaultLength);
            RuleFor(a => a.City).Length(0, defaultLength);
            RuleFor(a => a.StateCode).NotEmpty().Length(codeLength);
            RuleFor(a => a.CountryCode).NotEmpty().Length(codeLength);
            RuleFor(a => a.Zip).Length(0, zipLength);
            RuleFor(a => a.Province).Length(0, zipLength);
        }
    }
}

