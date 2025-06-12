using FluentValidation;
using Model;

namespace Service.Encounters.StudentTherapies
{
    class StudentTherapyValidator : AbstractValidator<StudentTherapy>
    {
        public StudentTherapyValidator()
        {
            RuleFor(st => st.EncounterLocationId).NotEmpty();
            RuleFor(st => st.StartDate).NotEmpty();
            RuleFor(st => st.EndDate)
                .NotEmpty()
                .Must((st, date) => date >= st.StartDate).WithMessage("End Date must be later than Start Date");
            RuleFor(st => st.Monday).Must(DayOfWeekSelected).WithMessage("A day of week must be selected");
        }

        private bool DayOfWeekSelected(StudentTherapy st, bool monday)
        {
            return st.Monday || st.Tuesday || st.Wednesday || st.Thursday || st.Friday;
        }

    }
}
