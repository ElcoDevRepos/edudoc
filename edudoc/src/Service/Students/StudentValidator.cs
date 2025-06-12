
using FluentValidation;
using Model;
using System.Linq;

namespace Service.Students
{
    public class StudentValidator : AbstractValidator<Student>
    {
        protected readonly IPrimaryContext _context;

        public StudentValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(student => student)
                .NotEmpty()
                .Must(StudentIsUnique)
                .WithMessage("Save Failed: Duplicate student(s) exist");
        }

        private bool StudentIsUnique(Student student)
        {
            var districtId = _context.SchoolDistrictsSchools.FirstOrDefault(sds => sds.Id == student.SchoolId)?.SchoolDistrictId;
            return
             !_context.Students.Any((s) =>
                s.Id != student.Id &&
                (
                    s.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == districtId) || s.DistrictId == districtId
                ) &&
                (
                    s.StudentCode.Trim() == student.StudentCode.Trim() && s.FirstName.ToLower().Trim() == student.FirstName.ToLower().Trim() ||
                    s.StudentCode.Trim() == student.StudentCode.Trim() && s.LastName.ToLower().Trim() == student.LastName.ToLower().Trim() ||
                    s.FirstName.ToLower().Trim() == student.FirstName.ToLower().Trim() && s.LastName.ToLower().Trim() == student.LastName.ToLower().Trim() ||
                    s.LastName.ToLower().Trim() == student.LastName.ToLower().Trim() && s.DateOfBirth == student.DateOfBirth)
                );

        }
    }
}
