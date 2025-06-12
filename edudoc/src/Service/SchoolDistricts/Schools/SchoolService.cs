using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service.SchoolDistricts.Schools
{
    public class SchoolService : CRUDBaseService, ISchoolService
    {
        private readonly IPrimaryContext _context;
        public SchoolService(IPrimaryContext context, IEmailHelper emailHelper) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }

        private School CreateSchool(School school, int districtId, CRUDServiceOptions cso)
        {
            var schoolId = Create(school, cso);
            var schoolDistrictSchool = new SchoolDistrictsSchool
            {
                Archived = false,
                SchoolDistrictId = districtId,
                SchoolId = schoolId,
            };
            Create(schoolDistrictSchool, cso);
            return school;
        }

        public School Update(School school, int districtId, int userId)
        {
            ThrowIfNull(school);
            var matchingSchools = MatchingSchoolsInDistrict(school, districtId);
            if (matchingSchools.Any(s => !s.Archived))
            {
                throw new Exception("School name must be unique");
            }
            else
            {
                var toUpdate = matchingSchools.FirstOrDefault(s => s.Archived);
                var cso = new CRUDServiceOptions { currentuserid = userId };
                if (toUpdate != null)
                {
                    toUpdate.Archived = false;
                    Update(toUpdate, cso);
                    return toUpdate;
                }
                else if (school.Id == 0)
                {
                    return CreateSchool(school, districtId, cso);
                }
                else
                {
                    Update(school, cso);
                    return school;
                }
            }
        }

        /// <summary>
        /// Get all schools (archived or not) that have a matching name and district with the given school
        /// </summary>
        /// <param name="school"></param>
        /// <param name="districtId"></param>
        /// <returns></returns>
        private IEnumerable<School> MatchingSchoolsInDistrict(School school, int districtId)
        {
            return _context.Schools.Where(s => s.Id != school.Id &&
                s.Name == school.Name &&
                s.SchoolDistrictsSchools.Any(d => d.SchoolDistrictId == districtId)).ToList();
        }

        public int GetSchoolIdByNameAndDistrictId(string schoolName, int schoolDistrictId)
        {
            throw new NotImplementedException();
        }
    }
}
