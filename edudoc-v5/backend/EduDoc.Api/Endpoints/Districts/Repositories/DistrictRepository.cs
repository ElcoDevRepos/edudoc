using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace EduDoc.Api.Endpoints.Districts.Repositories;

public interface IDistrictRepository
{
    Task<List<SchoolDistrict>> GetAllAsync(int currentUserRoleType, int currentUserId);
}

public class DistrictRepository : IDistrictRepository
{
    private readonly EdudocSqlContext context;

    public DistrictRepository(EdudocSqlContext context)
    {
        this.context = context;
    }

    public async Task<List<SchoolDistrict>> GetAllAsync(int currentUserRoleType, int currentUserId)
    {
        var query = context.SchoolDistricts
            .Where(d => !d.Archived);

        // Apply authorization-based district filtering
        query = ApplyAuthorizationFilter(query, currentUserRoleType, currentUserId);

        return await query
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    private IQueryable<SchoolDistrict> ApplyAuthorizationFilter(IQueryable<SchoolDistrict> query, int userRoleType, int currentAuthUserId)
    {
        switch (userRoleType)
        {
            case 1: // Administrator - can see all districts
                return query;

            case 2: // Provider - can only see districts they are associated with via ProviderEscs
                // First get the User ID from AuthUser ID, then check Provider assignments
                var currentUserId = context.Users
                    .Where(u => u.AuthUserId == currentAuthUserId)
                    .Select(u => u.Id)
                    .FirstOrDefault();
                
                if (currentUserId == 0) return query.Where(d => false); // No user found
                
                return query.Where(d => 
                    context.ProviderEscAssignments
                        .Where(pea => !pea.Archived && 
                              (pea.EndDate == null || pea.EndDate > DateTime.UtcNow) &&
                              pea.Provider.ProviderUserId == currentUserId)
                        .SelectMany(pea => pea.ProviderEscSchoolDistricts)
                        .Any(pesd => pesd.SchoolDistrictId == d.Id));

            case 3: // District Admin - can only see their district
                // First get the User ID from AuthUser ID, then check AdminSchoolDistrict assignments
                var districtId = context.Users
                    .Where(u => u.AuthUserId == currentAuthUserId)
                    .Select(u => u.SchoolDistrictId)
                    .SingleOrDefault();
                
                if (districtId == null || districtId == 0) return query.Where(d => false); // No user found
                
                return query.Where(d => d.Id == districtId);

            default: // Unknown role - no access
                return query.Where(d => false);
        }
    }
} 