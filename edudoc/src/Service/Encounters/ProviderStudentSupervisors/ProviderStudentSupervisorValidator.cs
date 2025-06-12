using FluentValidation;
using Model;
using System;
using System.Linq;

namespace Service.Encounters.ProviderStudentSupervisors
{
    public class ProviderStudentSupervisorValidator : AbstractValidator<ProviderStudentSupervisor>
    {
        protected IPrimaryContext Context;

        public ProviderStudentSupervisorValidator(IPrimaryContext context)
        {
            Context = context;
            RuleFor(pss => pss.EffectiveStartDate)
                .NotEmpty()
                .Must(notBeFuture)
                .WithMessage("This assignment cannot be for a future date");
            RuleFor(pss => pss)
                .Must(notAlreadyBeAssigned)
                .WithMessage("This supervisor/assistant relationship is already active.")
                .WithErrorCode("400");
        }

        private bool notBeFuture(DateTime effectiveDate) => effectiveDate <= DateTime.UtcNow;

        private bool notAlreadyBeAssigned(ProviderStudentSupervisor supervisor)
        {
            var conflictingDates = Context.ProviderStudentSupervisors.Where(pss => pss.StudentId == supervisor.StudentId && pss.AssistantId == supervisor.AssistantId && pss.SupervisorId == supervisor.SupervisorId && pss.EffectiveEndDate == null).ToList();
            return !conflictingDates.Any();
        }

    }
}
