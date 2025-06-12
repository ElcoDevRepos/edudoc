
using FluentValidation;
using Model;
using System;
using System.Globalization;
using System.Linq;

namespace Service.SchoolDistricts.Rosters
{
    public class SchoolDistrictRosterDataValidator : AbstractValidator<SchoolDistrictRoster>
    {
        protected readonly IPrimaryContext _context;

        public SchoolDistrictRosterDataValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(s => s.Address1).NotEmpty().Length(1, 250);
            RuleFor(s => s.Address2).Length(0, 250);
            RuleFor(s => s.City).NotEmpty().Length(1, 250);
            RuleFor(s => s.DateOfBirth).NotEmpty().Must(IsValidBirthdate);
            RuleFor(s => s.Grade).NotEmpty().Length(1, 2);
            RuleFor(s => s.FirstName).NotEmpty().Length(1, 250);
            RuleFor(s => s.LastName).NotEmpty().Length(1, 250);
            RuleFor(s => s.StateCode).NotEmpty().Must(IsValidStateCode);
            RuleFor(s => s.StudentCode).NotEmpty().Length(1, 12);
            RuleFor(s => s.Zip).NotEmpty().Must(IsValidZipCode);
            RuleFor(s => s.SchoolBuilding).NotEmpty().Length(1, 250);
        }

        private bool IsValidZipCode(SchoolDistrictRoster sdr, string zip)
        {
            // If zip code has hyphen, grab zip code before hyphen
            string trimmedZip = zip.Trim();
            int dashIndex = trimmedZip.IndexOf('-');
            string zipCode = dashIndex > 0 ? trimmedZip.Substring(0, dashIndex) : trimmedZip;
            return _context.Counties.Any(c => c.Zip == zipCode);
        }

        private bool IsValidBirthdate(SchoolDistrictRoster sdr, string dob)
        {
            DateTime validDate;
            return DateTime.TryParse(dob, new CultureInfo("en-US"), DateTimeStyles.AdjustToUniversal, out validDate);
        }

        private bool IsValidStateCode(SchoolDistrictRoster sdr, string stateCode)
        {
            return stateCode == "OH";
        }

    }
}
