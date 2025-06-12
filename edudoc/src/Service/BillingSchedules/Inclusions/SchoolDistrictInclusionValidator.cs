using FluentValidation;
using Model;

namespace Service.BillingSchedules
{
    public class SchoolDistrictInclusionValidator : AbstractValidator<BillingScheduleDistrict>
    {
        public SchoolDistrictInclusionValidator()
        {
        }
    }
}
