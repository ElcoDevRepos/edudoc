
using FluentValidation;
using Model;

namespace Service.ServiceUnitRules
{
    public class ServiceUnitRuleValidator: AbstractValidator<ServiceUnitRule>
    {
        public ServiceUnitRuleValidator()
        {
        }
    }
}
