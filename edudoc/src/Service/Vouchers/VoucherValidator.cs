using FluentValidation;
using Model;
using System.Text.RegularExpressions;

namespace Service.Vouchers
{
    internal class VoucherValidator : AbstractValidator<Voucher>
    {

        public VoucherValidator()
        {
            RuleFor(v => v.SchoolYear)
                .NotEmpty()
                .Must(IsValidSchoolYear)
                .WithMessage("A valid school year must be entered.");
        }

        private bool IsValidSchoolYear(string schoolYear)
        {
            return !string.IsNullOrEmpty(schoolYear) && Regex.IsMatch(schoolYear, @"^\d{4}$"); ;
        }
    }
}
