using Model;
using Model.DTOs;
using System.Collections.Generic;
using System.Linq;

namespace Service.SchoolDistricts.Rosters
{
    public interface ISchoolDistrictRosterService
    {
        List<SchoolDistrictRoster> CreateRosters(SchoolDistrictRosterDocument document);
        IQueryable<Student> GetDistrictStudents(int districtId);
        void ValidateRoster(SchoolDistrictRoster alteredRoster, int districtId);
        void ValidateRosters(List<SchoolDistrictRoster> uploadedRosters, List<Student> students);
        List<SchoolDistrictRoster> GetValidRosters(List<SchoolDistrictRoster> rosterList);
        List<SchoolDistrictRoster> MatchRostersToStudents(List<SchoolDistrictRoster> validRosters, IQueryable<Student> students);
        void SetMatchingStudentProperties(List<SchoolDistrictRoster> matchingRosters, IQueryable<Student> students);
        void CreateStudentsFromRosters(List<SchoolDistrictRoster> matchingRosters, List<SchoolDistrictRoster> rosterList);
        IEnumerable<SchoolDistrictRoster> GetRostersBySchoolDistrictId(int userId);
        SchoolDistrictRoster GetRosterById(int rosterId, int userId);
        UniqueAndDuplicateRosters FilterDuplicateRosters(List<SchoolDistrictRoster> rosterList);
        List<Student> GetDuplicates(int rosterId, int userId);
        SchoolDistrictRoster UpdateRoster(SchoolDistrictRoster schoolDistrictRoster);
        void MergeRoster(MergeDTO mergeDTO);
        void ArchiveRoster(int id, int modifiedBy);
        void ReverseRosterUpload(int id, int modifiedBy);
        void RemoveAllIssues(int userId);
        int GetNextRosterIssueId(NextRosterIssueCallDto dto, int userId);
    }
}
