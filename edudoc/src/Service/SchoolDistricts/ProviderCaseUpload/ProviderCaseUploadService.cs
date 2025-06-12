using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using ExcelDataReader;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;

namespace Service.SchoolDistricts.ProviderCaseUploads
{
    public class ProviderCaseUploadService : BaseService, IProviderCaseUploadService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly IDocumentUtilityService _documentUtilityService;
        public ProviderCaseUploadService(IPrimaryContext context,
                                IEmailHelper emailHelper,
                                IConfigurationSettings configurationSettings,
                                IConfiguration configuration,
                                IDocumentUtilityService documentUtilityService) : base(context)
        {
            _context = context;
            _emailHelper = emailHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _documentUtilityService = documentUtilityService;

        }

        /// <summary>
        /// Takes excel file as byte array, converts it to a datatable, and maps the
        /// rows to ProviderCaseUpload objects
        /// </summary>
        /// <param name="districtId"></param>
        /// <param name="docBytes"></param>
        /// <returns></returns>
        public List<ProviderCaseUploadPreviewDto> MapToCaseUpload(int districtId, byte[] docBytes, int numRecords)
        {
            var result = GetExcelFileAsDataTable(docBytes);
            ThrowIfDocumentIsInvalid(result);
            return BuildProviderCaseUploadsForPreview(result.Tables[0], districtId, null, numRecords);
        }

