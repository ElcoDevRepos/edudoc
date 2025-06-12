
using FluentValidation;
using Model;
using System.Linq;

namespace Service.Students
{
    public class StudentDistrictWithdrawalValidator : AbstractValidator<StudentDistrictWithdrawal>
    {
        protected readonly IPrimaryContext _context;

        public StudentDistrictWithdrawalValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(withdrawal => withdrawal)
                .NotEmpty()
                .Must(NotOverlap)
                .WithMessage("Save Failed: District assignment enrollment date overlaps another assignment.");
        }

        private bool NotOverlap(StudentDistrictWithdrawal newWithdrawal)
        {
            return !_context.StudentDistrictWithdrawals.Any(withdrawal => withdrawal.StudentId == newWithdrawal.StudentId &&
                                                                            withdrawal.WithdrawalDate > newWithdrawal.WithdrawalDate &&
                                                                            !withdrawal.Archived);
        }
    }
}
