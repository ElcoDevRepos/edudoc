using FluentValidation;
using Model;
using System.Linq;

namespace Service.CaseLoads
{
    public class ProviderStudentValidator : AbstractValidator<ProviderStudent>
    {
        private IPrimaryContext _context;

        public ProviderStudentValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(ps => ps)
                .Must(NotOverlap)
                .WithMessage("Save Failed: IEP Start Date overlaps another service type assignment.");
        }

        private bool NotOverlap(ProviderStudent providerStudent)
        {
            return !_context.ProviderStudents.Any(ps => ps.StudentId == providerStudent.StudentId && ps.ProviderId == providerStudent.ProviderId);
        }
    }
}
