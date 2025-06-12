using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Utilities;
using System.Data.Entity;
using System.IO;
using System.Linq;

namespace Service.SchoolDistricts.Mer.MerUploads
{
    public class SchoolDistrictMerDocumentService : BaseService, ISchoolDistrictMerDocumentService
    {
        private readonly IPrimaryContext _context;
        private readonly IDocumentHelper _documentHelper;
        private readonly IDocumentUtilityService _documentUtilityService;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;
        public SchoolDistrictMerDocumentService(IPrimaryContext context,
                                                   IDocumentHelper documentHelper,
                                                   IDocumentUtilityService documentUtilityService,
                                                   IEmailHelper emailHelper,
                                                   IConfigurationSettings configurationSettings) : base(context)
        {
            _context = context;
            _documentHelper = documentHelper;
            _documentUtilityService = documentUtilityService;
            _emailHelper = emailHelper;
            _configurationSettings = configurationSettings;
        }


        /// <summary>
        /// Creates and saves mer document
        /// </summary>
        /// <param name="districtId"></param>
        /// <param name="fileName"></param>
        /// <param name="docBytes"></param>
        /// <param name="uploadedBy"></param>
        /// /// <returns></returns>
        public Document CreateMerDocument(int districtId, string fileName, byte[] docBytes, int uploadedBy)
        {
            var district = _context.SchoolDistricts.Find(districtId);
            ThrowIfNull(district);
            var document = _documentUtilityService.GenerateDocumentRecord<Document>(fileName, uploadedBy);
            ValidateAndThrow(document, new DocumentHelperValidator(_documentHelper));
            _context.Documents.Add(document);
            district.Document = document;
            _context.SaveChanges();
            var absolutePath = _documentHelper.PrependDocsPath(document.FilePath);
            File.WriteAllBytes(absolutePath, docBytes);
            return document;
        }

        public void DeleteMerDocument(int districtId, int docId)
        {
            var document = _context.Documents.Find(docId);
            ThrowIfNull(document);
            string fp = _documentHelper.PrependDocsPath(document.FilePath);
            var schoolDistrict = _context.SchoolDistricts
                .Include(sd => sd.Document)
                .SingleOrDefault(sdr => sdr.Id == districtId);
            schoolDistrict.MerId = null;
            _context.Documents.Remove(document);
            _context.SaveChanges();
            File.Delete(fp);
        }

        public Document GetMerDocument(int districtId, int documentId)
        {
            return _context.SchoolDistricts
                .Where(sd => sd.Id == districtId)
                .Select(sd => sd.Document).FirstOrDefault(doc => doc.Id == documentId);
        }


        public byte[] GetMerDocumentBytes(int districtId, int documentId)
        {
            Document document = GetMerDocument(districtId, documentId);
            return _documentUtilityService.GetDocumentBytes(document);
        }


        public IDocument GetMerDocumentBySchoolDistrictId(int districtId)
        {
            return _context.SchoolDistricts
                        .Where(sd => sd.Id == districtId)
                        .Select(sd => sd.Document)
                        .Include(doc => doc.User)
                        .Include(doc => doc.User.AuthUser)
                        .FirstOrDefault();
        }

        public void SendEmail(int districtId, string fileName) 
        {
            // TODO: change email to HPC finance team
            var email = "edudoc@HPCoh.com";
            var schoolDistrict = _context.SchoolDistricts.FirstOrDefault(sd => sd.Id == districtId);
            var schoolDistrictName = schoolDistrict != null ? schoolDistrict.Name : "";

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
                    {
                        From = _configurationSettings.GetDefaultEmailFrom(),
                        To = email,
                        Subject = "New MER File Uploaded",
                        Body = $"New MER File {fileName} has been uploaded for {schoolDistrictName}." 
                    });
        }
    }
}
