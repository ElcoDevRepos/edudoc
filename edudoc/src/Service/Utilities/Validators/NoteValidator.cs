using FluentValidation;
using Model;

namespace Service.Utilities.Validators
{
    public class NoteValidator : AbstractValidator<Note>
    {
        public NoteValidator()
        {
            RuleFor(n => n.Title).NotEmpty().Length(0, 100);
            RuleFor(n => n.NoteText).NotEmpty().Length(0, 5000);
        }
    }
}
