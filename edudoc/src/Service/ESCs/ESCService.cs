using Model;
using Model.DTOs;
using Service.SchoolDistricts;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.Users
{
    public class EscService : BaseService, IEscService
    {
        public EscService(IPrimaryContext context)
            : base(context)
        {
        }

        public Esc Reload(int escId)
        {
            return Context.Escs
                .Include(u => u.Address)
                .AsNoTracking()
                .SingleOrDefault(u => u.Id == escId);
        }

        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
             return GetAll<Esc>().Select(esc =>
                           new SelectOptions
                           {
                               Id = esc.Id,
                               Name = esc.Name,
                               Archived = esc.Archived
                           }).AsEnumerable();
        }

        public IEnumerable<SelectOptions> GetProviderSelectOptions(int providerId)
        {
            var provider = Context.Providers
                                    .Include(provider => provider.ProviderEscAssignments)
                                    .FirstOrDefault(provider => provider.Id == providerId);

            var providerEscIds = provider.ProviderEscAssignments?.Select(assignment => assignment.EscId)?.ToList();

            return GetAll<Esc>().Where(esc => providerEscIds.Contains(esc.Id)).Select(esc =>
                          new SelectOptions
                          {
                              Id = esc.Id,
                              Name = esc.Name,
                              Archived = esc.Archived
                          }).AsEnumerable();
        }

        public EscSchoolDistrict ArchiveEscSchoolDistrict(int escId, int districtId)
        {
            // Remove associations between existing provider ESCs and school district
            var providerEscSd = Context.ProviderEscAssignments
                .Where(pea => pea.EscId == escId && 
                    pea.ProviderEscSchoolDistricts.Any(pesd => pesd.ProviderEscAssignmentId == pea.Id && pesd.SchoolDistrictId == districtId))
                .Select(p => p.ProviderEscSchoolDistricts.FirstOrDefault(pesd => pesd.SchoolDistrictId == districtId));
            Context.ProviderEscSchoolDistricts.RemoveRange(providerEscSd);

            // Archive any ProviderEscAssignments where the only assignment is the removed school district
            var assignments = Context.ProviderEscAssignments.Where(pea => pea.EscId == escId && !pea.ProviderEscSchoolDistricts.Any());
            foreach(var assignment in assignments) 
            {
                assignment.Archived = true;
            }

            var escSchoolDistrict = Context.EscSchoolDistricts.FirstOrDefault(esd => esd.EscId == escId 
                && esd.SchoolDistrictId == districtId && !esd.Archived);
            if (escSchoolDistrict != null) 
                escSchoolDistrict.Archived = true;

            Context.SaveChanges();
            return escSchoolDistrict;
        }
    }
}
