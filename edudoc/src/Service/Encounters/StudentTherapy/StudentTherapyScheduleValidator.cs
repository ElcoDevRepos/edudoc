using FluentValidation;
using Model;

namespace Service.Encounters.StudentTherapies
{
    class StudentTherapyScheduleValidator : AbstractValidator<StudentTherapySchedule>
    {
        public StudentTherapyScheduleValidator()
        {
            RuleFor(sts => sts.StudentTherapyId).NotEmpty();
            RuleFor(sts => sts.ScheduleDate).NotEmpty();
            RuleFor(sts => sts.ScheduleStartTime).NotEmpty();
            RuleFor(sts => sts.ScheduleEndTime).NotEmpty().Must((sts, time) => time >= sts.ScheduleStartTime).WithMessage("End Time must be later than Start Time");
        }
         
    }
}
