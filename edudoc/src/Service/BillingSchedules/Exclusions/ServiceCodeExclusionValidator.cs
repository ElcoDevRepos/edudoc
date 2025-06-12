using FluentValidation;
using Model;

namespace Service.BillingSchedules
{
    public class ServiceCodeExclusionValidator : AbstractValidator<BillingScheduleExcludedServiceCode>
    {
        public ServiceCodeExclusionValidator()
        {
        }
    }
}
