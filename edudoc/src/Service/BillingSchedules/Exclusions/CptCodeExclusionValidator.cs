using FluentValidation;
using Model;

namespace Service.BillingSchedules
{
    public class CptCodeExclusionValidator : AbstractValidator<BillingScheduleExcludedCptCode>
    {
        public CptCodeExclusionValidator()
        {
        }
    }
}
