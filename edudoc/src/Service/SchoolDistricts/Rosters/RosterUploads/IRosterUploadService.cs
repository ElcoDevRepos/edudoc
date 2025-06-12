using Model;
using System;
using System.Collections.Generic;

namespace Service.SchoolDistricts.Rosters.RosterUploads
{
    public interface IRosterUploadService
    {
        List<SchoolDistrictRoster> MapToRoster(int schoolDistrictId, byte[] docBytes, int numRecords);
        List<SchoolDistrictRoster> MapToRoster(int schoolDistrictId, SchoolDistrictRosterDocument document);
        void CompleteRosterUpload(SchoolDistrictRosterDocument doc);
        void SendDuplicateEmail(SchoolDistrictRosterDocument doc, List<SchoolDistrictRoster> duplicateRosters);
        void DiscardRosterUpload(SchoolDistrictRosterDocument doc, Exception error);
    }
}
