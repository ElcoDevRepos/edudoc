
using Model;

namespace Service.RosterValidations
{
    public interface IRosterValidationResponsesService
    {
        RosterValidationResponseFile ProcessRosterValidationResponse(int rosterValidationResponseId, int rosterValidationFileId, int userId);
    }
}
