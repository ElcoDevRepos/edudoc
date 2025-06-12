using FluentValidation;
using Model;

namespace Service.RejectedEncounters
{
    public class RejectedEncounterValidator : AbstractValidator<ClaimsEncounter>
    {
        public RejectedEncounterValidator()
        {
        }
    }
}
