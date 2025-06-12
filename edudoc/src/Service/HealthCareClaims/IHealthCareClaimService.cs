
using Model;
using Model.Custom;
using Model.DTOs;
using System.Collections.Generic;
using System.Linq;

namespace Service.HealthCareClaims
{
    public interface IHealthCareClaimService
    {
        int GenerateHealthCareClaim(int billingScheduleId, int[] rebillingIds, int userId);
        int GenerateReversalHealthCareClaim(int billingScheduleId, int userId);
        ClaimsEncountersDTO GenerateClaimsEncounters(List<ClaimsStudent> claimsStudents, List<EncounterClaimsData> encounterStudentCptCodes);
    }
}
