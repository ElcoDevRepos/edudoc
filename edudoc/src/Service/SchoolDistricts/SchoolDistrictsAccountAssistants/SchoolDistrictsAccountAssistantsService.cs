using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using Service.SchoolDistricts;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.SchoolDistricts.AccountAssistants
{
    public interface ISchoolDistrictsAccountAssistantsService 
    {
        int UpdateAccountAssistants(int schoolDistrictId, IEnumerable<int> accountAssistantIds);
    }
    public class SchoolDistrictsAccountAssistantsService : BaseService, ISchoolDistrictsAccountAssistantsService
    {
        private readonly IPrimaryContext _context;
        public SchoolDistrictsAccountAssistantsService(IPrimaryContext context)
            : base(context)
        {
            _context = context;
        }

        public int UpdateAccountAssistants(int schoolDistrictId, IEnumerable<int> accountAssistantIds)
        {
            var accountAssistants = _context.SchoolDistrictsAccountAssistants.Where(sd => sd.SchoolDistrictId == schoolDistrictId);
            if (accountAssistants.Count() > 0) 
            {
                _context.SchoolDistrictsAccountAssistants.RemoveRange(accountAssistants);
            }
            if (accountAssistantIds.Count() > 0)
            {
                foreach (var accId in accountAssistantIds)
                {
                    _context.SchoolDistrictsAccountAssistants.Add(
                        new SchoolDistrictsAccountAssistant {
                            SchoolDistrictId = schoolDistrictId,
                            AccountAssistantId = accId
                        }
                    );
                }
            }
            _context.SaveChanges();
            return schoolDistrictId;
        }
    }
}
