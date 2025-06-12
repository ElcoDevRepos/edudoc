using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using Service.SchoolDistricts;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.SchoolDistricts.FinancialReps
{
    public interface ISchoolDistrictsFinancialRepsService 
    {
        int UpdateFinancialReps(int schoolDistrictId, IEnumerable<int> financialRepIds);
    }
    public class SchoolDistrictsFinancialRepsService : BaseService, ISchoolDistrictsFinancialRepsService
    {
        private readonly IPrimaryContext _context;
        public SchoolDistrictsFinancialRepsService(IPrimaryContext context)
            : base(context)
        {
            _context = context;
        }

        public int UpdateFinancialReps(int schoolDistrictId, IEnumerable<int> financialRepIds)
        {
            var financialReps = _context.SchoolDistrictsFinancialReps.Where(sd => sd.SchoolDistrictId == schoolDistrictId);
            if (financialReps.Count() > 0) 
            {
                _context.SchoolDistrictsFinancialReps.RemoveRange(financialReps);
            }
            if (financialRepIds.Count() > 0)
            {
                foreach (var repId in financialRepIds)
                {
                    _context.SchoolDistrictsFinancialReps.Add(
                        new SchoolDistrictsFinancialRep {
                            SchoolDistrictId = schoolDistrictId,
                            FinancialRepId = repId
                        }
                    );
                }
            }
            _context.SaveChanges();
            return schoolDistrictId;
        }
    }
}
