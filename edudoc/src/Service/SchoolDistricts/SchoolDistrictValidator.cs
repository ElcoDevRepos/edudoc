using FluentValidation;
using Model;
using Service.Base.Validation;
using System.Linq;

namespace Service.SchoolDistricts
{
    internal class SchoolDistrictValidator : AbstractValidator<SchoolDistrict>
    {
        protected readonly IPrimaryContext _context;
        private const int NpiLength = 10;
        private const int EinLength = 9;
        private const int IrnLength = 6;
        private const int ProviderNumberLength = 7;

        public SchoolDistrictValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(district => district.Name)
                .NotEmpty()
                .Length(0, 250)
                .Must(SchoolDistrictNameIsUnique)
                .WithMessage("Save Failed: Duplicate school district name and code.");
            RuleFor(district => district.NpiNumber)
                .Matches(RegexHelper.GetAllDigitsRegex(NpiLength)).WithMessage($"School district npi number must have exactly ${NpiLength} digits");
            RuleFor(district => district.EinNumber)
                .Matches(RegexHelper.GetAllDigitsRegex(EinLength)).WithMessage($"School district ein number must have exactly ${EinLength} digits");
            RuleFor(district => district.IrnNumber)
                .Matches(RegexHelper.GetAllDigitsRegex(IrnLength)).WithMessage($"School district irn number must have exactly ${IrnLength} digits");
            RuleFor(district => district.ProviderNumber)
                .Matches(RegexHelper.GetAllDigitsRegex(ProviderNumberLength)).WithMessage($"School district provider number must have exactly ${ProviderNumberLength} digits");

        }

        private bool SchoolDistrictNameIsUnique(SchoolDistrict schoolDistrict, string name)
        {
            return !_context.SchoolDistricts.Any(district => district.Id != schoolDistrict.Id && (district.Name == name && district.Code == schoolDistrict.Code) && !district.Archived);
        }
    }
}
