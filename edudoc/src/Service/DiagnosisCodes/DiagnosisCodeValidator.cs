using FluentValidation;
using Model;
using System.Linq;

namespace Service.DiagnosisCodes
{
    internal class DiagnosisCodeValidator : AbstractValidator<DiagnosisCode>
    {
        protected readonly IPrimaryContext _context;

        public DiagnosisCodeValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(dc => dc.Code)
                .NotEmpty()
                .Length(0, 50)
                .Must(CodeIsUnique)
                .WithMessage("Save Failed: Duplicate Diagnosis Code.");
        }

        private bool CodeIsUnique(DiagnosisCode diagnosisCode, string code)
        {
            return !_context.DiagnosisCodes.Any(dc => dc.Id != diagnosisCode.Id && dc.Code == code && !dc.Archived);
        }
    }
}
