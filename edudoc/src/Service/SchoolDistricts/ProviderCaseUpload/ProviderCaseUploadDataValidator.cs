using FluentValidation;
using Model;
using System;
using System.Globalization;
using System.Linq;

namespace Service.SchoolDistricts.ProviderCaseUploads
{
    public class ProviderCaseUploadDataValidator : AbstractValidator<ProviderCaseUpload>
    {
        protected readonly IPrimaryContext _context;

        public ProviderCaseUploadDataValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(s => s.DateOfBirth).NotEmpty().Must(IsValidBirthdate);
            RuleFor(s => s.FirstName).NotEmpty().Length(1, 250);
            RuleFor(s => s.LastName).NotEmpty().Length(1, 250);
            RuleFor(s => s.Grade).NotEmpty().Length(1, 2);
            RuleFor(s => s.School).NotEmpty().Must(IsValidSchool);
            RuleFor(s => s.ProviderId).Must(IsValidProvider);
        }

        private bool IsValidBirthdate(ProviderCaseUpload pcu, string dob)
        {
            DateTime validDate;
            return DateTime.TryParse(dob, new CultureInfo("en-US"), DateTimeStyles.AdjustToUniversal, out validDate);
        }

        private bool IsValidSchool(ProviderCaseUpload pcu, string school)
        {
            return _context.Schools.Any(s => s.Name.ToLower().Trim() == school && s.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == pcu.DistrictId));
        }

        private bool IsValidProvider(ProviderCaseUpload pcu, int? providerId)
        {
            return providerId != null && _context.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == pcu.DistrictId && pesd.ProviderEscAssignment.ProviderId == providerId);
        }
    }
}
