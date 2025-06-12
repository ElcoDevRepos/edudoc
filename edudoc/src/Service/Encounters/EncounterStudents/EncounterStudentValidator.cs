using FluentValidation;
using Model;
using Model.Enums;
using System;

namespace Service.Encounters
{
    internal class EncounterStudentValidator : AbstractValidator<EncounterStudent>
    {

        public EncounterStudentValidator()
        {
            RuleFor(e => e.ReasonForReturn)
                .NotEmpty()
                .WithMessage("A reason for return must be provided.")
                .When(e => e.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter);
            RuleFor(e => e.DateESigned)
                .Must(NotBePreSigned)
                .WithMessage("This encounter can't be signed before the encounter date.")
                .When(e => e.DateESigned != null);
        }

        private bool NotBePreSigned(EncounterStudent encounterStuedent, DateTime? dateESigned)
        {
            return dateESigned >= encounterStuedent.EncounterDate;
        }

    }
}
