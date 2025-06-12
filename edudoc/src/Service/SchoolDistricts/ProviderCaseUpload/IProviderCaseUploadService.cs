using Model;
using Model.DTOs;
using System;
using System.Collections.Generic;

namespace Service.SchoolDistricts.ProviderCaseUploads
{
    public interface IProviderCaseUploadService
    {
        List<ProviderCaseUploadPreviewDto> MapToCaseUpload(int districtId, byte[] docBytes, int numRecords);
        void ProcessCaseUploads(ProviderCaseUploadDocument doc);
        IEnumerable<ProviderCaseUpload> GetCaseUploadsBySchoolDistrictId(int userId);
        ProviderCaseUpload ProcessDataIssueFix(ProviderCaseUpload caseUpload);
        void DiscardCaseloadUpload(ProviderCaseUploadDocument doc, Exception error);
        void RemoveAllIssues(int userId);
    }
}
