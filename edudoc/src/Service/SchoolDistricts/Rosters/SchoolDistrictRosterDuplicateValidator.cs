
using FluentValidation;
using Model;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;

namespace Service.SchoolDistricts.Rosters
{
    public class SchoolDistrictRosterDuplicateValidator : AbstractValidator<SchoolDistrictRoster>
    {
        protected readonly IPrimaryContext _context;
        private readonly Func<SchoolDistrictRoster, Expression<Func<Student, bool>>> _isDuplicate;
        private readonly IEnumerable<Student> _districtStudents;
        public SchoolDistrictRosterDuplicateValidator(IPrimaryContext context,
            Func<SchoolDistrictRoster, Expression<Func<Student, bool>>> isDuplicate, IEnumerable<Student> districtStudents)
        {
            _context = context;
            _isDuplicate = isDuplicate;
            _districtStudents = districtStudents;
            RuleFor(s => s.SchoolDistrictId).Must(IsUniqueStudent).WithMessage("Duplicate found"); ;
        }

        /// <summary>
        /// Checks for duplicates based in students table based on SchoolDistrictRoster values
        /// </summary>
        /// <param name="sdr"></param>
        /// <param name="districtId"></param>
        /// <returns></returns>
        private bool IsUniqueStudent(SchoolDistrictRoster sdr, int districtId)
        {
            return !_districtStudents.Any((s) =>
                 (s.LastName.ToLower().Trim() == sdr.LastName.ToLower().Trim() &&
                 s.StudentCode != null && s.StudentCode.Trim() == sdr.StudentCode.Trim())
                 ||
                 (s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim() &&
                 s.StudentCode != null && s.StudentCode.Trim() == sdr.StudentCode.Trim())
                 ||
                 (s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim() &&
                 DateTime.TryParse(sdr.DateOfBirth, out var date) &&
                 s.DateOfBirth.Day == date.Date.Day && s.DateOfBirth.Month == date.Date.Month && s.DateOfBirth.Year == date.Date.Year)
                 ||
                 (s.LastName.ToLower().Trim() == sdr.LastName.ToLower().Trim() &&
                 s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim()));
        }

    }
}
