using FluentValidation;
using Model;
using System.Linq;

namespace Service.Encounters.ServiceOutcomes
{
    internal class ServiceOutcomeValidator : AbstractValidator<ServiceOutcome>
    {
        protected readonly IPrimaryContext _context;

        public ServiceOutcomeValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(outcome => outcome.Notes)
                .NotEmpty()
                .Length(0, 250)
                .Must(OutcomeNameIsUnique)
                .WithMessage("Save Failed: Duplicate Service Outcome notes.");
        }

        private bool OutcomeNameIsUnique(ServiceOutcome outcome, string notes)
        {
            return !_context.ServiceOutcomes.Any(so => so.Id != outcome.Id && so.GoalId == outcome.GoalId && so.Notes == notes && !so.Archived);
        }
    }

}
