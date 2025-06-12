

using Model;
using Model.DTOs;
using System.Collections.Generic;

namespace Service.StudentParentalConsents
{
    public interface IStudentParentalConsentService
    {
        StudentParentalConsentSearch SearchStudentParentalConsents(Model.Core.CRUDSearchParams csp, int userId);
        ClaimsSummaryDTO GetClaimsSummary(int schoolDistrictId, int userId);
        StudentParentalConsentDistrictSearch SearchStudentParentalConsentsByDistrict(Model.Core.CRUDSearchParams csp, int userId);
    }


    public class StudentParentalConsentSearch
    {
        public IEnumerable<StudentWithParentalConsentDTO> StudentParentalConsents { get; set; }
        public int Count { get; set; }
    }

    public class StudentParentalConsentDistrictSearch
    {
        public IEnumerable<StudentWithParentalConsentDistrictDTO> StudentParentalConsents { get; set; }
        public int Count { get; set; }
    }

}
