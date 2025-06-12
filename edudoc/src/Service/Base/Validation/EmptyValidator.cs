using FluentValidation;
using Model;

namespace Service.Base.Validation
{
    public class EmptyValidator<T> : AbstractValidator<T>
        where T : class, IEntity, new()
    {
    }
}
