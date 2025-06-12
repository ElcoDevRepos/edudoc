using FluentValidation;
using Model;

namespace Service.BillingFailures
{
    public class BillingFailureValidator : AbstractValidator<BillingFailure>
    {
        public BillingFailureValidator()
        {
        }
    }
}
