
using FluentValidation;
using Model;
using System;

namespace Service.Students
{
    public class StudentIEPServicesValidator : AbstractValidator<IepService>
    {
        public StudentIEPServicesValidator()
        {
            RuleFor(services => services.StartDate)
                .NotEmpty()
                .WithMessage("Save Failed: IEP Services Start Date cannot be empty")
                .Must(StartTimeComesBeforeEnd)
                .WithMessage("Save Failed: IEP Services Start Date must be before End Date.");
            RuleFor(services => services.EndDate)
                .NotEmpty()
                .WithMessage("Save Failed: IEP Services End Date cannot be empty");
            RuleFor(services => services.EtrExpirationDate)
                .NotEmpty()
                .WithMessage("Save Failed: IEP ETR Expiration End Date cannot be empty");
        }

        private bool StartTimeComesBeforeEnd(IepService service, DateTime value)
        {
            return value < service.EndDate;
        }

    }
}
