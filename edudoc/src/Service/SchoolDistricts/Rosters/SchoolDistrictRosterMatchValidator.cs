
using FluentValidation;
using Model;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;

namespace Service.SchoolDistricts.Rosters
{
    public class SchoolDistrictRosterMatchValidator : AbstractValidator<SchoolDistrictRoster>
    {
        protected readonly IPrimaryContext _context;
        private readonly Func<SchoolDistrictRoster, Expression<Func<Student, bool>>> _isMatch;
        private readonly IEnumerable<Student> _districtStudents;
        public SchoolDistrictRosterMatchValidator(IPrimaryContext context,
            Func<SchoolDistrictRoster, Expression<Func<Student, bool>>> isMatch, IEnumerable<Student> districtStudents)
        {
            _context = context;
            _isMatch = isMatch;
            _districtStudents = districtStudents;
            RuleFor(s => s.SchoolDistrictId).Must(HasAtMostOneMatchingStudent);
        }

        /// <summary>
        /// Checks that there is only one matching student at most in district or else log duplicate issue
        /// </summary>
        /// <param name="sdr"></param>
        /// <param name="districtId"></param>
        /// <returns></returns>
        private bool HasAtMostOneMatchingStudent(SchoolDistrictRoster sdr, int districtId)
        {
            return !(_districtStudents.Count((s) =>
                s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim() &&
                DateTime.TryParse(sdr.DateOfBirth, out var date) &&
                s.DateOfBirth.Day == date.Date.Day && s.DateOfBirth.Month == date.Date.Month && s.DateOfBirth.Year == date.Date.Year &&
                (s.LastName.ToLower().Trim() == sdr.LastName.ToLower().Trim()
                ||
                (s.StudentCode != null && s.StudentCode.Trim() == sdr.StudentCode.Trim() &&
                s.Address != null && s.Address.Address1.ToLower().Trim() == sdr.Address1.ToLower().Trim() &&
                s.Address.Address2.ToLower().Trim() == sdr.Address2.ToLower().Trim() &&
                s.Address.City.ToLower().Trim() == sdr.City.ToLower().Trim() && s.Address.Zip.Trim() == sdr.Zip.Trim())
                )) == 1);
        }
    }
}
