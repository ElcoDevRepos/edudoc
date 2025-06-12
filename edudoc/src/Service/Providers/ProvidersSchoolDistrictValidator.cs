using FluentValidation;
using Model;
using System;
using System.Linq;


namespace Service.Providers
{
    public class ProviderEscValidator : AbstractValidator<ProviderEscAssignment>
    {
        protected readonly IPrimaryContext _context;

        public ProviderEscValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(psd => psd.StartDate).NotNull().WithMessage("Start date is required");
            RuleFor(psd => psd)
                .Must(psd => psd.StartDate < psd.EndDate)
                .When(psd => psd.EndDate != null)
                .WithMessage("Start date should be less than or equal to End date");
        }
    }
}
