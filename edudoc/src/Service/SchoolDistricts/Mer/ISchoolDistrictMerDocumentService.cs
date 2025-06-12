using Model;

namespace Service.SchoolDistricts.Mer.MerUploads
{
    public interface ISchoolDistrictMerDocumentService
    {
        Document CreateMerDocument(int districtId, string fileName, byte[] docBytes, int uploadedBy);
        void DeleteMerDocument(int districtId, int docId);
        Document GetMerDocument(int districtId, int documentId);
        byte[] GetMerDocumentBytes(int districtId, int documentId);
        IDocument GetMerDocumentBySchoolDistrictId(int districtId);
        void SendEmail(int districtId, string fileName);
    }
}
