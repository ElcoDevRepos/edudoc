using FluentValidation;
using Model;
using System.Linq;

namespace Service.SchoolDistricts
{
    internal class EscValidator : AbstractValidator<Esc>
    {
        protected readonly IPrimaryContext _context;

        public EscValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(esc => esc.Name)
                .NotEmpty()
                .Length(0, 250)
                .Must(EscNameIsUnique)
                .WithMessage("Save Failed: Duplicate ESC name.");
        }

        private bool EscNameIsUnique(Esc schoolDistrict, string name)
        {
            return !_context.Escs.Any(esc => esc.Id != esc.Id && esc.Name == name && !esc.Archived);
        }
    }
}
