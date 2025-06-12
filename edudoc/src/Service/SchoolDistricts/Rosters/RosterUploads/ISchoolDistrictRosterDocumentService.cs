using Model;
using System.Collections.Generic;
using System.Linq;

namespace Service.SchoolDistricts.Rosters.RosterUploads
{
    public interface ISchoolDistrictRosterDocumentService
    {
        SchoolDistrictRosterDocument CreateRosterDocument(int districtId, string fileName, byte[] docBytes, int uploadedBy);
        List<SchoolDistrictRoster> PreviewRecords(byte[] docBytes, int districtId, int numRecords);
        List<SchoolDistrictRosterDocument> GetDocumentsForConversion();
        void DeleteRosterDocument(int districtId, int docId);
        IQueryable<SchoolDistrictRosterDocument> GetRosterDocumentsBySchoolDistrictId(int districtId);
        SchoolDistrictRosterDocument GetRosterDocument(int districtId, int documentId);
        byte[] GetRosterDocumentBytes(int districtId, int documentId);
    }
}
