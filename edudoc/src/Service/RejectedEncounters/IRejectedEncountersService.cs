using Model;
using System.Threading.Tasks;

namespace Service.RejectedEncounters
{
    public interface IRejectedEncountersService
    {
        void GenerateRebillingHealthCareClaim(int[] rebillingIds, int userId);
    }
}
