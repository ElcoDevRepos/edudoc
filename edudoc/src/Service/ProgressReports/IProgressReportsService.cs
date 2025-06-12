using Model;
using Model.Custom;
using Model.DTOs;
using System;
using System.Collections.Generic;

namespace Service.ProgressReports
{
    public interface IProgressReportsService
    {
        ProgressReportSearch GetProgressReportsForList(CRUDSearchParams<Student> csp, int providerId);
        IEnumerable<ProgressReportCaseNotesDto> GetProgressReportCaseNotes(int studentId, int providerId, Model.Core.CRUDSearchParams csp);
        DistrictProgressReportDate GetOrCreateDistrictProgressReportDate(int districtId);
        DistrictProgressReportDate GetDistrictProgressReportDateByDistrictId(int districtId);
        int GetLateProgressReportsCount(int userId);
        IEnumerable<ProgressReport> GetForProviderStudentAndQuarter(int providerUserId, int studentId, int quarter);
        ProgressReportPermissionsData GetProgressReportPermissions(int userId);
    }
    public class ProgressReportSearch
    {
        public IEnumerable<ProgressReportDto> ProgressReports { get; set; }
        public int Count { get; set; }
    }
}

