using FluentValidation;
using Model;

namespace Service.Base.Validation
{
    /// <summary>
    /// Abstract validator for named entities.  Checks that the object's name is not empty
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class BasicNameEntityValidator<T> : AbstractValidator<T>
        where T : IBasicNameEntity
    {
        public BasicNameEntityValidator()
        {
            RuleFor(ent => ent.Name).NotEmpty().WithMessage("Name must not be empty");
        }
    }
}
