using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using Service.SchoolDistricts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.Users
{
    public class SchoolDistrictService : CRUDBaseService, ISchoolDistrictService
    {
        private readonly IPrimaryContext _context;
        public SchoolDistrictService(IPrimaryContext context, IEmailHelper emailHelper)
            : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }

        public SchoolDistrict Reload(int schoolDistrictId)
        {
            return _context.SchoolDistricts
                .Include(u => u.Address)
                .AsNoTracking()
                .SingleOrDefault(u => u.Id == schoolDistrictId);
        }

        public bool CheckIfUserIsDistrictAdmin(int userId, int districtId)
        {
            return _context.SchoolDistricts.Include(sd => sd.Users_DistrictAdminId)
                                           .FirstOrDefault(sd => sd.Id == districtId)
                                           .Users_DistrictAdminId
                                           .Any(u => u.Id == userId);
        }

        public IEnumerable<SchoolDistrict> GetDistrictsByEscId(int userId, int escId)
        {
            var providerDistrictIds = _context.ProviderEscSchoolDistricts
                                        .Where(pesd => pesd.ProviderEscAssignment.Provider.ProviderUserId == userId
                                                && !pesd.ProviderEscAssignment.Archived
                                                && (
                                                        pesd.ProviderEscAssignment.EndDate == null
                                                        || pesd.ProviderEscAssignment.EndDate >= DateTime.Now
                                                    ))
                                        .Select(pesd => pesd.SchoolDistrictId);

            return _context.SchoolDistricts
                                    .Where(district =>
                                        providerDistrictIds.Contains(district.Id) &&
                                            (
                                                district.EscSchoolDistricts.Any(esd => esd.EscId == escId && !esd.Archived) ||
                                                (escId == 0)
                                            ) &&
                                        !district.Archived
                                    )
                                    .Include(district => district.SchoolDistrictsSchools)
                                    .Include(district => district.SchoolDistrictsSchools.Select(x => x.School))
                                    .OrderBy(district => district.Name);
        }

        public SchoolDistrict UpdateCaseNotesRequired(int districtId, List<int> providerTitleIds)
        {
            var toRemove = _context.SchoolDistrictProviderCaseNotes.Where(sd => sd.SchoolDistrictId == districtId);
            _context.SchoolDistrictProviderCaseNotes.RemoveRange(toRemove);

            var toAdd = new List<SchoolDistrictProviderCaseNote>();
            foreach (int id in providerTitleIds)
            {
                var add = new SchoolDistrictProviderCaseNote
                {
                    SchoolDistrictId = districtId,
                    ProviderTitleId = id
                };
                toAdd.Add(add);
            }
            _context.SchoolDistrictProviderCaseNotes.AddRange(toAdd);
            _context.SaveChanges();
            return _context.SchoolDistricts.Include(sd => sd.SchoolDistrictProviderCaseNotes).FirstOrDefault(sd => sd.Id == districtId);
        }
    }
}
