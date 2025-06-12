using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using ExcelDataReader;
using ExcelDataReader.Exceptions;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;

namespace Service.SchoolDistricts.Rosters.RosterUploads
{
    public class RosterUploadService : BaseService, IRosterUploadService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly IDocumentUtilityService _documentUtilityService;
        private readonly IDocumentHelper _documentHelper;
        public RosterUploadService(IPrimaryContext context,
                                IEmailHelper emailHelper,
                                IConfigurationSettings configurationSettings,
                                IConfiguration configuration,
                                IDocumentUtilityService documentUtilityService,
                                IDocumentHelper documentHelper) : base(context)
        {
            _context = context;
            _emailHelper = emailHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _documentUtilityService = documentUtilityService;
            _documentHelper = documentHelper;
        }

        /// <summary>
        /// Reads student data from document (as datatable) and creates SchoolDistrictRosters
        /// </summary>
        /// <param name="table"></param>
        /// <param name="districtId"></param>
        /// <param name="documentId"></param>
        /// <returns></returns>
        private List<SchoolDistrictRoster> CreateRosterEntriesFromUploadedRoster(DataTable table, int districtId, int documentId)
        {
            // Build in memory list of rosters
            var entries = BuildListOfSchoolDistrictRosters(table, districtId, documentId, null);
            // Create and save new schools so they can be assigned to students
            CreateNewSchools(entries);
            //Add rosters to context for proccessing
            return entries;
        }

        /// <summary>
        /// Creates a list of rosters based on the data table provided
        /// </summary>
        /// <param name="table"></param>
        /// <param name="districtId"></param>
        /// <param name="documentId"></param>
        /// <returns></returns>
        private List<SchoolDistrictRoster> BuildListOfSchoolDistrictRosters(DataTable table, int districtId, int? documentId, int? numRecords)
        {
            var entries = new List<SchoolDistrictRoster>();
            var numRecordsToCreate = table.Rows.Count;
            var rows = table.AsEnumerable().Take(numRecordsToCreate);
            foreach (DataRow row in rows)
            {
                SchoolDistrictRoster toAdd = new SchoolDistrictRoster
                {
                    SchoolBuilding = row["School Building"].ToString().Trim(),
                    FirstName = row["First Name"].ToString().Trim(),
                    LastName = row["Last Name"].ToString().Trim(),
                    MiddleName = row["Middle Name"].ToString().Trim(),
                    StudentCode = row["Student Code"].ToString().Trim(),
                    Grade = row["Grade Level"].ToString().Trim(),
                    Address1 = row["Address Line 1"].ToString().Trim(),
                    Address2 = row["Address Line 2"].ToString().Trim(),
                    City = row["City"].ToString().Trim(),
                    StateCode = row["State"].ToString().Trim(),
                    Zip = row["Zip"].ToString().Trim(),
                    DateModified = null,
                    SchoolDistrictId = districtId,
                    SchoolDistrictRosterDocumentId = documentId ?? 0,
                    DateOfBirth = row["Birth Date"].ToString().Trim()
                };

                entries.Add(toAdd);
            }

            return entries;
        }

        /// <summary>
        /// Checks DB for school, if not found creates a new school.
        /// This is done first so the roster upload process can be handled
        /// as a single DB operation.
        /// </summary>
        /// <param name="sdrs"></param>
        /// <returns></returns>
        private void CreateNewSchools(List<SchoolDistrictRoster> sdrs)
        {
            var uniqueSchools = sdrs
                   .Where(sdr => Context.SchoolDistricts.Any(d => d.Id == sdr.SchoolDistrictId))
                   .GroupBy(sdr => new { Name = sdr.SchoolBuilding, DistrictId = sdr.SchoolDistrictId })
                   .ToList();

            // Loading all schools into memory so we don't hit the db every iteration
            var schools = Context.Schools.Include("SchoolDistrictsSchools").ToList();
            var schoolsToSave = new List<School>();
            foreach (var school in uniqueSchools)
            {
                if (!string.IsNullOrWhiteSpace(school.Key.Name) &&
                    !schools.Any(s => s.Name.ToLower().Trim() == school.Key.Name.ToLower().Trim() &&
                        s.SchoolDistrictsSchools.Any() &&
                        s.SchoolDistrictsSchools.First().SchoolDistrictId == school.Key.DistrictId))
                {
                    var newSchool = new School();
                    var schoolDistrictSchool = new SchoolDistrictsSchool()
                    {
                        SchoolDistrictId = school.Key.DistrictId,
                    };
                    newSchool.Name = school.Key.Name;
                    newSchool.SchoolDistrictsSchools.Add(schoolDistrictSchool);
                    schoolsToSave.Add(newSchool);
                }
            }
            Context.Schools.AddRange(schoolsToSave);
            Context.SaveChanges();
        }

        /// <summary>
        /// Takes excel file as byte array, converts it to a datatable, and maps the
        /// rows to SchoolDistrictRoster objects
        /// </summary>
        /// <param name="schoolDistrictId"></param>
        /// <param name="docBytes"></param>
        /// <returns></returns>
        public List<SchoolDistrictRoster> MapToRoster(int schoolDistrictId, byte[] docBytes, int numRecords)
        {
            var result = GetExcelFileAsDataTable(docBytes);
            ThrowIfDocumentIsInvalid(result);
            return BuildListOfSchoolDistrictRosters(result.Tables[0], schoolDistrictId, null, numRecords);
        }

