

using Model;
using Model.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service.Students
{
    public interface IStudentService
    {
        StudentSearch SearchStudents(Model.Core.CRUDSearchParams csp, int userId);
        IEnumerable<SelectOptions> GetStudentOptions(string searchQuery, int providerId, int userId, bool fromCaseLoad);
        IEnumerable<SelectOptionsWithProviderId> GetStudentSelectOptionsByAssistant(int userId);
        IEnumerable<SelectOptions> GetStudentSelectOptionsByDistricts(Model.Core.CRUDSearchParams csp, int userId);
        Student GetStudentById(int studentId, int userId);
        ProviderCaseLoadSearch ProviderSearchCaseLoads(Model.Core.CRUDSearchParams csp, int userId);
        ProviderCaseLoadSearch ProviderSearchMissingReferrals(Model.Core.CRUDSearchParams csp, int userId);
        int AssignStudentEsc(int studentId, int escId, int userId);
        int AssignStudentSchool(int studentId, int districtId, int schoolId, int userId);
        int CreateStudentWithConsent(Student student, int userId, bool addToCaseload);
        int DeleteStudent(int studentId);

        void PruneStudents21AndOver();
    }


    public class StudentSearch
    {
        public IEnumerable<StudentDto> Student { get; set; }
        public int Count { get; set; }
    }

    public class ProviderCaseLoadSearch
    {
        public IQueryable<ProviderCaseLoadDTO> Student { get; set; }
        public int Count { get; set; }
    }

}
