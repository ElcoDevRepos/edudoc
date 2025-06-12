using Model;
using System.Collections.Generic;
using System.Linq;

namespace Service.UserRoles
{
    public interface IUserRoleService
    {
        bool BeAUniqueUserRoleName(UserRole role, string name);

        void Create(UserRole role);

        void Delete(int id);

        UserRole GetById(int roleId);

        IEnumerable<ClaimType> GetClaimTypes();

        IEnumerable<ClaimValue> GetClaimValues();

        IQueryable<UserRole> GetRolesWithClaims();

        void Update(UserRole role);

        void UpdateClaims(int roleId, IEnumerable<UserRoleClaim> urClaims);

        int UpdateAllUserRoles();
    }
}
