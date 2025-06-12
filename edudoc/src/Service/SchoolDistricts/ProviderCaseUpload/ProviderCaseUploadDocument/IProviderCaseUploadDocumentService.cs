using Model;
using Model.DTOs;
using System.Collections.Generic;
using System.Linq;

namespace Service.SchoolDistricts.ProviderCaseUploads
{
    public interface IProviderCaseUploadDocumentService
    {
        ProviderCaseUploadDocument CreateCaseUploadDocument(int districtId, string fileName, byte[] docBytes, int uploadedBy);
        List<ProviderCaseUploadPreviewDto> PreviewRecords(byte[] docBytes, int providerId, int numRecords);
        IQueryable<ProviderCaseUploadDocument> GetCaseUploadDocumentsByDistrictId(int districtId);
        ProviderCaseUploadDocument GetCaseUploadDocument(int districtId, int documentId);
        byte[] GetCaseUploadDocumentBytes(int districtId, int documentId);
        IEnumerable<SelectOptions> GetSelectOptions(int districtId);
        List<ProviderCaseUploadDocument> GetDocumentsForConversion();
    }
}
