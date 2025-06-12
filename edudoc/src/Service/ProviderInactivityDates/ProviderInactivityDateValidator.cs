using FluentValidation;
using Model;

namespace Service.ProviderInactivityDates
{
    internal class ProviderInactivityDateValidator : AbstractValidator<ProviderInactivityDate>
    {
        public ProviderInactivityDateValidator()
        {
            RuleFor(pid => pid.ProviderId).NotEmpty();
            RuleFor(pid => pid).Must(StartEndDateValidator).WithMessage("Start date must be before end date.");
        }

        private bool StartEndDateValidator(ProviderInactivityDate pid)
        {
            return pid.ProviderInactivityEndDate != null ?pid.ProviderInactivityStartDate <= pid.ProviderInactivityEndDate : true;
        }
    }
}
