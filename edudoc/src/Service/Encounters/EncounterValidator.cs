using System;
using FluentValidation;
using Model;
using Model.Enums;

namespace Service.Encounters
{
    public class EncounterValidator : AbstractValidator<Encounter>
    {
        public EncounterValidator()
        {
            // Managed to submit invalid service type ID. This has happened in the past; this is just a safety check
            RuleFor(e => e.ServiceTypeId).Must(i => Enum.IsDefined(typeof(ServiceTypes), i)).WithMessage(e => $"Invalid Service Type with ID {e.ServiceTypeId}");
        }

    }
}
