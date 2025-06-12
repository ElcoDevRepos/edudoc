using FluentValidation;
using Model;

namespace Service.Goals
{
    public class GoalValidator : AbstractValidator<Goal>
    {
        public GoalValidator()
        {
            RuleFor(g => g.Description).NotEmpty();
            RuleFor(g => g.ServiceCodes).NotEmpty();
        }
    }
}