        /// <summary>
        /// Reads excel file from flesystem, converts it to a datatable, and maps the
        /// rows to SchoolDistrictRoster objects
        /// </summary>
        /// <param name="schoolDistrictId"></param>
        /// <param name="document"></param>
        /// <returns></returns>
        public List<SchoolDistrictRoster> MapToRoster(int schoolDistrictId, SchoolDistrictRosterDocument document)
        {
            var bytes = File.ReadAllBytes(_documentHelper.PrependDocsPath(document.FilePath));
            var result = GetExcelFileAsDataTable(bytes);
            ThrowIfDocumentIsInvalid(result);
            return CreateRosterEntriesFromUploadedRoster(result.Tables[0], schoolDistrictId, document.Id);
        }


        /// <summary>
        /// Reads excel file and returns content as DataTable object
        /// </summary>
        /// <param name="docbytes"></param>
        /// <returns></returns>
        private DataSet GetExcelFileAsDataTable(byte[] docbytes)
        {
            if (docbytes == null)
                throw new FileNotFoundException("Document record was invalid or file access on disk failed.");

            try
            {
                using var stream = new MemoryStream(docbytes);
                using var reader = GetDataReader(stream);
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
            catch (Exception)
            {
                throw new ValidationException("Please upload an Excel compatible file.") { Source = "File" };
            }
        }

        private static IExcelDataReader GetDataReader(MemoryStream stream)
        {
            try
            {
                return ExcelReaderFactory.CreateReader(stream);
            }
            catch (HeaderException)
            {
                return ExcelReaderFactory.CreateCsvReader(stream);
            }
        }

        /// <summary>
        /// Gets the heading row from the sample document to validate an uploaded excel doc against
        /// </summary>
        /// <returns></returns>
        private object[] GetSampleRosterDocumentHeadings()
        {
            var dataTable = GetExcelFileAsDataTable(File.ReadAllBytes(_documentHelper.PrependDocsPath(_configuration["SampleRosterDocumentFilename"])));
            return dataTable.Tables[0].Columns.Cast<DataColumn>().Select(c => c.ColumnName).ToArray();
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
        /// Saves changes to database when all steps of job are complete.
        /// </summary>
        public void CompleteRosterUpload(SchoolDistrictRosterDocument doc)
        {
            doc.DateProcessed = DateTime.UtcNow;
            Context.Entry(doc).CurrentValues.SetValues(doc);
            var log = new ConsoleJobLog
            {
                ConsoleJobTypeId = (int)ConsoleJobTypes.ROSTER_UPLOAD,
                Date = (DateTime)doc.DateProcessed,
                RelatedEntityId = doc.Id,
            };
            Context.ConsoleJobLogs.Add(log);
            Context.ChangeTracker.DetectChanges();
            Context.SaveChanges();
        }

        public void SendDuplicateEmail(SchoolDistrictRosterDocument doc, List<SchoolDistrictRoster> duplicateRosters)
        {
            if (!duplicateRosters.Any())
                return;

            var body = $"The following duplicate students were found in roster {doc.Name} uploaded on {doc.DateUpload.ToString("MM/dd/yy")}:  <br /><br />" +
                $"<table border='1' width='100 %'><thead><tr><td>Last Name</td><td>First Name</td><td>Middle Name</td><td>Student Code</td><td>Birthdate</td><td>Address 1</td><td>Address 2</td>" +
                $"<td>City</td><td>State</td><td>Zip</td><td>Grade Level</td><td>School Building</td></tr></thead><tbody>" +
                $"{string.Join("", duplicateRosters.Select(r => BuildDuplicateRosterHTMLRow(r)))}" +
                $"</tbody></table>";
            var adminEmail = Context.Users.Find(doc.UploadedBy)?.Email;

            _emailHelper.SendEmail(new Utilities.Models.EmailParams()
            {
                From = _configurationSettings.GetDefaultEmailFrom(),
                To = adminEmail,
                Subject = $"EduDoc: Duplicate Students Found in {doc.Name}",
                Body = body
            });
        }

        private string BuildDuplicateRosterHTMLRow(SchoolDistrictRoster sdr)
        {
            return $"<tr><td>{sdr.LastName}</td><td>{sdr.FirstName}</td><td>{sdr.MiddleName}</td><td>{sdr.StudentCode}</td><td>{sdr.DateOfBirth}</td><td>{sdr.Address1}</td>" +
                $"<td>{sdr.Address2}</td><td>{sdr.City}</td><td>{sdr.StateCode}</td><td>{sdr.Zip}</td><td>{sdr.Grade}</td><td>{sdr.SchoolBuilding}</td></tr>";
        }

        /// <summary>
        /// Reversts
        /// </summary>
        public void DiscardRosterUpload(SchoolDistrictRosterDocument doc, Exception error)
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
            var roster = Context.SchoolDistrictRosterDocuments.Find(doc.Id);
            roster.DateError = DateTime.UtcNow;
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
                Subject = "Roster Upload Error",
                Body = "Doc Id: " + doc.Id + "<br>" +
                        "FilePath: " + _documentHelper.PrependDocsPath(doc.FilePath) + "<br>" +
                        "Message: " + error.Message + "<br>" +
                        "Stack Trace: " + error.StackTrace.ToString()
            });

        }


    }
}
