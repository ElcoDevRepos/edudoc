using Model;
using System.Collections.Generic;

namespace Service.Encounters.ServiceOutcomes
{
    public interface IServiceOutcomeService
    {
        void Update(IEnumerable<ServiceOutcome> outcomes, int userId);
    }
}
