
using FluentValidation;
using Model;
using Model.Enums;

namespace Service.StudentParentalConsents
{
    public class StudentParentalConsentValidator : AbstractValidator<StudentParentalConsent>
    {

        public StudentParentalConsentValidator()
        {
            RuleFor(c => c.ParentalConsentEffectiveDate).NotNull().When(c => c.ParentalConsentTypeId != (int)StudentParentalConsentTypes.PendingConsent);
        }

    }
}
