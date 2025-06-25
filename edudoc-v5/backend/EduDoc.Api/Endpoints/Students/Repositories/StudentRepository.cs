using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace EduDoc.Api.Endpoints.Students.Repositories;

public interface IStudentRepository
{
    Task<List<Student>> SearchAsync(string searchText, int? districtId, int currentUserRoleType, int currentUserId);
}

public class StudentRepository : IStudentRepository
{
    private readonly EdudocSqlContext context;

    public StudentRepository(EdudocSqlContext context)
    {
        this.context = context;
    }

    public async Task<List<Student>> SearchAsync(string searchText, int? districtId, int currentUserRoleType, int currentUserId)
    {
        var query = context.Students
            .Include(s => s.School)
            .Include(s => s.District)
            .Where(s => !s.Archived);

        // Apply authorization-based district filtering
        query = ApplyAuthorizationFilter(query, currentUserRoleType, currentUserId);

        // Apply district filter if provided
        if (districtId.HasValue)
        {
            query = query.Where(s => s.DistrictId == districtId.Value);
        }

        // Apply text search across multiple fields
        if (!string.IsNullOrWhiteSpace(searchText))
        {
            var searchLower = searchText.Trim().ToLower();
            query = query.Where(s => 
                (s.FirstName + " " + s.LastName).ToLower().Contains(searchLower) ||
                (s.LastName + ", " + s.FirstName).ToLower().Contains(searchLower) ||
                (s.StudentCode != null && s.StudentCode.ToLower().Contains(searchLower))
            );
        }

        return await query
            .OrderBy(s => s.LastName)
            .ThenBy(s => s.FirstName)
            .Take(25) // Limit results to prevent performance issues
            .ToListAsync();
    }

    private IQueryable<Student> ApplyAuthorizationFilter(IQueryable<Student> query, int userRoleType, int currentAuthUserId)
    {
        switch (userRoleType)
        {
            case 1: // Admin - can see all students
                return query;

            case 2: // Provider - can only see students in districts they have active assignments to
                // First get the User ID from AuthUser ID, then check Provider assignments
                var currentUserId = context.Users
                    .Where(u => u.AuthUserId == currentAuthUserId)
                    .Select(u => u.Id)
                    .FirstOrDefault();
                
                if (currentUserId == 0) return query.Where(s => false); // No user found
                
                return query.Where(s => s.DistrictId.HasValue && 
                    context.ProviderEscAssignments
                        .Where(pea => !pea.Archived && 
                              (pea.EndDate == null || pea.EndDate > DateTime.UtcNow) &&
                              pea.Provider.ProviderUserId == currentUserId)
                        .SelectMany(pea => pea.ProviderEscSchoolDistricts)
                        .Any(pesd => pesd.SchoolDistrictId == s.DistrictId.Value));

            case 3: // District Admin - can only see students in districts they administer
                // First get the User ID from AuthUser ID, then check AdminSchoolDistrict assignments
                var currentUserIdForAdmin = context.Users
                    .Where(u => u.AuthUserId == currentAuthUserId)
                    .Select(u => u.Id)
                    .FirstOrDefault();
                
                if (currentUserIdForAdmin == 0) return query.Where(s => false); // No user found
                
                return query.Where(s => s.DistrictId.HasValue &&
                    context.AdminSchoolDistricts
                        .Where(asd => !asd.Archived && asd.AdminId == currentUserIdForAdmin)
                        .Any(asd => asd.SchoolDistrictId == s.DistrictId.Value));

            default: // Unknown role - no access
                return query.Where(s => false);
        }
    }
} 