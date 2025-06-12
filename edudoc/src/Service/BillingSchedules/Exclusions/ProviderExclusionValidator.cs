using FluentValidation;
using Model;

namespace Service.BillingSchedules
{
    public class ProviderExclusionValidator : AbstractValidator<BillingScheduleExcludedProvider>
    {
        public ProviderExclusionValidator()
        {
        }
    }
}
