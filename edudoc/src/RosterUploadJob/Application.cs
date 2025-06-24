using Model;
using Service.SchoolDistricts.Rosters;
using Service.SchoolDistricts.Rosters.RosterUploads;
using System;
using Service.SchoolDistricts.ProviderCaseUploads;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace RosterUploadJob
{
    public interface IApplication
    {
        void Run();
    }

    public class Application : IApplication
    {
        private readonly ISchoolDistrictRosterService _schoolDistrictRosterService;
        private readonly ISchoolDistrictRosterDocumentService _schoolDistrictRosterDocumentService;
        private readonly IRosterUploadService _rosterUploadService;
        private readonly IProviderCaseUploadService _providerCaseUploadService;
        private readonly IProviderCaseUploadDocumentService _providerCaseUploadDocumentService;
        private readonly IPrimaryContext _context;
        private readonly ILogger<Application> _logger;


        public Application(
            ISchoolDistrictRosterService schoolDistrictRosterService,
            ISchoolDistrictRosterDocumentService schoolDistrictRosterDocumentService,
            IRosterUploadService rosterUploadService,
            IProviderCaseUploadService providerCaseUploadService,
            IProviderCaseUploadDocumentService providerCaseUploadDocumentService,
            ILogger<Application> logger,
            IPrimaryContext context)
        {
            _schoolDistrictRosterService = schoolDistrictRosterService;
            _schoolDistrictRosterDocumentService = schoolDistrictRosterDocumentService;
            _rosterUploadService = rosterUploadService;
            _providerCaseUploadService = providerCaseUploadService;
            _providerCaseUploadDocumentService = providerCaseUploadDocumentService;
            _context = context;
            _logger = logger;

        }

        public void Run()
        {
            var unprocessedRosterDocuments = _schoolDistrictRosterDocumentService.GetDocumentsForConversion();
            foreach (var document in unprocessedRosterDocuments)
            {
                try
                {
                    var allRosters = _schoolDistrictRosterService.CreateRosters(document);

                    // Find unique and duplicate rosters
                    var filteredResults = _schoolDistrictRosterService.FilterDuplicateRosters(allRosters);
                    var uniqueRosters = filteredResults.UniqueRosters;
                    var duplicateRosters = filteredResults.DuplicateRosters;

                    IQueryable<Student> districtStudents = _schoolDistrictRosterService.GetDistrictStudents(document.SchoolDistrictId);
                    List<Student> studentList = districtStudents.ToList();

                    _schoolDistrictRosterService.ValidateRosters(uniqueRosters, studentList);
                    var validRosters = _schoolDistrictRosterService.GetValidRosters(uniqueRosters);
                    var matchingRosters = _schoolDistrictRosterService.MatchRostersToStudents(validRosters, districtStudents);
                    _schoolDistrictRosterService.SetMatchingStudentProperties(matchingRosters, districtStudents);
                    _schoolDistrictRosterService.CreateStudentsFromRosters(matchingRosters, validRosters);
                    _rosterUploadService.CompleteRosterUpload(document);
                    _rosterUploadService.SendDuplicateEmail(document, duplicateRosters);
                }
                catch (Exception e)
                {
                    this._logger.LogError(e, "Exception in Run");
                    _rosterUploadService.DiscardRosterUpload(document, e);
                }
            }

            var unprocessedCaseloadUploadDocuments = _providerCaseUploadDocumentService.GetDocumentsForConversion();
            foreach (var document in unprocessedCaseloadUploadDocuments)
            {
                try
                {
                    _providerCaseUploadService.ProcessCaseUploads(document);
                }
                catch (Exception e)
                {
                    this._logger.LogError(e, "Exception in Run");
                    _providerCaseUploadService.DiscardCaseloadUpload(document, e);
                }
            }
        }
    }
}
