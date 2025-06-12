using FluentValidation;
using Model;
using System.Linq;

namespace Service.CptCodes
{
    public class CptCodeValidator : AbstractValidator<CptCode>
    {
        private readonly IPrimaryContext _context;
        public CptCodeValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(c => c.Code).NotEmpty().Must(IsUniqueCode).WithMessage("CPT Code must be unique.");
            RuleFor(c => c.Description).NotEmpty();
            RuleFor(c => c.BillAmount).NotEmpty();
        }

        private bool IsUniqueCode(CptCode cpt, string code)
        {
            return !_context.CptCodes.Any(c => c.Code == code && c.Id != cpt.Id && !c.Archived);
        }
    }
}
