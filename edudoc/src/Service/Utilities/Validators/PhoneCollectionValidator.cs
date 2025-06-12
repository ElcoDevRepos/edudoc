using FluentValidation;
using Model;
using Model.Partials;
using Service.Common.Phone;

namespace Service.Utilities.Validators
{
    public class PhoneCollectionValidator<T> : AbstractValidator<PhoneCollection<T>> where T : IHasPhoneNumber, IHasPrimary
    {
        internal PhoneCollectionValidator(PhoneValidator<T> phoneValidator)
        {
            RuleFor(upc => upc.Phones)
                .Must(PrimaryHelper.HasAtMostOnePrimary)
                .ForEach(phone => phone.SetValidator(phoneValidator));
        }
    }
}
