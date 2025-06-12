using FluentValidation;
using Model;
using System.Linq;

namespace Service.EdiErrorCodes
{
    public class EdiErrorCodeValidator : AbstractValidator<EdiErrorCode>
    {
        private readonly IPrimaryContext _context;
        public EdiErrorCodeValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(c => c.Name).NotEmpty().Must(IsUniqueName);
            RuleFor(c => c.ErrorCode).NotEmpty().Must(IsUniqueCode);
        }

        private bool IsUniqueName(EdiErrorCode error, string name)
        {
            return !_context.EdiErrorCodes.Any(c => c.Name == name && c.Id != error.Id && c.EdiFileTypeId == error.EdiFileTypeId);
        }

        private bool IsUniqueCode(EdiErrorCode error, string code)
        {
            return !_context.EdiErrorCodes.Any(c => c.ErrorCode == code && c.Id != error.Id && c.EdiFileTypeId == error.EdiFileTypeId);
        }
    }
}
