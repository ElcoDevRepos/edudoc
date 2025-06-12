using FluentValidation;
using Model.Partials.Interfaces;

namespace Service.Base.Validation
{
    /// <summary>
    /// Abstract validator for objects that have start and end dates.  Checks that the start date is before the end date
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class StartEndDateValidator<T> : AbstractValidator<T>
        where T : IHasStartEndDate
    {
        public StartEndDateValidator()
        {
            RuleFor(obj => obj).Must(StartDateBeforeEndDate).WithMessage("Start date must be before end date.");
        }

        private bool StartDateBeforeEndDate(T validationObject)
        {
            return validationObject.AsOfDate < validationObject.ExpirationDate;
        }
    }
}
