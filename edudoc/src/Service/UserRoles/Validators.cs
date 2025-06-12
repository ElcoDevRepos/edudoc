using FluentValidation;
using Model;
using Service.Utilities;

namespace Service.UserRoles
{
    internal class UserRoleValidator : BasicNameValidator<UserRole>
    {
        public UserRoleValidator(IUserRoleService service)
        {
            RuleFor(u => u.Name)
                .Must(service.BeAUniqueUserRoleName)
                .WithMessage("User Role name must be unique.");
            RuleFor(u => u.IsEditable)
                .Equal(true)
                .WithMessage("This User Role is a system default and cannot be edited");
        }
    }
}
