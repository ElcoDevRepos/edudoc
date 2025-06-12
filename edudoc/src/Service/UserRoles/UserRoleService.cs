using FluentValidation;
using FluentValidation.Results;
using Model;
using Model.Enums;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using ClaimType = Model.ClaimType;
using ClaimValue = Model.ClaimValue;
using UserRole = Model.UserRole;

namespace Service.UserRoles
{
    public class UserRoleService : BaseService, IUserRoleService
    {
        private readonly IValidator<UserRole> _userRoleValidator;
        private readonly IPrimaryContext _context;

        public UserRoleService(IPrimaryContext ctx)
            : base(ctx)
        {
            _userRoleValidator = new UserRoleValidator(this);
            _context = ctx;
        }

        /// <summary>
        ///     Checks that a UserRole name is unique before saving.
        /// </summary>
        /// <param name="role"></param>
        /// <param name="name"></param>
        /// <returns>Returns a bool indicating uniqueness.</returns>
        public bool BeAUniqueUserRoleName(UserRole role, string name)
        {
            return !_context.UserRoles.Any(r => r.Name == name && r.Id != role.Id);
        }

        /// <summary>
        ///     Creates a new UserRole.
        /// </summary>
        /// <param name="role"></param>
        public void Create(UserRole role)
        {
            ThrowIfNull(role);
            role.IsEditable = true;
            ValidateAndThrow(role, _userRoleValidator);
            _context.UserRoles.Add(role);
            _context.SaveChanges();
        }

        /// <summary>
        ///     Deletes a UserRole, if not in use.
        /// </summary>
        /// <param name="roleId"></param>
        public void Delete(int roleId)
        {
            ThrowIfRoleInUse(roleId);
            var role = _context.UserRoles.Include(r => r.UserRoleClaims).Single(r => r.Id == roleId);
            ThrowIfNull(role);
            ThrowIfRoleNotEditable(role.IsEditable);

            // remove all claim values
            _context.UserRoleClaims.RemoveRange(role.UserRoleClaims);
            _context.UserRoles.Remove(role);
            _context.SaveChanges();
        }

