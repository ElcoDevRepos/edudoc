using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Service.Users;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.Net.Http.Headers;
using Templator.Models;
using System.Data.Entity;
using Model.Enums;

namespace Service.HtmlToPdf
{
    public class ProgressReportService : BaseService, IProgressReportService
    {

        private ITemplatePdfService _templatePdfService;
        private IConfiguration _configuration;
        private IUserService _userService;
        private IPrimaryContext _context;

        public ProgressReportService(IPrimaryContext context, ITemplatePdfService templatePdfService, IConfiguration configuration, IUserService userService) : base(context)
        {
            _templatePdfService = templatePdfService;
            _configuration = configuration;
            _userService = userService;
            _context = context;
        }

        public FileStreamResult GeneratePdf(int progressReportId)
        {
            var ProgressReportParams = new Templator.Models.ProgressReportParams(_configuration);

            var _progressReport = _context.ProgressReports
                                        .Include(pr => pr.Student)
                                        .Include(pr => pr.Student.SchoolDistrict)
                                        .Include(pr => pr.Student.School)
                                        .Include(pr => pr.Student.School.SchoolDistrictsSchools)
                                        .Include(pr => pr.Student.School.SchoolDistrictsSchools.Select(sds => sds.SchoolDistrict))
                                        .Include(pr => pr.ESignedBy)
                                        .Include(pr => pr.ESignedBy.Providers_ProviderUserId.Select(p => p.ProviderTitle))
                                        .Include(pr => pr.SupervisorESignedBy)
                                        .Include(pr => pr.SupervisorESignedBy.Providers_ProviderUserId.Select(p => p.ProviderTitle))
                                        .FirstOrDefault(pr => pr.Id == progressReportId);


            int studentId = _progressReport.StudentId;
            int providerUserId = _progressReport.CreatedById;

            ProgressReportParams.progressReport = _progressReport;
            ProgressReportParams.district = _progressReport.Student.SchoolDistrict ?? _progressReport.Student.School.SchoolDistrictsSchools.First().SchoolDistrict;
            ProgressReportParams.goals = _context.EncounterStudentGoals
                                                    .Where(esg =>
                                                            !esg.EncounterStudent.Archived &&
                                                            esg.EncounterStudent.StudentId == studentId &&
                                                            esg.EncounterStudent.Encounter.Provider.ProviderUserId == providerUserId &&
                                                            esg.EncounterStudent.CaseLoad.StudentTypeId == (int)StudentTypes.IEP &&
                                                            DbFunctions.TruncateTime(esg.EncounterStudent.EncounterDate) >= DbFunctions.TruncateTime(_progressReport.StartDate) &&
                                                            DbFunctions.TruncateTime(esg.EncounterStudent.EncounterDate) <= DbFunctions.TruncateTime(_progressReport.EndDate)
                                                            )
                                                    .Select(esg => esg.Goal)
                                                    .Distinct()
                                                    .ToList();


            var pdf = _templatePdfService.CreatePdfFromTemplate("ProgressReport.cshtml", ProgressReportParams);
            return new FileStreamResult(new System.IO.MemoryStream(pdf), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = "ProgressReport"
            };
        }

    }
}
