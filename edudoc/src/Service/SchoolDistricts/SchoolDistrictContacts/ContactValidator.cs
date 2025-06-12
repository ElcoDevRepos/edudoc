using BreckServiceBase.Utilities.Interfaces;
using FluentValidation;
using Model;
using Service.Utilities.Validators;

namespace Service.SchoolDistricts.SchoolDistrictContacts
{
    public class ContactValidator : AbstractValidator<Contact>
    {
        public ContactValidator(IEmailHelper emailHelper)
        {
            RuleFor(cc => cc.FirstName).NotEmpty().Length(0, 50);
            RuleFor(cc => cc.LastName).NotEmpty().Length(0, 50);
            RuleFor(cc => cc.Title).Length(0, 50);
            RuleFor(cc => cc.Email)
                .Must(emailHelper.BeAnEmptyOrValidEmail)
                .WithMessage("Email must be valid if present.");
            RuleFor(cc => cc.Address)
                .SetValidator(new AddressValidator())
                .When(ca => ca.Address != null);
        }
    }

}
