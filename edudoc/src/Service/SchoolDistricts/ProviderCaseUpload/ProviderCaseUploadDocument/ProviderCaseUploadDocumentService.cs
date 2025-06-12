using Service.Core.Utilities;
using Service.Core.Utilities;
using Model;
using Service.Utilities;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using Model.DTOs;
using System;
using BreckServiceBase.Utilities.Interfaces;
using Model.Enums;

namespace Service.SchoolDistricts.ProviderCaseUploads
{
    public class ProviderCaseUploadDocumentService : BaseService, IProviderCaseUploadDocumentService
    {
        private readonly IProviderCaseUploadService _providerCaseUploadService;
        private readonly IDocumentHelper _documentHelper;
        private readonly IDocumentUtilityService _documentUtilityService;
        public ProviderCaseUploadDocumentService(IPrimaryContext context,
                                                   IProviderCaseUploadService providerCaseUploadService,
                                                   IDocumentHelper documentHelper,
                                                   IDocumentUtilityService documentUtilityService) : base(context)
        {
            _providerCaseUploadService = providerCaseUploadService;
            _documentHelper = documentHelper;
            _documentUtilityService = documentUtilityService;
        }


        /// <summary>
        /// Creates and saves case upload document
        /// </summary>
        /// <param name="providerId"></param>
        /// <param name="fileName"></param>
        /// <param name="docBytes"></param>
        /// <param name="uploadedBy"></param>
        /// /// <returns></returns>
        public ProviderCaseUploadDocument CreateCaseUploadDocument(int districtId, string fileName, byte[] docBytes, int uploadedBy)
        {            
            var document = _documentUtilityService.GenerateDocumentRecord<ProviderCaseUploadDocument>(fileName, uploadedBy);
            ValidateAndThrow(document, new DocumentHelperValidator(_documentHelper));
            document.DistrictId = districtId;
            Context.ProviderCaseUploadDocuments.Add(document);
            Context.SaveChanges();
            var absolutePath = _documentHelper.PrependDocsPath(document.FilePath);
            File.WriteAllBytes(absolutePath, docBytes);
            return document;
        }

        public List<ProviderCaseUploadPreviewDto> PreviewRecords(byte[] docBytes, int providerId, int numRecords)
        {
            return _providerCaseUploadService.MapToCaseUpload(providerId, docBytes, numRecords);
        }

        public IQueryable<ProviderCaseUploadDocument> GetCaseUploadDocumentsByDistrictId(int districtId)
        {
            return Context.ProviderCaseUploadDocuments
                        .Where(cu => cu.DistrictId == districtId)
                        .OrderByDescending(doc => doc.DateUpload)
                        .Include(doc => doc.User)
                        .Include(doc => doc.User.AuthUser);
        }

        public ProviderCaseUploadDocument GetCaseUploadDocument(int districtId, int documentId)
        {
            return Context.ProviderCaseUploadDocuments.FirstOrDefault(doc => doc.Id == documentId);
        }

        public byte[] GetCaseUploadDocumentBytes(int districtId, int documentId)
        {
            ProviderCaseUploadDocument document = GetCaseUploadDocument(districtId, documentId);
            return _documentUtilityService.GetDocumentBytes(document);
        }

        public IEnumerable<SelectOptions> GetSelectOptions(int districtId) 
        {
            var today = DateTime.Now;
            return Context.ProviderEscSchoolDistricts
                .Include(p => p.ProviderEscAssignment)
                .Include(p => p.ProviderEscAssignment.Provider)
                .Include(p => p.ProviderEscAssignment.Provider.ProviderUser)
                .Where(p => p.SchoolDistrictId == districtId && !p.ProviderEscAssignment.Archived &&
                    today >= p.ProviderEscAssignment.StartDate &&
                    (today <= p.ProviderEscAssignment.EndDate || p.ProviderEscAssignment.EndDate == null))
                .Select(p => 
                new SelectOptions
                {
                    Id = p.ProviderEscAssignment.ProviderId,
                    Name = p.ProviderEscAssignment.Provider.ProviderUser.FirstName + " " + p.ProviderEscAssignment.Provider.ProviderUser.LastName,
                    Archived = false
                }).Distinct().AsEnumerable();
        }

        /// <summary>
        /// Gets list of excel roster uploads that have not been processd, exclude file that have been
        /// ignored by the user
        /// </summary>
        /// <returns></returns>
        public List<ProviderCaseUploadDocument> GetDocumentsForConversion()
        {
            return Context.ProviderCaseUploadDocuments.Include(sd => sd.SchoolDistrict)
                         .Where(d => d.SchoolDistrict != null && d.DateError == null && d.DateProcessed == null)
                         .ToList();
        }
    }
}