        /// <summary>
        ///     Gets a UserRole by Id, with Claims.
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns>Returns a UserRole, or null if not found.</returns>
        public UserRole GetById(int roleId)
        {
            return _context.UserRoles
                .Include(ur => ur.UserRoleClaims)
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimType))
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimValue))
                .SingleOrDefault(ur => ur.Id == roleId);
        }

        /// <summary>
        ///     Gets ClaimTypes
        /// </summary>
        /// <returns>Returns an IEnumerable of ClaimTypes.</returns>
        public IEnumerable<ClaimType> GetClaimTypes()
        {
            return _context.ClaimTypes.AsEnumerable();
        }

        /// <summary>
        ///     Gets ClaimValues
        /// </summary>
        /// <returns>Returns an IEnumerable of ClaimValues.</returns>
        public IEnumerable<ClaimValue> GetClaimValues()
        {
            return _context.ClaimValues.AsEnumerable();
        }

        /// <summary>
        ///     Gets UserRoles with associated Claims.
        /// </summary>
        /// <returns>Returns an IEnumerable of UserRoles.</returns>
        public IQueryable<UserRole> GetRolesWithClaims()
        {
            return _context.UserRoles
                .Include(ur => ur.UserRoleClaims)
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimType))
                .Include(ur => ur.UserRoleClaims.Select(urc => urc.ClaimValue))
                .AsNoTracking();
        }

        /// <summary>
        ///     Updates a UserRole.
        ///     Makes sure the db version is editable.
        /// </summary>
        /// <param name="role"></param>
        public void Update(UserRole role)
        {
            ThrowIfNull(role);
            // only pulling dbRole to make sure it is editable, otherwise could just attach...
            var dbRole = _context.UserRoles.Single(ur => ur.Id == role.Id);
            dbRole.Name = role.Name;
            dbRole.Description = role.Description;
            ValidateAndThrow(dbRole, _userRoleValidator); // ensures editable
            _context.SetEntityState(dbRole, EntityState.Modified);
            _context.SaveChanges();
        }

        /// <summary>
        ///     Updates the claims associated to a specific UserRole.
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="urClaims"></param>
        public void UpdateClaims(int roleId, IEnumerable<UserRoleClaim> urClaims)
        {
            urClaims.Select(c => { c.ClaimValue = null; return c; }).ToList();
            urClaims.Select(c => { c.ClaimType = null; return c; }).ToList();
            urClaims.Select(c => { c.UserRole = null; return c; }).ToList();
            var existing = _context.UserRoleClaims.Where(urc => urc.RoleId == roleId);
            _context.Merge<UserRoleClaim>()
                .SetExisting(existing)
                .SetUpdates(urClaims)
                .MergeBy((e, u) => e.RoleId == u.RoleId
                    && e.ClaimTypeId == u.ClaimTypeId
                    && e.ClaimValueId == u.ClaimValueId
                )
                .Merge();
            _context.SaveChanges();
        }

        private static void ThrowIfRoleNotEditable(bool isEditable)
        {
            if (isEditable) return;
            var error = new ValidationFailure("User Role", "This role is a system default and cannot be deleted.");
            throw new ValidationException(new[] { error });
        }

        private void ThrowIfRoleInUse(int roleId)
        {
            if (!_context.AuthUsers.Any(au => au.RoleId == roleId)) return;
            var error = new ValidationFailure("User Role", "This role is still in use.");
            throw new ValidationException(new[] { error });
        }

        public int UpdateAllUserRoles()
        {
            try
            {
                //disable detection of changes to improve performance
                _context.Configuration.AutoDetectChangesEnabled = false;

                var authUsers = _context.AuthUsers.Where(au => au.Id > 7000).Include(au => au.UserRole).ToList();
                var userRolesToAdd = new List<UserRole>();

                int count = 0;
                foreach (var authUser in authUsers)
                {
                    count++;
                    var newUserRole = new UserRole
                    {
                        IsEditable = authUser.Id > 1,
                        Description = authUser.Username,
                        Name = authUser.Username,
                        UserTypeId = authUser.UserRole.UserTypeId,
                        AuthUsers = new List<AuthUser>
                    {
                        authUser,
                    },
                        UserRoleClaims = CreateClaims(authUser.UserRole.UserTypeId),
                    };

                    if (newUserRole.Name != authUser.UserRole.Name)
                    {
                        _context.UserRoles.Add(newUserRole);
                    }

                    if (count % 100 == 0)
                        _context.SaveChanges();
                }
            }
            finally
            {
                //re-enable detection of changes
                _context.Configuration.AutoDetectChangesEnabled = true;
            }

            return 1;
        }

        private List<UserRoleClaim> CreateClaims(int userTypeId)
        {
            switch (userTypeId)
            {
                case (int)UserTypeEnums.Admin:
                    return _context.ClaimTypes.Where(ct => ct.UserTypes.Any(ut => ut.Id == (int)UserTypeEnums.Admin)).Select(ct => new
                    {
                        ClaimTypeId = ct.Id,
                    }).ToList()
                    .Select(x => new UserRoleClaim
                    {
                        ClaimTypeId = x.ClaimTypeId,
                        ClaimValueId = 1,
                    }).ToList();
                case (int)UserTypeEnums.Provider:
                    return _context.ClaimTypes.Where(ct => ct.UserTypes.Any(ut => ut.Id == (int) UserTypeEnums.Provider)).Select(ct => new
                    {
                        ClaimTypeId = ct.Id,
                    }).ToList()
                    .Select(x => new UserRoleClaim
                    {
                        ClaimTypeId = x.ClaimTypeId,
                        ClaimValueId = 1,
                    }).ToList();
                case (int)UserTypeEnums.DistrictAdmin:
                    return _context.ClaimTypes.Where(ct => ct.UserTypes.Any(ut => ut.Id == (int)UserTypeEnums.DistrictAdmin)).Select(ct => new
                    {
                        ClaimTypeId = ct.Id,
                    }).ToList()
                    .Select(x => new UserRoleClaim
                    {
                        ClaimTypeId = x.ClaimTypeId,
                        ClaimValueId = 1,
                    }).ToList();
                default:
                    return null;
            }

        }
    }
}
