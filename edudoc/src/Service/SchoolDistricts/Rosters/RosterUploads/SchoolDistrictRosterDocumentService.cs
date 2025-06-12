using Service.Core.Utilities;
using Service.Core.Utilities;
using Model;
using Service.Utilities;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;

namespace Service.SchoolDistricts.Rosters.RosterUploads
{
    public class SchoolDistrictRosterDocumentService : BaseService, ISchoolDistrictRosterDocumentService
    {
        private readonly IRosterUploadService _rosterUploadService;
        private readonly IDocumentHelper _documentHelper;
        private readonly IDocumentUtilityService _documentUtilityService;
        public SchoolDistrictRosterDocumentService(IPrimaryContext context,
                                                   IRosterUploadService rosterUploadService,
                                                   IDocumentHelper documentHelper,
                                                   IDocumentUtilityService documentUtilityService) : base(context)
        {
            _rosterUploadService = rosterUploadService;
            _documentHelper = documentHelper;
            _documentUtilityService = documentUtilityService;
        }


        /// <summary>
        /// Creates and saves roster document
        /// </summary>
        /// <param name="districtId"></param>
        /// <param name="fileName"></param>
        /// <param name="docBytes"></param>
        /// <param name="uploadedBy"></param>
        /// /// <returns></returns>
        public SchoolDistrictRosterDocument CreateRosterDocument(int districtId, string fileName, byte[] docBytes, int uploadedBy)
        {
            var district = Context.SchoolDistricts.Find(districtId);
            ThrowIfNull(district);
            var document = _documentUtilityService.GenerateDocumentRecord<SchoolDistrictRosterDocument>(fileName, uploadedBy);
            ValidateAndThrow(document, new DocumentHelperValidator(_documentHelper));
            Context.SchoolDistrictRosterDocuments.Add(document);
            district.SchoolDistrictRosterDocuments.Add(document);
            Context.SaveChanges();
            var absolutePath = _documentHelper.PrependDocsPath(document.FilePath);
            File.WriteAllBytes(absolutePath, docBytes);
            return document;
        }

        /// <summary>
        /// Gets list of excel roster uploads that have not been processd, exclude file that have been
        /// ignored by the user
        /// </summary>
        /// <returns></returns>
        public List<SchoolDistrictRosterDocument> GetDocumentsForConversion()
        {
            return Context.SchoolDistrictRosterDocuments.Include(sd => sd.SchoolDistrict)
                         .Where(d => d.SchoolDistrict != null && d.DateError == null && d.DateProcessed == null)
                         .ToList();
        }

        public List<SchoolDistrictRoster> PreviewRecords(byte[] docBytes, int districtId, int numRecords)
        {
            return _rosterUploadService.MapToRoster(districtId, docBytes, numRecords);
        }

        public void DeleteRosterDocument(int districtId, int docId)
        {
            var document = Context.SchoolDistrictRosterDocuments.Find(docId);
            ThrowIfNull(document);
            string fp = _documentHelper.PrependDocsPath(document.FilePath);
            if (Context.GetEntityState(document) == EntityState.Detached)
                Context.SchoolDistrictRosterDocuments.Attach(document);
            var schoolDistrict = Context.SchoolDistricts
                .Include(sdr => sdr.SchoolDistrictRosterDocuments)
                .SingleOrDefault(sdr => sdr.Id == districtId);
            schoolDistrict.SchoolDistrictRosterDocuments.Remove(document);
            Context.SchoolDistrictRosterDocuments.Remove(document);
            Context.SaveChanges();
            File.Delete(fp);
        }

        public SchoolDistrictRosterDocument GetRosterDocument(int districtId, int documentId)
        {
            return Context.SchoolDistricts
                .Where(sd => sd.Id == districtId)
                .SelectMany(sd => sd.SchoolDistrictRosterDocuments).FirstOrDefault(doc => doc.Id == documentId);
        }


        public byte[] GetRosterDocumentBytes(int districtId, int documentId)
        {
            SchoolDistrictRosterDocument document = GetRosterDocument(districtId, documentId);
            return _documentUtilityService.GetDocumentBytes(document);
        }


        public IQueryable<SchoolDistrictRosterDocument> GetRosterDocumentsBySchoolDistrictId(int districtId)
        {
            return Context.SchoolDistricts
                        .Where(sd => sd.Id == districtId)
                        .SelectMany(sd => sd.SchoolDistrictRosterDocuments)
                        .OrderByDescending(doc => doc.DateUpload)
                        .Include(doc => doc.User)
                        .Include(doc => doc.User.AuthUser);
        }


    }
}
