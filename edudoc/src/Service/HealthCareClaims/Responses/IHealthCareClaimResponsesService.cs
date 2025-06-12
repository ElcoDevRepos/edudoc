
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Core.Common;
using Microsoft.AspNetCore.Http;
using Model;

namespace Service.HealthCareClaims
{
    public interface IHealthCareClaimResponsesService
    {
        BillingResponseFile ProcessHealthCareClaimResponse(int healthCareClaimResponseId, string fileName, int userId);
        Task StoreResponseFiles(IEnumerable<IFormFile> files, int userId);
        void HandleBillingResponseFileProcessing();
    }
}