        /// <summary>
        /// Reads excel file and returns content as DataTable object
        /// </summary>
        /// <param name="docbytes"></param>
        /// <returns></returns>
        private DataSet GetExcelFileAsDataTable(byte[] docbytes)
        {
            try
            {
                using (var stream = new MemoryStream(docbytes))
                {
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        var result = reader.AsDataSet(new ExcelDataSetConfiguration
                        {
                            UseColumnDataType = true,
                            ConfigureDataTable = (tableReader) => new ExcelDataTableConfiguration()
                            {
                                UseHeaderRow = true
                            }
                        });
                        return result;
                    }
                }
            } catch(Exception ex)
            {
                throw new ValidationException("Please upload an Excel compatible file.") { Source = "File" };
            }
        }

        /// <summary>
        /// Guard that will stop the application from trying to process a document if it is not in
        /// the correct format
        /// </summary>
        /// <param name="tables"></param>
        private void ThrowIfDocumentIsInvalid(DataSet tables)
        {
            var sampleHeadings = GetSampleRosterDocumentHeadings();

            if (tables.Tables == null || tables.Tables.Count <= 0 ||
                !tables.Tables[0].Columns.Cast<DataColumn>().Take(sampleHeadings.Length).Select(c => c.ColumnName).SequenceEqual(sampleHeadings))
                throw new DataException("Excel document is invalid");
        }

        /// <summary>
        /// Creates a list of case uploads based on the data table provided
        /// </summary>
        /// <param name="table"></param>
        /// <param name="districtId"></param>
        /// <param name="documentId"></param>
        /// <returns></returns>
        private List<ProviderCaseUpload> BuildListOfProviderCaseUploads(DataTable table, int districtId, int? documentId, int? numRecords)
        {
            var entries = new List<ProviderCaseUpload>();
            var numRecordsToCreate = numRecords ?? table.Rows.Count;
            var rows = table.AsEnumerable().Take(numRecordsToCreate);
            foreach (DataRow row in rows)
            {
                var providerId = GetProviderId(row["Provider Name"].ToString().Trim(), row["Title"].ToString().Trim(), districtId);
                ProviderCaseUpload toAdd = new ProviderCaseUpload
                {
                    School = row["School"].ToString().Trim(),
                    FirstName = row["Student Fname"].ToString().Trim(),
                    LastName = row["Student Lname"].ToString().Trim(),
                    MiddleName = row["Student Mname"].ToString().Trim(),
                    DateModified = null,
                    DistrictId = districtId,
                    ProviderId = providerId != 0 ? providerId : null,
                    ProviderCaseUploadDocumentId = documentId ?? 0,
                    DateOfBirth = row["Student DOB"].ToString().Trim(),
                    Grade = row["Grade"].ToString().Trim()
                };
                entries.Add(toAdd);
            }
            return entries;
        }

        /// <summary>
        /// Get all students in a school district
        /// </summary>
        /// <param name="districtId"></param>
        /// <returns></returns>
        private IQueryable<Student> GetDistrictStudents(int districtId)
        {
            return Context.Students
                .Include("Address")
                .Include("School")
                .Where(s =>
                    !s.Archived &&
                    (s.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == districtId) ||
                    s.DistrictId == districtId)
            ).AsQueryable();
        }

        private List<ProviderCaseUploadPreviewDto> BuildProviderCaseUploadsForPreview(DataTable table, int districtId, int? documentId, int? numRecords)
        {
            var entries = new List<ProviderCaseUploadPreviewDto>();
            var numRecordsToCreate = table.Rows.Count;
            var rows = table.AsEnumerable().Take(numRecordsToCreate);
            foreach (DataRow row in rows)
            {
                ProviderCaseUploadPreviewDto toAdd = new ProviderCaseUploadPreviewDto
                {
                    School = row["School"].ToString().Trim(),
                    FirstName = row["Student Fname"].ToString().Trim(),
                    LastName = row["Student Lname"].ToString().Trim(),
                    MiddleName = row["Student Mname"].ToString().Trim(),
                    DateOfBirth = row["Student DOB"].ToString().Trim(),
                    ProviderName = row["Provider Name"].ToString().Trim(),
                    ProviderTitle = row["Title"].ToString().Trim(),
                    Grade = row["Grade"].ToString().Trim()
                };
                entries.Add(toAdd);
            }
            return entries;
        }

        private int GetProviderId(string providerName, string providerTitle, int districtId)
        {
            var fullName = providerName.Trim().Split(' ');
            var firstName = fullName.Length > 0 ? fullName[0] : "";
            var lastName = fullName.Length > 1 ? fullName[1] : "";
            var provider = _context.Providers.FirstOrDefault(p => p.ProviderUser.FirstName.ToLower() == firstName.ToLower()
                && p.ProviderUser.LastName.ToLower() == lastName.ToLower() && p.ProviderTitle.Name == providerTitle && !p.Archived &&
                p.ProviderEscAssignments.Any(pea => pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)));
            return provider != null ? provider.Id : 0;
        }

        public void ProcessCaseUploads(ProviderCaseUploadDocument doc)
        {
            doc.DateProcessed = DateTime.UtcNow;
            DataSet dataSet = MapDocumentToProviderCaseUpload(doc);
            // get case uploads
            var caseUploads = BuildListOfProviderCaseUploads(dataSet.Tables[0], doc.DistrictId, doc.Id, null);

            var districtStudents = GetDistrictStudents(doc.DistrictId);
            // validate data
            ValidateCaseUploads(caseUploads);
            var validatedUploads = caseUploads.Where(cu => (bool)!cu.HasDataIssues).ToList();
            // get matching existing students
            var matchingUploads = MatchUploadsToStudents(validatedUploads, districtStudents);
            // update info on existing students
            SetMatchingStudentProperties(matchingUploads, districtStudents);
            // create new students if any
            CheckAndCreateNewStudents(validatedUploads, matchingUploads);
            // add students to provider caseload 
            AddStudentsToProviderCaseload(validatedUploads, districtStudents);
            SendEmail(doc.Id);
        }

        /// <summary>
        /// Reads excel file from filesystem, converts it to a datatable, and maps the
        /// rows to ProviderCaseUpload objects
        /// </summary>
        /// <param name="document"></param>
        /// <returns></returns>
        private DataSet MapDocumentToProviderCaseUpload(ProviderCaseUploadDocument document)
        {
            var bytes = _documentUtilityService.GetDocumentBytes(document);
            var result = GetExcelFileAsDataTable(bytes);
            ThrowIfDocumentIsInvalid(result);
            return result;
        }

        /// <summary>
        /// Gets the heading row from the sample document to validate an uploaded excel doc against
        /// </summary>
        /// <returns></returns>
        private object[] GetSampleRosterDocumentHeadings()
        {
            var dataTable = GetExcelFileAsDataTable(_documentUtilityService.GetDocumentBytes(_configuration["SampleCaseloadUploadDocumentFilename"]));
            return dataTable.Tables[0].Columns.Cast<DataColumn>().Select(c => c.ColumnName).ToArray();
        }

        /// <summary>
        /// Takes a ProviderCaseUpload and validates it.
        /// </summary>
        /// <param name="caseUploads"></param>
        private void ValidateCaseUploads(List<ProviderCaseUpload> caseUploads)
        {
            Context.ProviderCaseUploads.AddRange(caseUploads);
            var dataValidator = new ProviderCaseUploadDataValidator(Context);

            foreach(var caseUpload in caseUploads)
            {
                ValidateIssues(dataValidator, caseUpload);
            }
            Context.SaveChanges();
        }

        private static void ValidateIssues(ProviderCaseUploadDataValidator dataValidator, ProviderCaseUpload caseUpload)
        {
            caseUpload.HasDataIssues = dataValidator.Validate(caseUpload).Errors.Any();
        }

        /// <summary>
        /// Iterates through a list of ProviderCaseUploads and compares them to
        /// existing Student records. Returns and students that satisfy matching conditions
        /// </summary>
        /// <param name="validUploads"></param>
        /// <returns></returns>
        public List<ProviderCaseUpload> MatchUploadsToStudents(List<ProviderCaseUpload> validUploads, IQueryable<Student> students)
        {
            var matchedUploads = new List<ProviderCaseUpload>();

            foreach (var upload in validUploads)
            {
                var matchingStudent = students.Where(GetMatchCondition(upload)).FirstOrDefault();

                if (matchingStudent != null)
                    matchedUploads.Add(upload);
            }

            return matchedUploads;
        }

        /// <summary>
        /// Updates existing student when matched on LastName, FirstName,
        /// StudentCode, Birthdate
        /// </summary>
        /// <param name="schoolDistrictRoster"></param>
        /// <param name="matchingStudents"></param>
        private void SetMatchingStudentProperties(List<ProviderCaseUpload> matchingUploads, IQueryable<Student> students)
        {
            foreach (var upload in matchingUploads)
            {
                var matchingStudent = students.Where(GetMatchCondition(upload)).FirstOrDefault();

                if (!MatchingSchools(upload, matchingStudent) || !MatchingGrades(upload, matchingStudent))
                    matchingStudent.DateModified = DateTime.UtcNow;

                matchingStudent.School = FindSchool(upload.School, upload.DistrictId);
                matchingStudent.Grade = upload.Grade.Trim();

                if (upload.Id > 0)
                {
                    upload.StudentId = matchingStudent.Id;
                }
                else
                {
                    matchingStudent.ProviderCaseUploads.Add(upload); // Add new roster
                }

                Context.Entry(matchingStudent).CurrentValues.SetValues(matchingStudent);
            }

        }

        private bool MatchingSchools(ProviderCaseUpload caseUpload, Student matchingStudent)
        {
            return matchingStudent.School.Name == caseUpload.School;
        }

        private bool MatchingGrades(ProviderCaseUpload caseUpload, Student matchingStudent)
        {
            return matchingStudent.Grade == caseUpload.Grade.Trim();
        }

        /// <summary>
        /// Checks case upload for new students and creates them 
        /// </summary>
        /// <param name="uploads"></param>
        private IEnumerable<Student> CheckAndCreateNewStudents(List<ProviderCaseUpload> uploads, List<ProviderCaseUpload> matchingUploads)
        {
            var newStudents = new List<Student>();
            var newUploads = uploads.Except(matchingUploads);

            foreach (var upload in newUploads)
            {
                if (FindSchool(upload.School, upload.DistrictId) != null)
                {
                    newStudents.Add(CreateNewStudent(upload));
                }
            }
            Context.Students.AddRange(newStudents);
            Context.SaveChanges();
            return newStudents;
        }

        /// <summary>
        /// Returns a function to pass in where clause that determines
        /// whether a case upload is a complete match to a student and
        /// needs to be updated.
        /// </summary>
        /// <param name="pcu"></param>
        /// <returns></returns>
        private Expression<Func<Student, bool>> GetMatchCondition(ProviderCaseUpload pcu)
        {
            DateTime birthdate;
            var date = DateTime.TryParse(pcu.DateOfBirth, out birthdate);
            var d = birthdate.Date;
            return
                (s) =>
                    (s.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == pcu.DistrictId) || s.DistrictId == pcu.DistrictId) &&
                    s.FirstName.ToLower().Trim() == pcu.FirstName.ToLower().Trim() &&
                    s.LastName.ToLower().Trim() == pcu.LastName.ToLower().Trim() &&
                    s.DateOfBirth.Day == d.Day &&
                    s.DateOfBirth.Month == d.Month &&
                    s.DateOfBirth.Year == d.Year;
        }

        private Student CreateNewStudent(ProviderCaseUpload pcu)
        {
            var newStudent = MapCaseUploadToStudent(pcu);

            var newConsent = new StudentParentalConsent()
            {
                ParentalConsentTypeId = (int)StudentParentalConsentTypes.PendingConsent,
                ParentalConsentDateEntered = DateTime.UtcNow,
                ParentalConsentEffectiveDate = DateTime.UtcNow
            };
            newStudent.StudentParentalConsents.Add(newConsent);
            newStudent.ProviderCaseUploads.Add(pcu);
            Context.ChangeTracker.DetectChanges();
            return newStudent;
        }

        /// <summary>
        /// Maps ProviderCaseUpload to Students and returns
        /// new students
        /// </summary>
        /// <param name="pcu"></param>
        /// <returns></returns>
        private Student MapCaseUploadToStudent(ProviderCaseUpload pcu)
        {
            var newStudent = new Student();
            var parentalConsent = new StudentParentalConsent();
            newStudent.FirstName = pcu.FirstName.Trim();
            newStudent.MiddleName = pcu.MiddleName?.Trim();
            newStudent.LastName = pcu.LastName.Trim();
            newStudent.DateOfBirth = DateTime.Parse(pcu.DateOfBirth, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeLocal);
            newStudent.School = FindSchool(pcu.School, pcu.DistrictId);
            newStudent.SchoolId = newStudent.School.Id;
            newStudent.Grade = pcu.Grade;
            parentalConsent.ParentalConsentTypeId = (int)StudentParentalConsentTypes.PendingConsent;
            return newStudent;
        }

        /// <summary>
        /// Checks database for a matching school, if none is found
        /// a new school is created under the current district
        /// </summary>
        /// <param name="schoolName"></param>
        /// <param name="districtId"></param>
        /// <returns></returns>
        private School FindSchool(string schoolName, int districtId)
        {
            return Context.Schools
                .FirstOrDefault(s =>
                    s.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrictId == districtId &&
                    s.Name.ToLower().Trim() == schoolName
                );
        }

        /// <summary>
        /// Add students to provider caseload
        /// </summary>
        /// <param name="uploads"></param>
        /// <returns></returns>
        private void AddStudentsToProviderCaseload(IEnumerable<ProviderCaseUpload> uploads, IQueryable<Student> students) 
        {
            var newUploads = new List<ProviderStudent>();

            foreach (var upload in uploads) 
            {
                var student = students.Where(GetMatchCondition(upload))
                    .Where(s => !s.ProviderStudents.Any(ps => ps.ProviderId == upload.ProviderId)).FirstOrDefault();
                if (student != null) 
                {
                    var newProviderStudent = new ProviderStudent() 
                    {   
                        ProviderId = (int)upload.ProviderId,
                        StudentId = student.Id,       
                    };
                    newUploads.Add(newProviderStudent);
                }
            }
            Context.ProviderStudents.AddRange(newUploads);
            Context.SaveChanges();
        }

        private void SendEmail(int documentId)
        {
            var env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var doc = Context.ProviderCaseUploadDocuments.FirstOrDefault(d => d.Id == documentId);
            var body = $"New case upload document {doc.Name} has been uploaded on {doc.DateUpload.ToString("MM/dd/yy")}.";
            var email = !string.IsNullOrWhiteSpace(env) && env != "Development" ? Context.Users.Find(doc.UploadedBy)?.Email
                : _configuration["TestEmail"];

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _configurationSettings.GetDefaultEmailFrom(),
                To = email,
                Subject = $"EduDoc: New case upload document {doc.Name} uploaded",
                Body = body
            });
        }

        public IEnumerable<ProviderCaseUpload> GetCaseUploadsBySchoolDistrictId(int userId) 
        {
            return Context.ProviderCaseUploads
                .Include(pcu => pcu.Provider)
                .Include(pcu => pcu.Provider.ProviderUser)
                .Include(pcu => pcu.Provider.ProviderTitle)
                .Where(
                    r => r.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) &&
                    r.StudentId == null &&
                    !r.Archived &&
                    (r.HasDataIssues == true || r.HasDuplicates == true)
                )
                .OrderByDescending(r => r.ProviderCaseUploadDocumentId);
        }

        public ProviderCaseUpload ProcessDataIssueFix(ProviderCaseUpload caseUpload)
        {
            var pcu = Context.ProviderCaseUploads.FirstOrDefault(pcu => pcu.Id == caseUpload.Id);
            ThrowIfNull(pcu);
            Context.Entry(pcu).CurrentValues.SetValues(caseUpload);
            if (IsValidCaseUpload(pcu))
            {
                var caseUploads = new List<ProviderCaseUpload> { caseUpload };
                // create new students if any
                CheckAndCreateNewStudents(caseUploads, new List<ProviderCaseUpload>());
                var districtStudents = GetDistrictStudents(caseUpload.DistrictId);
                // add students to provider caseload 
                AddStudentsToProviderCaseload(caseUploads, districtStudents);
            }
            Context.SaveChanges();
            return caseUpload;
        }
        private bool IsValidCaseUpload(ProviderCaseUpload caseUpload)
        {
            var dataValidator = new ProviderCaseUploadDataValidator(Context);
            ValidateIssues(dataValidator, caseUpload);
            Context.SaveChanges();
            return !(bool)caseUpload.HasDataIssues;
        }
        /// <summary>
        /// Reversts 
        /// </summary>
        public void DiscardCaseloadUpload(ProviderCaseUploadDocument doc, Exception error)
        {
            var changedEntities = Context.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added ||
                            e.State == EntityState.Modified ||
                            e.State == EntityState.Deleted).ToList();

            foreach (var entry in changedEntities)
            {
                entry.State = EntityState.Detached;
            }

            // Log error time
            var caseloadUpload = Context.ProviderCaseUploadDocuments.Find(doc.Id);
            caseloadUpload.DateError = DateTime.UtcNow;
            var log = new ConsoleJobLog
            {
                ConsoleJobTypeId = (int)ConsoleJobTypes.ROSTER_UPLOAD,
                Date = DateTime.Now,
                RelatedEntityId = doc.Id,
                StackTrace = error.StackTrace,
                ErrorMessage = error.Message,
                IsError = true,
            };
            Context.ConsoleJobLogs.Add(log);
            Context.ChangeTracker.DetectChanges();
            Context.SaveChanges();

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _configurationSettings.GetDefaultEmailFrom(),
                To = _configuration["SystemErrorEmails"],
                Subject = "Provider Caseload Upload Error",
                Body = "Doc Id: " + doc.Id + Environment.NewLine + "Message: " + error.Message + Environment.NewLine + " Stack Trace: " + error.StackTrace.ToString(),
                IsHtml = false
            });

        }
        public void RemoveAllIssues(int userId) 
        {
            var uploads = Context.ProviderCaseUploads.Where(pcu => pcu.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) &&
                !pcu.Archived && (bool)pcu.HasDataIssues);

            foreach (var upload in uploads)
            {
                upload.Archived = !upload.Archived;
                upload.ModifiedById = userId;
                upload.DateModified = DateTime.UtcNow;
            }
            Context.SaveChanges();
        }
    }
}
