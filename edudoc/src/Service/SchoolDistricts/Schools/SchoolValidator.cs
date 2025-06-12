using FluentValidation;
using Model;

namespace Service.SchoolDistricts
{
    internal class SchoolValidator : AbstractValidator<School>
    {
        protected readonly IPrimaryContext _context;

        public SchoolValidator(IPrimaryContext context)
        {

        }

    }
}
