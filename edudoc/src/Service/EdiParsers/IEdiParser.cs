using EDIX12.Models;

namespace Service.EDIParse
{
    public interface IEDIParser
    {
        RosterValidationResponse271 Parse271File(string filePath);
        HealthClaimResponse835 Parse835File(string filePath);
    }
}
