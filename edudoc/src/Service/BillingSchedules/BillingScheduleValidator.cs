using FluentValidation;
using Model;
using System.Linq;

namespace Service.BillingSchedules
{
    public class BillingScheduleValidator : AbstractValidator<BillingSchedule>
    {
        private readonly IPrimaryContext _context;
        public BillingScheduleValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(s => s.Name).NotEmpty();
            RuleFor(s => s.ScheduledDate).NotEmpty();
        }
    }
}
