using BreckServiceBase.Utilities.Interfaces;
using FluentValidation;
using Model;
using System.Linq;

namespace Service.Users
{
    internal class UserValidator : AbstractValidator<User>
    {
        protected IPrimaryContext Context;
        private readonly IEmailHelper _emailHelper;
        public UserValidator(IPrimaryContext context, IEmailHelper emailHelper)
        {
            Context = context;
            _emailHelper = emailHelper;
            RuleFor(u => u.FirstName).NotEmpty().Length(0, 50);
            RuleFor(u => u.LastName).NotEmpty().Length(0, 50);
            RuleFor(u => u.Email).NotEmpty().Length(0, 50)
                .Must(_emailHelper.BeAnEmptyOrValidEmail)
                .WithMessage(Utilities.RegexPatterns.EmailErrorMsg)
                .Must(IsUniqueEmail)
                .WithMessage("This email address is already associated with an account.");
        }

        private bool IsUniqueEmail(User user, string email)
        {
            return !Context.Users.Any(u => u.Email == email && u.Id != user.Id);
        }
    }
}
