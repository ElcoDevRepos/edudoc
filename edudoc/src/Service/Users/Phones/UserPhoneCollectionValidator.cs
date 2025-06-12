using Model;
using Service.Utilities.Validators;

namespace Service.Users.Phones
{
    internal class UserPhoneCollectionValidator : PhoneCollectionValidator<UserPhone>
    {
        public UserPhoneCollectionValidator()
            : base(new UserPhoneValidator())
        {
        }
    }
}
