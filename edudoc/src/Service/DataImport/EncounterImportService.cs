using BreckServiceBase.Utilities.Interfaces;
using Model;
using Model.Enums;
using Model.DataImport;
using Service.Base;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using System.Globalization;
using Service.Encounters;
using System.Data.Entity;
using System.Data.Entity.Validation;
using Newtonsoft.Json;

namespace Service.DataImport
{
    public class EncounterImportService : IDataImportService
    {
        private readonly IPrimaryContext _context;
        private readonly IEncounterStudentService _encounterStudentService;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;

        public EncounterImportService(IPrimaryContext context, IEncounterStudentService encounterStudentService, IEncounterStudentStatusService encounterStudentStatusService)
        {
            _context = context;
            _encounterStudentService = encounterStudentService;
            _encounterStudentStatusService = encounterStudentStatusService;
        }

        public string ImportType => "encounters";

        /// <summary>
        /// Generates a CSV template for encounter imports
        /// </summary>
        /// <returns>Byte array containing the CSV template</returns>
        public byte[] GenerateTemplate()
        {
            // Create CSV with example rows
            using var memoryStream = new MemoryStream();
            using var writer = new StreamWriter(memoryStream);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

            // Create example data row
            var exampleRow = new EncounterImportRow
            {
                // Integration information
                ImportSource = "MST Integration",

                // District and School information
                DistrictId = "1",
                DistrictName = "Sample District",
                DistrictCode = "DIST001",
                SchoolId = "1",
                SchoolName = "Sample School",

                // Provider information
                ProviderId = "1",
                ProviderNPI = "1234567890",
                ProviderFirstName = "Jane",
                ProviderLastName = "Smith",

                // Student information
                StudentId = "1",
                StudentCode = "STU001",
                StudentFirstName = "John",
                StudentMiddleName = "A",
                StudentLastName = "Doe",
                StudentDateOfBirth = "01/15/2010",
                StudentGrade = "3",
                StudentMedicaidNo = "ABC123456",
                StudentNotes = "Allergy to peanuts",
                StudentAddressLine1 = "123 Main St",
                StudentAddressLine2 = "Apt 4B",
                StudentCity = "Anytown",
                StudentState = "OH",
                StudentZip = "12345",
                StudentEnrollmentDate = "01/01/2023",
                StudentTypeId = "1",
                StudentTypeName = "Regular Ed",

                // Case Load information
                ServiceCodeId = "100",
                ServiceCodeName = "Speech Therapy",
                CaseLoadDiagnosisCode = "F84.0",
                IEPStartDate = "01/01/2023",
                IEPEndDate = "12/31/2023",

                // Prescription/Script information
                DoctorFirstName = "Dr. Robert",
                DoctorLastName = "Johnson",
                DoctorNPI = "0987654321",
                PrescriptionInitiationDate = "01/01/2023",
                PrescriptionExpirationDate = "12/31/2023",
                CaseLoadScriptDiagnosisCode = "F84.0",

                // Encounter data
                EncounterDate = "05/15/2023",
                EncounterStartTime = "09:00",
                EncounterEndTime = "10:00",
                ServiceTypeId = "3",
                EvaluationTypeId = "2",
                EncounterDiagnosisCode = "F84.0",
                IsGroup = "false",
                AdditionalStudents = "0",

                // EncounterStudent data
                EncounterLocation = "School Therapy Room",
                StudentStartTime = "09:00",
                StudentEndTime = "10:00",
                EncounterStudentDate = "05/15/2023",
                EncounterStudentDiagnosisCode = "F84.0",
                CPTCode = "99213",
                TherapyCaseNotes = "Initial assessment session",
                SupervisorComments = "Approved by supervisor",
                IsTelehealth = "false"
            };

            // Create example data for a group session
            var groupExampleRow = new EncounterImportRow
            {
                // Integration information
                ImportSource = "MST Integration",

                // District and School information
                DistrictId = "1",
                DistrictName = "Sample District",
                DistrictCode = "DIST001",
                SchoolId = "1",
                SchoolName = "Sample School",

                // Provider information
                ProviderId = "1",
                ProviderNPI = "1234567890",
                ProviderFirstName = "Jane",
                ProviderLastName = "Smith",

                // Student information
                StudentId = "2",
                StudentCode = "STU002",
                StudentFirstName = "Sarah",
                StudentMiddleName = "",
                StudentLastName = "Johnson",
                StudentDateOfBirth = "02/20/2010",
                StudentGrade = "3",
                StudentMedicaidNo = "DEF654321",
                StudentNotes = "",
                StudentAddressLine1 = "456 Oak St",
                StudentAddressLine2 = "",
                StudentCity = "Anytown",
                StudentState = "OH",
                StudentZip = "12345",
                StudentEnrollmentDate = "01/01/2023",
                StudentTypeId = "1",
                StudentTypeName = "Regular Ed",

                // Case Load information
                ServiceCodeId = "100",
                ServiceCodeName = "Speech Therapy",
                CaseLoadDiagnosisCode = "F81.2",
                IEPStartDate = "02/01/2023",
                IEPEndDate = "01/31/2024",

                // Prescription/Script information
                DoctorFirstName = "Dr. Mary",
                DoctorLastName = "Williams",
                DoctorNPI = "5678901234",
                PrescriptionInitiationDate = "02/01/2023",
                PrescriptionExpirationDate = "01/31/2024",
                CaseLoadScriptDiagnosisCode = "F84.0",

                // Encounter data
                EncounterDate = "05/15/2023",
                EncounterStartTime = "09:00",
                EncounterEndTime = "10:00",
                ServiceTypeId = "3",
                EvaluationTypeId = "2",
                EncounterDiagnosisCode = "F81.2",
                IsGroup = "true",
                AdditionalStudents = "3",

                // EncounterStudent data
                EncounterLocation = "School Therapy Room",
                StudentStartTime = "09:00",
                StudentEndTime = "10:00",
                EncounterStudentDate = "05/15/2023",
                EncounterStudentDiagnosisCode = "F81.2",
                CPTCode = "99213",
                TherapyCaseNotes = "Group therapy session",
                SupervisorComments = "Student showed good progress",
                IsTelehealth = "false"
            };

            // Get the legend row with descriptive values
            var legendRow = getLegendValues();

            // Create a list of rows including the legend and examples
            var allRows = new List<EncounterImportRow> { legendRow, exampleRow, groupExampleRow };

            // Write all records with automatic header generation
            csv.WriteRecords(allRows);

            writer.Flush();
            return memoryStream.ToArray();
        }

        /// <summary>
        /// Gets descriptive legend values for each header to indicate requirements
        /// </summary>
        /// <returns>An EncounterImportRow with descriptive values</returns>
        private EncounterImportRow getLegendValues()
        {
            return new EncounterImportRow
            {
                // Integration information
                ImportSource = "Source of the import data",

                // District and School information (identification only - cannot create)
                DistrictId = "REQUIRED: Either DistrictId or DistrictName",
                DistrictName = "REQUIRED: Either DistrictId or DistrictName",
                DistrictCode = "Optional: Additional information",
                SchoolId = "REQUIRED: Either SchoolId or SchoolName",
                SchoolName = "REQUIRED: Either SchoolId or SchoolName",

                // Provider information (identification only - cannot create)
                ProviderId = "Use this ID if available, otherwise use alternative identification fields",
                ProviderNPI = "Provider NPI number can be used instead of ID",
                ProviderFirstName = "Provider first name (use with last name when ID/NPI not available)",
                ProviderLastName = "Provider last name (use with first name when ID/NPI not available)",

                // Student information (can create if missing)
                StudentId = "Use to identify existing student by ID",
                StudentCode = "School code for student (alternative to ID)",
                StudentFirstName = "REQUIRED for new student creation",
                StudentMiddleName = "Optional middle name",
                StudentLastName = "REQUIRED for new student creation",
                StudentDateOfBirth = "REQUIRED for new student: format MM/DD/YYYY",
                StudentGrade = "REQUIRED for new student (K, 1, 2, etc.)",
                StudentMedicaidNo = "Optional Medicaid number",
                StudentNotes = "Optional notes about the student",
                StudentAddressLine1 = "Optional street address",
                StudentAddressLine2 = "Optional apartment/unit number",
                StudentCity = "Optional city",
                StudentState = "Optional state (2-letter code)",
                StudentZip = "Optional zip/postal code",
                StudentEnrollmentDate = "Optional enrollment date: format MM/DD/YYYY",
                StudentTypeId = "Student type ID - use StudentTypeName if ID unknown",
                StudentTypeName = "Name of student type (alternative to ID)",

                // Case Load information (can create if missing)
                ServiceCodeId = "Service code ID - use ServiceCodeName if ID unknown",
                ServiceCodeName = "Name of service (e.g., \"Speech Therapy\")",
                CaseLoadDiagnosisCode = "Diagnosis code for CaseLoad (e.g., \"F84.0\")",
                IEPStartDate = "IEP start date: format MM/DD/YYYY",
                IEPEndDate = "IEP end date: format MM/DD/YYYY",

                // Prescription/Script information (can create if missing)
                DoctorFirstName = "Prescribing doctor's first name",
                DoctorLastName = "Prescribing doctor's last name",
                DoctorNPI = "Doctor's NPI number (required for billing)",
                PrescriptionInitiationDate = "When prescription becomes valid: format MM/DD/YYYY",
                PrescriptionExpirationDate = "When prescription expires: format MM/DD/YYYY",
                CaseLoadScriptDiagnosisCode = "Diagnosis code for CaseLoadScript (e.g., \"F84.0\")",

                // Encounter data (Encounters table)
                EncounterDate = "Date of service: format MM/DD/YYYY",
                EncounterStartTime = "Overall session start time: format HH:MM or HH:MM AM/PM",
                EncounterEndTime = "Overall session end time: format HH:MM or HH:MM AM/PM",
                ServiceTypeId = "Type of service ID - valid values: 1 (Evaluation/Assessment), 2 (Other/Non-Billable), 3 (Treatment/Therapy)",
                EvaluationTypeId = "Evaluation type ID - valid values: 1 (Initial Evaluation/Assessment), 2 (Re-evaluation/Re-assessment)",
                EncounterDiagnosisCode = "Diagnosis code for this encounter (e.g., \"F84.0\")",
                IsGroup = "Group session indicator: true/false (default: false)",
                AdditionalStudents = "Number of additional students in group (default: 0)",

                // EncounterStudent data (per-student details)
                EncounterLocation = "Location of the encounter with the student",
                StudentStartTime = "This student's session start time: format HH:MM or HH:MM AM/PM",
                StudentEndTime = "This student's session end time: format HH:MM or HH:MM AM/PM",
                EncounterStudentDate = "Optional: Date for this specific student's encounter (may differ from main EncounterDate)",
                EncounterStudentDiagnosisCode = "Student-specific diagnosis code (e.g., \"F84.0\")",
                CPTCode = "CPT code for billing (e.g., \"99213\")",
                TherapyCaseNotes = "Notes from the session for this student",
                SupervisorComments = "Comments from supervisor",
                IsTelehealth = "Telehealth indicator: true/false (default: false)",

                // ValidationErrors
                ValidationErrors = "Any validation errors encountered during import"
            };
        }
        
        /// <summary>
        /// Processes an import file and returns a result with validation information
        /// </summary>
        /// <param name="fileContent">The content of the file to process</param>
        /// <param name="createMissingStudentRecords">Whether to create missing records instead of reporting errors</param>
        /// <returns>A result containing the processed data and any errors</returns>
        public async Task<ImportResult> ProcessImportFileAsync(byte[] fileContent, int userId, bool createMissingStudentRecords = false, DbContextTransaction transaction = null)
        {
            var result = new ImportResult
            {
                Success = true,
                SuccessCount = 0,
                ErrorCount = 0,
                CreatedRecordCount = 0,
                ErrorRows = new List<ImportRow>()
            };

            try
            {
                // Parse the CSV content
                using (var memoryStream = new MemoryStream(fileContent))
                using (var reader = new StreamReader(memoryStream))
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    // Read all records
                    var records = csv.GetRecords<EncounterImportRow>().ToList();

                    if (!records.Any())
                    {
                        result.Success = false;
                        result.Message = "No data rows found in the import file.";
                        return result;
                    }

                    // Clean time fields in all records
                    foreach (var record in records)
                    {
                        CleanTimeFields(record);
                    }

                    // Process each record
                    foreach (var typedRow in records)
                    {
                        try {
                            // Validate the row
                            var validationResult = ValidateMatchingRecords(typedRow, createMissingStudentRecords) as EncounterImportRowValidationResult;

                            if (validationResult.IsValid)
                            {
                                CreateData(typedRow, validationResult, userId, createMissingStudentRecords, transaction);
                                
                                if (validationResult.IsValid)
                                {
                                    result.SuccessCount++;
                                }
                                else
                                {
                                    result.ErrorCount++;
                                    PopulateErrorRow(typedRow, validationResult);
                                    result.ErrorRows.Add(typedRow);
                                }
                            }
                            else
                            {
                                result.ErrorCount++;
                                PopulateErrorRow(typedRow, validationResult);
                                result.ErrorRows.Add(typedRow);
                            }
                        } catch (Exception ex) {
                            var validationResult = new EncounterImportRowValidationResult {
                                IsValid = false,
                                OriginalTypedRow = typedRow,
                                Errors = new List<string> { $"Error processing row: {ex.Message}" }
                            };

                            result.ErrorCount++;
                            PopulateErrorRow(typedRow, validationResult);
                            result.ErrorRows.Add(typedRow);
                        }
                    }

                    // Generate error file content if there are errors
                    if (result.ErrorCount > 0)
                    {
                        result.ErrorFileContent = GenerateErrorFileContent(result.ErrorRows.Cast<EncounterImportRow>().ToList());
                    }

                    // Set overall success based on whether there were any errors
                    result.Success = result.ErrorCount == 0;

                    // Add summary message
                    var createdStudentsMessage = result.CreatedRecordCount > 0
                        ? $", {result.CreatedRecordCount} new students"
                        : "";

                    result.Message =
                        $"Import completed with {result.SuccessCount} successful rows{createdStudentsMessage} and {result.ErrorCount} error rows.";

                    return result;
                }
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error processing import file: {ex.Message}";
                return result;
            }
        }

        /// <summary>
        /// Converts time fields from Eastern Time to UTC before processing
        /// </summary>
        private void CleanTimeFields(EncounterImportRow row)
        {
            var easternTime = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
            
            // Parse the encounter date first
            if (!DateTime.TryParse(row.EncounterDate, out DateTime encounterDate))
            {
                return; // If we can't parse the date, we can't proceed with time conversions
            }

            // Parse the encounter student date if provided
            DateTime? studentDate = null;
            if (!string.IsNullOrWhiteSpace(row.EncounterStudentDate) && 
                DateTime.TryParse(row.EncounterStudentDate, out DateTime parsedStudentDate))
            {
                studentDate = parsedStudentDate;
            }

            // Clean EncounterStartTime
            if (!string.IsNullOrWhiteSpace(row.EncounterStartTime) && 
                DateTime.TryParse(row.EncounterStartTime, out DateTime startTime))
            {
                // Combine the encounter date with the time
                var startDateTime = encounterDate.Date.Add(startTime.TimeOfDay);
                var utcTime = TimeZoneInfo.ConvertTimeToUtc(startDateTime, easternTime);
                row.EncounterStartTime = utcTime.ToString("HH:mm");
            }

            // Clean EncounterEndTime
            if (!string.IsNullOrWhiteSpace(row.EncounterEndTime) && 
                DateTime.TryParse(row.EncounterEndTime, out DateTime endTime))
            {
                // Combine the encounter date with the time
                var endDateTime = encounterDate.Date.Add(endTime.TimeOfDay);
                var utcTime = TimeZoneInfo.ConvertTimeToUtc(endDateTime, easternTime);
                row.EncounterEndTime = utcTime.ToString("HH:mm");
            }

            // Clean StudentStartTime if provided
            if (!string.IsNullOrWhiteSpace(row.StudentStartTime) && 
                DateTime.TryParse(row.StudentStartTime, out DateTime studentStartTime))
            {
                // Use student date if available, otherwise fall back to encounter date
                var dateToUse = studentDate ?? encounterDate;
                var studentStartDateTime = dateToUse.Date.Add(studentStartTime.TimeOfDay);
                var utcTime = TimeZoneInfo.ConvertTimeToUtc(studentStartDateTime, easternTime);
                row.StudentStartTime = utcTime.ToString("HH:mm");
            }

            // Clean StudentEndTime if provided
            if (!string.IsNullOrWhiteSpace(row.StudentEndTime) && 
                DateTime.TryParse(row.StudentEndTime, out DateTime studentEndTime))
            {
                // Use student date if available, otherwise fall back to encounter date
                var dateToUse = studentDate ?? encounterDate;
                var studentEndDateTime = dateToUse.Date.Add(studentEndTime.TimeOfDay);
                var utcTime = TimeZoneInfo.ConvertTimeToUtc(studentEndDateTime, easternTime);
                row.StudentEndTime = utcTime.ToString("HH:mm");
            }
        }

        /// <summary>
        /// Validates a row from an encounter import file
        /// </summary>
        /// <param name="row">Dictionary containing the row data with column names as keys</param>
        /// <param name="createMissingStudentRecords">Whether to create missing records instead of reporting errors</param>
        /// <returns>A validation result containing any errors found</returns>
        private DataImportRowValidationResult ValidateMatchingRecords(EncounterImportRow typedRow, bool createMissingStudentRecords = false)
        {
            var result = new EncounterImportRowValidationResult
            {
                IsValid = true,
                OriginalTypedRow = typedRow,
                Errors = new List<string>()
            };

            // Validate District
            ValidateMatchingDistrict(typedRow, result);

            // If district validation failed, no need to continue with other validations
            if (!result.IsValid)
                return result;

            // Validate Provider
            ValidateMatchingProvider(typedRow, result);

            // If provider validation failed, no need to continue
            if (!result.IsValid)
                return result;

            // Check if the provider's service code is 5 (nursing)
            // Only perform import source/goal validation for nursing encounters
            if (result.MatchingProviderTitle != null && result.MatchingProviderTitle.ServiceCodeId == 5)
            {
                // Look up a goal for the script based on the ImportSource
                if (string.IsNullOrWhiteSpace(typedRow.ImportSource))
                {
                    result.Errors.Add("ImportSource is required to determine the appropriate goal for the case load script.");
                    result.IsValid = false;
                    return result;
                }

                string importSource = typedRow.ImportSource.Trim();
                var matchingGoal = _context.Goals
                    .FirstOrDefault(g => g.Description.Equals(importSource) && !g.Archived);

                if (matchingGoal == null)
                {
                    result.Errors.Add($"No matching goal found for ImportSource '{importSource}'. Please ensure a goal with this description exists in the system.");
                    result.IsValid = false;
                    return result;
                } else {
                    result.MatchingGoal = matchingGoal;
                }
            }

            // Validate Student
            ValidateMatchingStudent(typedRow, result, createMissingStudentRecords);

            if (result.MatchingStudent == null && !createMissingStudentRecords)
                return result;

            // Validate School - we may have already found the school in ValidateMatchingStudent,
            // in which case we want to use that instead of what the row might have provided
            if (result.MatchingSchool == null) {
                ValidateMatchingSchool(typedRow, result);
            }

            // Validate Provider-Student Relationship
            ValidateMatchingProviderStudentRelationship(result);

            // Validate Student Case Load
            ValidateMatchingStudentCaseLoad(typedRow, result);

            return result;
        }

        private void ValidateMatchingDistrict(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            int districtId = 0;
            string districtName = null;

            // Try to get district ID from the row
            if (!string.IsNullOrWhiteSpace(typedRow.DistrictId))
            {
                if (int.TryParse(typedRow.DistrictId, out districtId))
                {
                    // Look up district by ID
                    var district = _context.SchoolDistricts
                        .FirstOrDefault(d => d.Id == districtId && !d.Archived);

                    if (district != null)
                    {
                        result.MatchingDistrict = district;
                        return;
                    }
                    else
                    {
                        result.Errors.Add($"District with ID {districtId} not found or is archived.");
                        result.IsValid = false;
                        return;
                    }
                }
                else
                {
                    result.Errors.Add($"Invalid District ID format: {typedRow.DistrictId}");
                    result.IsValid = false;
                    return;
                }
            }

            // If we couldn't find by ID, try by name
            if (!string.IsNullOrWhiteSpace(typedRow.DistrictName))
            {
                districtName = typedRow.DistrictName.Trim();
                var matchingDistricts = _context.SchoolDistricts
                    .Where(d => d.Name == districtName && !d.Archived)
                    .ToList();

                if (matchingDistricts.Count == 1)
                {
                    result.MatchingDistrict = matchingDistricts.First();
                    return;
                }
                else if (matchingDistricts.Count > 1)
                {
                    result.Errors.Add(
                        $"Multiple districts found with name '{districtName}'. Please specify a district ID.");
                    result.IsValid = false;
                    return;
                }
                else
                {
                    result.Errors.Add($"District with name '{districtName}' not found or is archived.");
                    result.IsValid = false;
                    return;
                }
            }

            // If we get here, we couldn't identify the district
            result.Errors.Add("District could not be identified. Please provide a valid District ID or District Name.");
            result.IsValid = false;
        }

        private void ValidateMatchingProvider(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            // Check if provider ID is provided
            if (!string.IsNullOrWhiteSpace(typedRow.ProviderId))
            {
                // Try to parse provider ID
                if (int.TryParse(typedRow.ProviderId, out int providerId))
                {
                    // Look up provider by ID
                    var provider = _context.Providers.FirstOrDefault(p => p.Id == providerId && !p.Archived);
                    if (provider != null)
                    {
                        result.MatchingProvider = provider;

                        // Validate that provider has a title with service code
                        ValidateProviderTitle(result);
                    }
                    else
                    {
                        result.Errors.Add($"Provider with ID {providerId} not found or is archived.");
                        result.IsValid = false;
                    }
                }
                else
                {
                    result.Errors.Add($"Invalid Provider ID format: {typedRow.ProviderId}");
                    result.IsValid = false;
                }
            }
            // Check if provider NPI is provided
            else if (!string.IsNullOrWhiteSpace(typedRow.ProviderNPI))
            {
                // Look up providers by NPI
                var npi = typedRow.ProviderNPI.Trim();
                var matchingProviders = _context.Providers
                    .Where(p => p.Npi == npi && !p.Archived)
                    .ToList();

                if (matchingProviders.Count == 1)
                {
                    result.MatchingProvider = matchingProviders.First();

                    // Validate that provider has a title with service code
                    ValidateProviderTitle(result);
                }
                else if (matchingProviders.Count > 1)
                {
                    result.Errors.Add(
                        $"Multiple providers found with NPI '{typedRow.ProviderNPI}'. Please specify a provider ID.");
                    result.IsValid = false;
                }
                else
                {
                    result.Errors.Add($"Provider with NPI '{typedRow.ProviderNPI}' not found or is archived.");
                    result.IsValid = false;
                }
            }
            // Check if provider name is provided
            else if (!string.IsNullOrWhiteSpace(typedRow.ProviderFirstName) || !string.IsNullOrWhiteSpace(typedRow.ProviderLastName))
            {
                string firstName = typedRow.ProviderFirstName;
                string lastName = typedRow.ProviderLastName;

                // Look up provider by user's name
                var users = _context.Users.Where(u =>
                    u.FirstName.Contains(firstName) &&
                    u.LastName.Contains(lastName) &&
                    !u.Archived
                ).ToList();

                if (users.Count == 1)
                {
                    var user = users.First();
                    var provider =
                        _context.Providers.FirstOrDefault(p => p.ProviderUserId == user.Id && !p.Archived);
                    if (provider != null)
                    {
                        result.MatchingProvider = provider;

                        // Validate that provider has a title with service code
                        ValidateProviderTitle(result);
                    }
                    else
                    {
                        result.Errors.Add($"No provider found with name '{users[0].FirstName} {users[0].LastName}'.");
                        result.IsValid = false;
                    }
                }
                else if (users.Count > 1)
                {
                    result.Errors.Add(
                        $"Multiple providers found with name '{firstName} {lastName}'. Please specify a Provider ID or NPI.");
                    result.IsValid = false;
                }
                else
                {
                    result.Errors.Add($"No provider found with name '{firstName} {lastName}'.");
                    result.IsValid = false;
                }
            }
            else
            {
                result.Errors.Add("Provider information is required. Please provide a Provider ID NPI or Name.");
                result.IsValid = false;
            }
        }

        private void ValidateProviderTitle(EncounterImportRowValidationResult result)
        {
            // Get the provider title directly using the TitleId from the already-populated Provider object
            var providerTitle = _context.ProviderTitles
                .FirstOrDefault(pt => pt.Id == result.MatchingProvider.TitleId && !pt.Archived);

            if (providerTitle == null)
            {
                result.Errors.Add($"Provider (ID: {result.MatchingProvider.Id}) has a title that is archived or not found.");
                result.IsValid = false;
                return;
            }

            // Store the provider title in the result
            result.MatchingProviderTitle = providerTitle;
        }

        private void ValidateMatchingStudent(EncounterImportRow typedRow, EncounterImportRowValidationResult result, bool createMissingStudentRecords = false)
        {
            int studentId = 0;
            string studentCode = null;
            string studentFirstName = null;
            string studentLastName = null;
            DateTime studentDob = DateTime.MinValue;

            // Try to get student ID from the row
            if (!string.IsNullOrWhiteSpace(typedRow.StudentId))
            {
                if (int.TryParse(typedRow.StudentId, out studentId))
                {
                    // Look up student by ID
                    var student = _context.Students
                        .FirstOrDefault(s => s.Id == studentId && !s.Archived);

                    if (student != null)
                    {
                        result.MatchingStudent = student;

                        // If we found a student, get their school information
                        if (student.SchoolId > 0)
                        {
                            var school = _context.Schools.FirstOrDefault(s => s.Id == student.SchoolId && !s.Archived);
                            if (school != null)
                            {
                                result.MatchingSchool = school;
                            }
                            else
                            {
                                result.Errors.Add($"Student (ID: {student.Id}) has a school that is archived or not found.");
                                result.IsValid = false;
                            }
                        }

                        return;
                    }
                    else
                    {
                        result.Errors.Add($"Student with ID {studentId} not found or is archived.");
                        result.IsValid = false;
                        return;
                    }
                }
                else
                {
                    result.Errors.Add($"Invalid Student ID format: {typedRow.StudentId}");
                    result.IsValid = false;
                    return;
                }
            }

            // If we couldn't find by ID, try by code
            if (!string.IsNullOrWhiteSpace(typedRow.StudentCode))
            {
                studentCode = typedRow.StudentCode.Trim();
                var matchingStudents = _context.Students
                    .Where(s => s.StudentCode == studentCode && !s.Archived)
                    .ToList();

                if (matchingStudents.Count == 1)
                {
                    result.MatchingStudent = matchingStudents.First();

                    // If we found a student, get their school information
                    if (result.MatchingStudent.SchoolId > 0)
                    {
                        var school =
                            _context.Schools.FirstOrDefault(s => s.Id == result.MatchingStudent.SchoolId && !s.Archived);
                        if (school != null)
                        {
                            result.MatchingSchool = school;
                        }
                        else
                        {
                            result.Errors.Add($"Student (ID: {result.MatchingStudent.Id}) has a school that is archived or not found.");
                            result.IsValid = false;
                        }
                    }

                    return;
                }
                else if (matchingStudents.Count > 1)
                {
                    result.Errors.Add(
                        $"Multiple students found with code '{studentCode}'. Please specify a student ID.");
                    result.IsValid = false;
                    return;
                }
                // If no students found, continue to next identification method
            }

            // If we couldn't find by ID or code, try by name and DOB
            if (!string.IsNullOrWhiteSpace(typedRow.StudentFirstName) && 
                !string.IsNullOrWhiteSpace(typedRow.StudentLastName) && 
                !string.IsNullOrWhiteSpace(typedRow.StudentDateOfBirth))
            {
                studentFirstName = typedRow.StudentFirstName.Trim();
                studentLastName = typedRow.StudentLastName.Trim();

                // Try to parse the date of birth
                if (DateTime.TryParse(typedRow.StudentDateOfBirth, out studentDob))
                {
                    // Look for students with matching name and DOB
                    var matchingStudents = _context.Students
                        .Where(s => s.FirstName == studentFirstName &&
                                    s.LastName == studentLastName &&
                                    s.DateOfBirth.Year == studentDob.Year &&
                                    s.DateOfBirth.Month == studentDob.Month &&
                                    s.DateOfBirth.Day == studentDob.Day &&
                                    !s.Archived)
                        .ToList();

                    if (matchingStudents.Count == 1)
                    {
                        result.MatchingStudent = matchingStudents.First();

                        // If we found a student, get their school information
                        if (result.MatchingStudent.SchoolId > 0)
                        {
                            var school =
                                _context.Schools.FirstOrDefault(s => s.Id == result.MatchingStudent.SchoolId && !s.Archived);
                            if (school != null)
                            {
                                result.MatchingSchool = school;
                            }
                            else
                            {
                                result.Errors.Add($"Student (ID: {result.MatchingStudent.Id}) has a school that is archived or not found.");
                                result.IsValid = false;
                            }
                        }

                        return;
                    }
                    else if (matchingStudents.Count > 1)
                    {
                        result.Errors.Add(
                            $"Multiple students found with name '{studentFirstName} {studentLastName}' and DOB '{studentDob:MM/dd/yyyy}'. Please specify a student ID or code.");
                        result.IsValid = false;
                        return;
                    }
                    else if (!createMissingStudentRecords)
                    {
                        result.Errors.Add(
                            $"Student with name '{studentFirstName} {studentLastName}' and DOB '{studentDob:MM/dd/yyyy}' not found.");
                        result.IsValid = false;
                        return;
                    }
                }
                else
                {
                    result.Errors.Add($"Invalid date format for Student Date of Birth: {typedRow.StudentDateOfBirth}");
                    result.IsValid = false;
                    return;
                }
            }

            if (result.MatchingStudent == null && !createMissingStudentRecords)
            {
                // If we get here, we couldn't identify the student
                result.Errors.Add(
                    "Student could not be identified. Please provide a valid Student ID Student Code or Name with Date of Birth.");
                result.IsValid = false;
            }
        }

        private void ValidateMatchingSchool(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            int schoolId = 0;
            string schoolName = null;

            // Try to get school ID from the row
            if (!string.IsNullOrWhiteSpace(typedRow.SchoolId))
            {
                if (int.TryParse(typedRow.SchoolId, out schoolId))
                {
                    // Look up school by ID
                    var school = _context.Schools
                        .FirstOrDefault(s => s.Id == schoolId && !s.Archived);

                    if (school != null)
                    {
                        result.MatchingSchool = school;
                        return;
                    }
                    else
                    {
                        result.Errors.Add($"School with ID {schoolId} not found or is archived.");
                        result.IsValid = false;
                        return;
                    }
                }
                else
                {
                    result.Errors.Add($"Invalid School ID format: {typedRow.SchoolId}");
                    result.IsValid = false;
                    return;
                }
            }

            // If we couldn't find by ID, try by name
            if (!string.IsNullOrWhiteSpace(typedRow.SchoolName))
            {
                schoolName = typedRow.SchoolName.Trim();

                // If we have a district, look for schools associated with that district
                if (result.MatchingDistrict != null)
                {
                    // Find schools associated with this district through the many-to-many relationship
                    var schoolsInDistrict = _context.SchoolDistrictsSchools
                        .Where(sds => sds.SchoolDistrictId == result.MatchingDistrict.Id)
                        .Select(sds => sds.School)
                        .Where(s => s.Name == schoolName && !s.Archived)
                        .ToList();

                    if (schoolsInDistrict.Count == 1)
                    {
                        result.MatchingSchool = schoolsInDistrict.First();
                        return;
                    }
                    else if (schoolsInDistrict.Count > 1)
                    {
                        result.Errors.Add(
                            $"Multiple schools found with name '{schoolName}' in district '{result.MatchingDistrict.Name}'. Please specify a school ID.");
                        result.IsValid = false;
                        return;
                    }
                    // If no schools found in this district, fall through to the general search
                }

                result.Errors.Add($"School with name '{schoolName}' not found or is archived.");
                result.IsValid = false;
                return;
            }

            result.Errors.Add($"School could not be identified. Please provide a valid School ID or Name.");
            result.IsValid = false;
        }

        private void ValidateMatchingProviderStudentRelationship(EncounterImportRowValidationResult result)
        {
            // We can only validate the relationship if we have both a provider and a student
            if (result.MatchingStudent == null)
            {
                return; // Can't validate the relationship without both entities
            }

            // Check if the relationship already exists
            var existingRelationship = _context.ProviderStudents
                .FirstOrDefault(ps => ps.ProviderId == result.MatchingProvider.Id &&
                                      ps.StudentId == result.MatchingStudent.Id);

            result.MatchingProviderStudentRelationship = existingRelationship;
        }

        private void ValidateMatchingStudentCaseLoad(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            // We can only validate case loads if we have a student
            if (result.MatchingStudent == null)
            {
                return;
            }

            // Check if the student has any active case loads with matching service code
            var matchingCaseLoad = _context.CaseLoads
                .FirstOrDefault(cl =>
                    cl.StudentId == result.MatchingStudent.Id &&
                    !cl.Archived &&
                    cl.ServiceCodeId == result.MatchingProviderTitle.ServiceCodeId);

            // If found, set the matching case load
            if (matchingCaseLoad != null)
            {
                result.MatchingCaseLoad = matchingCaseLoad;
                
                // Get the date for which we're validating (encounter date if provided, otherwise current date)
                DateTime validationDate = DateTime.Today;
                if (!string.IsNullOrWhiteSpace(typedRow.EncounterDate))
                {
                    if (DateTime.TryParse(typedRow.EncounterDate, out DateTime encounterDate))
                    {
                        validationDate = encounterDate;
                    }
                }
                
                // Now check for matching CaseLoadScript with valid date range
                var matchingCaseLoadScript = _context.CaseLoadScripts
                    .FirstOrDefault(cls => 
                        cls.CaseLoadId == matchingCaseLoad.Id && 
                        !cls.Archived &&
                        cls.InitiationDate.Year <= validationDate.Year &&
                        (cls.InitiationDate.Year < validationDate.Year || 
                         (cls.InitiationDate.Year == validationDate.Year && 
                          (cls.InitiationDate.Month < validationDate.Month || 
                           (cls.InitiationDate.Month == validationDate.Month && 
                            cls.InitiationDate.Day <= validationDate.Day)))) &&
                        (cls.ExpirationDate == null || 
                         (cls.ExpirationDate.Value.Year > validationDate.Year ||
                          (cls.ExpirationDate.Value.Year == validationDate.Year &&
                           (cls.ExpirationDate.Value.Month > validationDate.Month ||
                            (cls.ExpirationDate.Value.Month == validationDate.Month &&
                             cls.ExpirationDate.Value.Day >= validationDate.Day))))));
                
                if (matchingCaseLoadScript != null)
                {
                    result.MatchingCaseLoadScript = matchingCaseLoadScript;
                }
                // If no matching CaseLoadScript is found, we'll leave MatchingCaseLoadScript as null
                // and create one later when processing the import if needed
            }
            // If no matching case load found, we'll leave MatchingCaseLoad as null
            // and create one later when processing the import
        }

        private (bool isValid, 
                 List<string> errors, 
                 DateTime encounterDate, 
                 DateTime? encounterStudentDate, 
                 TimeSpan encounterStartTime, 
                 TimeSpan encounterEndTime,
                 TimeSpan studentStartTime,
                 TimeSpan studentEndTime) 
        ValidateEncounterDatesAndTimes(EncounterImportRow typedRow)
        {
            var errors = new List<string>();
            DateTime encounterDate;
            DateTime? encounterStudentDate = null;
            TimeSpan encounterStartTime = TimeSpan.Zero;
            TimeSpan encounterEndTime = TimeSpan.Zero;
            TimeSpan studentStartTime = TimeSpan.Zero;
            TimeSpan studentEndTime = TimeSpan.Zero;

            // Validate encounter date
            if (string.IsNullOrWhiteSpace(typedRow.EncounterDate))
            {
                errors.Add("EncounterDate is required.");
                return (false, errors, DateTime.MinValue, null, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);
            }

            if (!DateTime.TryParse(typedRow.EncounterDate, out encounterDate))
            {
                errors.Add($"Invalid date format for EncounterDate: {typedRow.EncounterDate}. Use MM/DD/YYYY format.");
                return (false, errors, DateTime.MinValue, null, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);
            }

            // Validate encounter student date if provided
            if (!string.IsNullOrWhiteSpace(typedRow.EncounterStudentDate))
            {
                if (!DateTime.TryParse(typedRow.EncounterStudentDate, out DateTime studentDate))
                {
                    errors.Add($"Invalid date format for EncounterStudentDate: {typedRow.EncounterStudentDate}. Use MM/DD/YYYY format.");
                    return (false, errors, encounterDate, null, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);
                }
                
                encounterStudentDate = studentDate;
            }
            else
            {
                // If not provided, use encounter date
                encounterStudentDate = encounterDate;
            }

            // Validate encounter start time
            if (string.IsNullOrWhiteSpace(typedRow.EncounterStartTime))
            {
                errors.Add("EncounterStartTime is required.");
                return (false, errors, encounterDate, encounterStudentDate, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);
            }

            if (!DateTime.TryParse(typedRow.EncounterStartTime, out DateTime encounterStartDateTime))
            {
                errors.Add($"Invalid time format for EncounterStartTime: {typedRow.EncounterStartTime}. Use HH:MM or HH:MM AM/PM format.");
                return (false, errors, encounterDate, encounterStudentDate, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);
            }
            encounterStartTime = encounterStartDateTime.TimeOfDay;

            // Validate encounter end time
            if (string.IsNullOrWhiteSpace(typedRow.EncounterEndTime))
            {
                errors.Add("EncounterEndTime is required.");
                return (false, errors, encounterDate, encounterStudentDate, encounterStartTime, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);
            }

            if (!DateTime.TryParse(typedRow.EncounterEndTime, out DateTime encounterEndDateTime))
            {
                errors.Add($"Invalid time format for EncounterEndTime: {typedRow.EncounterEndTime}. Use HH:MM or HH:MM AM/PM format.");
                return (false, errors, encounterDate, encounterStudentDate, encounterStartTime, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);
            }
            encounterEndTime = encounterEndDateTime.TimeOfDay;

            // Validate that encounter start time is before end time
            if (encounterStartTime >= encounterEndTime)
            {
                errors.Add($"EncounterStartTime ({encounterStartTime}) must be before EncounterEndTime ({encounterEndTime}).");
                return (false, errors, encounterDate, encounterStudentDate, encounterStartTime, encounterEndTime, TimeSpan.Zero, TimeSpan.Zero);
            }

            // Validate student start time
            if (string.IsNullOrWhiteSpace(typedRow.StudentStartTime))
            {
                // Default to encounter start time
                studentStartTime = encounterStartTime;
            }
            else if (!DateTime.TryParse(typedRow.StudentStartTime, out DateTime studentStartDateTime))
            {
                errors.Add($"Invalid time format for StudentStartTime: {typedRow.StudentStartTime}. Use HH:MM or HH:MM AM/PM format.");
                return (false, errors, encounterDate, encounterStudentDate, encounterStartTime, encounterEndTime, TimeSpan.Zero, TimeSpan.Zero);
            }
            else
            {
                studentStartTime = studentStartDateTime.TimeOfDay;
            }

            // Validate student end time
            if (string.IsNullOrWhiteSpace(typedRow.StudentEndTime))
            {
                // Default to encounter end time
                studentEndTime = encounterEndTime;
            }
            else if (!DateTime.TryParse(typedRow.StudentEndTime, out DateTime studentEndDateTime))
            {
                errors.Add($"Invalid time format for StudentEndTime: {typedRow.StudentEndTime}. Use HH:MM or HH:MM AM/PM format.");
                return (false, errors, encounterDate, encounterStudentDate, encounterStartTime, encounterEndTime, studentStartTime, TimeSpan.Zero);
            }
            else
            {
                studentEndTime = studentEndDateTime.TimeOfDay;
            }

            // Validate that student start time is before end time
            if (studentStartTime >= studentEndTime)
            {
                errors.Add($"StudentStartTime ({studentStartTime}) must be before StudentEndTime ({studentEndTime}).");
                return (false, errors, encounterDate, encounterStudentDate, encounterStartTime, encounterEndTime, studentStartTime, studentEndTime);
            }

            return (true, errors, encounterDate, encounterStudentDate, encounterStartTime, encounterEndTime, studentStartTime, studentEndTime);
        }
        
        private (bool isValid, string errorMessage) CheckForOverlappingEncounters(
            int studentId, 
            int providerId, 
            DateTime? encounterStudentDate, 
            TimeSpan studentStartTime, 
            TimeSpan studentEndTime)
        {
            // Check for overlapping encounters
            var overlappingEncounters = (from es in _context.EncounterStudents
                           where es.StudentId == studentId
                           && es.Encounter.ProviderId == providerId
                           && !es.Archived
                           && es.EncounterDate.Year == encounterStudentDate.Value.Year
                           && es.EncounterDate.Month == encounterStudentDate.Value.Month
                           && es.EncounterDate.Day == encounterStudentDate.Value.Day
                           && ((es.EncounterStartTime <= studentStartTime && es.EncounterEndTime > studentStartTime) || // Starts during existing encounter
                              (es.EncounterStartTime < studentEndTime && es.EncounterEndTime >= studentEndTime) || // Ends during existing encounter
                              (es.EncounterStartTime >= studentStartTime && es.EncounterEndTime <= studentEndTime)) // Contained within the new encounter
                           select es).ToList();

            if (overlappingEncounters.Any())
            {
                var firstOverlap = overlappingEncounters.First();
                return (false, $"This student already has an encounter with this provider on {encounterStudentDate.Value.ToShortDateString()} from {firstOverlap.EncounterStartTime} to {firstOverlap.EncounterEndTime}.");
            }

            return (true, null);
        }

        private (bool isValid, string errorMessage, Encounter encounter) CreateEncounter(
            EncounterImportRow typedRow, 
            Provider matchingProvider, 
            DateTime encounterDate, 
            TimeSpan encounterStartTime, 
            TimeSpan encounterEndTime,
            EncounterImportRowValidationResult result)
        {
            // Create the Encounter object
            var encounter = new Encounter
            {
                ProviderId = matchingProvider.Id,
                EncounterDate = encounterDate,
                EncounterStartTime = encounterStartTime,
                EncounterEndTime = encounterEndTime,
                DateCreated = DateTime.UtcNow,
                CreatedById = matchingProvider.ProviderUserId
            };
            
            // Parse optional encounter fields
            if (!string.IsNullOrWhiteSpace(typedRow.ServiceTypeId) && int.TryParse(typedRow.ServiceTypeId, out int serviceTypeId))
            {
                // Verify that the service type exists and is a valid value (1, 2, or 3)
                if (serviceTypeId >= 1 && serviceTypeId <= 3)
                {
                    encounter.ServiceTypeId = serviceTypeId;
                }
                else
                {
                    return (false, $"Invalid ServiceTypeId: {serviceTypeId}. Valid values are: 1 (Evaluation/Assessment); 2 (Other/Non-Billable); 3 (Treatment/Therapy)", null);
                }
            }
            else
            {
                return (false, "ServiceTypeId is required. Valid values are: 1 (Evaluation/Assessment); 2 (Other/Non-Billable); 3 (Treatment/Therapy)", null);
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.EvaluationTypeId) && int.TryParse(typedRow.EvaluationTypeId, out int evalTypeId))
            {
                // Verify that the evaluation type exists and is a valid value (1 or 2)
                if (evalTypeId >= 1 && evalTypeId <= 2)
                {
                    encounter.EvaluationTypeId = evalTypeId;
                }
                else
                {
                    return (false, $"Invalid EvaluationTypeId: {evalTypeId}. Valid values are: 1 (Initial Evaluation/Assessment); 2 (Re-evaluation/Re-assessment)", null);
                }
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.EncounterDiagnosisCode))
            {
                // Get the service code ID from the provider title
                int serviceCodeId = result.MatchingProviderTitle.ServiceCodeId;
                
                // For encounters, we use the service type from the encounter
                int encounterServiceTypeId = encounter.ServiceTypeId;
                
                var (isValid, errorMessage) = ValidateDiagnosisCode(typedRow.EncounterDiagnosisCode, serviceCodeId, encounterServiceTypeId);
                if (!isValid)
                {
                    return (false, errorMessage, null);
                }
                
                // Look up the diagnosis code
                var diagCode = typedRow.EncounterDiagnosisCode.Trim();
                var diagnosisCode = _context.DiagnosisCodes.FirstOrDefault(dc => dc.Code == diagCode && !dc.Archived);
                encounter.DiagnosisCodeId = diagnosisCode.Id;
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.IsGroup) && bool.TryParse(typedRow.IsGroup, out bool isGroup))
            {
                encounter.IsGroup = isGroup;
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.AdditionalStudents) && int.TryParse(typedRow.AdditionalStudents, out int additionalStudents))
            {
                encounter.AdditionalStudents = additionalStudents;
            }

            return (true, null, encounter);
        }

        private (bool isValid, string errorMessage, EncounterStudent encounterStudent, CptCode cptCode) CreateEncounterStudent(
            EncounterImportRow typedRow, 
            int? studentId, 
            DateTime encounterStudentDate, 
            TimeSpan studentStartTime, 
            TimeSpan studentEndTime,
            CaseLoad caseLoad,
            Provider matchingProvider,
            EncounterImportRowValidationResult result,
            Encounter encounter)
        {
            // Create the EncounterStudent object
            var encounterStudent = new EncounterStudent
            {
                EncounterDate = encounterStudentDate,
                EncounterStartTime = studentStartTime,
                EncounterEndTime = studentEndTime,
                DateCreated = DateTime.UtcNow,
                CreatedById = matchingProvider.ProviderUserId,
                ESignedById = matchingProvider.ProviderUserId,
                EncounterStatusId = 1, // Default to status ID 1 (typically "Draft" or "Pending")
            };

            // Set StudentId only if it has a value
            if (studentId.HasValue)
            {
                encounterStudent.StudentId = studentId.Value;
            }
            
            CptCode cptCodeEntity = null;
            
            // Parse optional encounter student fields
            if (!string.IsNullOrWhiteSpace(typedRow.EncounterLocation))
            {
                // Look up location by name
                var locationName = typedRow.EncounterLocation.Trim();
                var location = _context.EncounterLocations.FirstOrDefault(l => l.Name == locationName);
                
                if (location != null)
                {
                    encounterStudent.EncounterLocationId = location.Id;
                }
                else
                {
                    return (false, $"Encounter location '{locationName}' not found. Please provide a valid location name.", null, null);
                }
            }
            else
            {
                return (false, "EncounterLocation is required.", null, null);
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.EncounterStudentDiagnosisCode))
            {
                // Get the service code ID from the provider title
                int serviceCodeId = result.MatchingProviderTitle.ServiceCodeId;
                
                // For encounter students, we use the service type from the encounter
                int encounterServiceTypeId = encounter.ServiceTypeId;
                
                var (isValid, errorMessage) = ValidateDiagnosisCode(typedRow.EncounterStudentDiagnosisCode, serviceCodeId, encounterServiceTypeId);
                if (!isValid)
                {
                    return (false, errorMessage, null, null);
                }
                
                // Look up the diagnosis code
                var diagnosisCode = _context.DiagnosisCodes.FirstOrDefault(dc => dc.Code == typedRow.EncounterStudentDiagnosisCode.Trim() && !dc.Archived);
                encounterStudent.DiagnosisCodeId = diagnosisCode.Id;
            }
            else if (!string.IsNullOrWhiteSpace(typedRow.EncounterDiagnosisCode))
            {
                // If no encounter student diagnosis code is provided, use the encounter diagnosis code
                // No need to validate again since it was already validated in CreateEncounter
                encounterStudent.DiagnosisCodeId = encounter.DiagnosisCodeId;
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.CPTCode))
            {
                // Note: CPT codes are stored in EncounterStudentCptCodes table, not directly on EncounterStudent
                // We will store the CPT code in the validation result and create the association later
                var cptCode = typedRow.CPTCode.Trim();
                cptCodeEntity = _context.CptCodes.FirstOrDefault(cc => cc.Code == cptCode && !cc.Archived);
                
                if (cptCodeEntity == null)
                {
                    return (false, $"CPT code '{cptCode}' not found or is archived. Please provide a valid CPT code.", null, null);
                }
            }
            else
            {
                return (false, "CPTCode is required.", null, null);
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.TherapyCaseNotes))
            {
                if (typedRow.TherapyCaseNotes.Length > 6000)
                {
                    return (false, "TherapyCaseNotes cannot exceed 6000 characters.", null, null);
                }
                encounterStudent.TherapyCaseNotes = typedRow.TherapyCaseNotes;
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.SupervisorComments))
            {
                if (typedRow.SupervisorComments.Length > 1000)
                {
                    return (false, "SupervisorComments cannot exceed 1000 characters.", null, null);
                }
                encounterStudent.SupervisorComments = typedRow.SupervisorComments;
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.IsTelehealth) && bool.TryParse(typedRow.IsTelehealth, out bool isTelehealth))
            {
                encounterStudent.IsTelehealth = isTelehealth;
            }

            encounterStudent.CaseLoadId = caseLoad.Id;

            return (true, null, encounterStudent, cptCodeEntity);
        }

        /// <summary>
        /// Validates that the CPT code is compatible with the service attributes
        /// </summary>
        /// <param name="cptCodeId">The ID of the CPT code to validate</param>
        /// <param name="serviceCodeId">The service code ID from the provider's title</param>
        /// <param name="serviceTypeId">The service type ID from the encounter</param>
        /// <param name="providerTitleId">The provider title ID</param>
        /// <param name="evaluationTypeId">The evaluation type ID (if applicable)</param>
        /// <param name="isGroup">Whether this is a group session</param>
        /// <param name="isTelehealth">Whether this is a telehealth session</param>
        /// <returns>A tuple with validation result and error message</returns>
        private (bool isValid, string errorMessage) ValidateCptCodeCompatibility(
            int cptCodeId,
            int serviceCodeId,
            int serviceTypeId,
            int providerTitleId,
            int? evaluationTypeId,
            bool isGroup,
            bool isTelehealth)
        {
            // Query the CPTCodeAssocations table to find a matching record
            var query = _context.CptCodeAssocations
                .Where(ca => ca.CptCodeId == cptCodeId &&
                             ca.ServiceCodeId == serviceCodeId &&
                             ca.ServiceTypeId == serviceTypeId &&
                             ca.ProviderTitleId == providerTitleId &&
                             ca.IsGroup == isGroup &&
                             ca.IsTelehealth == isTelehealth &&
                             !ca.Archived);

            // If evaluation type is provided, add it to the query
            if (evaluationTypeId.HasValue)
            {
                query = query.Where(ca => ca.EvaluationTypeId == evaluationTypeId.Value);
            }
            else
            {
                // If no evaluation type is provided, only include records where EvaluationTypeId is null
                query = query.Where(ca => ca.EvaluationTypeId == null);
            }

            // Check if any matching records exist
            var matchingAssociations = query.ToList();

            if (!matchingAssociations.Any())
            {
                // Build a descriptive error message
                var errorMessage = $"CPT code is not valid for the specified combination of service attributes. ";
                errorMessage += $"Service Code ID: {serviceCodeId}, Service Type ID: {serviceTypeId}, ";
                errorMessage += $"Provider Title ID: {providerTitleId}, ";
                
                if (evaluationTypeId.HasValue)
                {
                    errorMessage += $"Evaluation Type ID: {evaluationTypeId.Value}, ";
                }
                
                errorMessage += $"Is Group: {isGroup}, Is Telehealth: {isTelehealth}";
                
                return (false, errorMessage);
            }

            return (true, null);
        }

        private void ValidateIncomingEncounterData(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            // Validate dates and times
            var (isValid, timeErrors, encounterDate, encounterStudentDate, encounterStartTime, encounterEndTime, studentStartTime, studentEndTime) = 
                ValidateEncounterDatesAndTimes(typedRow);

            if (!isValid)
            {
                result.Errors.AddRange(timeErrors);
                result.IsValid = false;
                return;
            }

            // Check for overlapping encounters only if student exists
            if (result.MatchingStudent != null)
            {
                var (noOverlaps, overlapErrorMessage) = CheckForOverlappingEncounters(
                    result.MatchingStudent.Id, result.MatchingProvider.Id, encounterStudentDate, studentStartTime, studentEndTime);

                if (!noOverlaps)
                {
                    // The given student and provider already have an encounter on the given date and time
                    result.Errors.Add(overlapErrorMessage);
                    result.IsValid = false;
                    return;
                }
            }

            // Create the Encounter object
            var (encounterValid, encounterError, encounter) = CreateEncounter(typedRow, result.MatchingProvider, encounterDate, encounterStartTime, encounterEndTime, result);

            if (!encounterValid)
            {
                result.Errors.Add(encounterError);
                result.IsValid = false;
                return;
            }
            
            // Create the EncounterStudent object - use student ID if available
            int? studentId = result.MatchingStudent != null ? result.MatchingStudent.Id : result.CreatedStudent.Id;
            
            // Only create EncounterStudent if we have a student ID or will get one later
            var (encounterStudentValid, studentError, encounterStudent, cptCode) = CreateEncounterStudent(
                typedRow, studentId, encounterStudentDate.Value, studentStartTime, studentEndTime, result.MatchingCaseLoad ?? result.CreatedCaseLoad, result.MatchingProvider, result, encounter);

            if (!encounterStudentValid)
            {
                result.Errors.Add(studentError);
                result.IsValid = false;
                return;
            }
            
            // Validate CPT code compatibility
            var (cptValid, cptErrorMessage) = ValidateCptCodeCompatibility(
                cptCode.Id,
                result.MatchingProviderTitle.ServiceCodeId,
                encounter.ServiceTypeId,
                result.MatchingProviderTitle.Id,
                encounter.EvaluationTypeId,
                encounter.IsGroup,
                encounterStudent.IsTelehealth);
            
            if (!cptValid)
            {
                result.Errors.Add(cptErrorMessage);
                result.IsValid = false;
                return;
            }
            
            // Store the objects in the result
            result.Encounter = encounter;
            result.EncounterStudent = encounterStudent;
            result.EncounterStudentCptCode = cptCode;
        }

        private void PopulateErrorRow(EncounterImportRow typedRow, EncounterImportRowValidationResult validationResult)
        {
            // Update the typedRow with found entity information
            if (validationResult.MatchingDistrict != null)
            {
                // Update district information in the original columns
                typedRow.DistrictId = validationResult.MatchingDistrict.Id.ToString();
                typedRow.DistrictName = validationResult.MatchingDistrict.Name;
            }

            if (validationResult.MatchingSchool != null)
            {
                // Update school information in the original columns
                typedRow.SchoolId = validationResult.MatchingSchool.Id.ToString();
                typedRow.SchoolName = validationResult.MatchingSchool.Name;
            }

            if (validationResult.MatchingProvider != null)
            {
                // Update provider information in the original columns
                typedRow.ProviderId = validationResult.MatchingProvider.Id.ToString();
                typedRow.ProviderNPI = validationResult.MatchingProvider.Npi;

                // Get provider name from user if available
                var providerUser = _context.Users.FirstOrDefault(u =>
                    u.Id == validationResult.MatchingProvider.ProviderUserId);
                if (providerUser != null)
                {
                    typedRow.ProviderFirstName = providerUser.FirstName;
                    typedRow.ProviderLastName = providerUser.LastName;
                }
            }

            if (validationResult.MatchingStudent != null)
            {
                // Update student information in the original columns
                typedRow.StudentId = validationResult.MatchingStudent.Id.ToString();
                typedRow.StudentFirstName = validationResult.MatchingStudent.FirstName;
                typedRow.StudentLastName = validationResult.MatchingStudent.LastName;
                typedRow.StudentCode = validationResult.MatchingStudent.StudentCode;

                // DateOfBirth is not nullable, so we can use it directly
                typedRow.StudentDateOfBirth = validationResult.MatchingStudent.DateOfBirth.ToString("MM/dd/yyyy");
            }

            // Add error messages in a new column
            typedRow.ValidationErrors = string.Join("; ", validationResult.Errors);
        }

        private byte[] GenerateErrorFileContent(List<EncounterImportRow> errorRows)
        {
            if (errorRows == null || !errorRows.Any())
                return null;

            using (var memoryStream = new MemoryStream())
            using (var writer = new StreamWriter(memoryStream))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                // Write records
                csv.WriteRecords(errorRows);
                writer.Flush();
                return memoryStream.ToArray();
            }
        }

        /// <summary>
        /// Creates records from import data
        /// </summary>
        /// <param name="typedRow">The strongly typed import data for the records to create</param>
        /// <param name="result">The validation result containing district, school, provider information</param>
        /// <param name="createMissingStudentRecords">Whether to create missing records instead of reporting errors</param>
        /// <param name="transaction">Optional transaction to use. If not provided, a new transaction will be created and managed.</param>
        private void CreateData(EncounterImportRow typedRow, EncounterImportRowValidationResult result, int userId, bool createMissingStudentRecords = false, DbContextTransaction transaction = null)
        {
            // Use the provided user ID or default to 1 if not provided
            int currentUserId = userId; // Default to system user if not provided

            // If no transaction is provided, create our own
            var shouldManageTransaction = transaction == null;
            transaction = transaction ?? _context.Database.BeginTransaction();

            try
            {
                // Check if we need to create a student
                if (result.MatchingStudent == null && createMissingStudentRecords)
                {
                    // Validate all required data before creating student. Since this student does
                    // not exist yet, we know we definitely need to validate the address and case load.
                    if (!ValidateIncomingAddress(typedRow, result) ||
                        !ValidateIncomingCaseLoad(typedRow, result) ||
                        !ValidateIncomingCaseLoadScript(typedRow, result) ||
                        !ValidateIncomingStudent(typedRow, result))
                    {
                        // Validation failed, the result.IsValid is already set to false 
                        // and error messages added to result.Errors in the validation methods
                        return;
                    }

                    if (HasAnyAddressField(typedRow)) {
                        // Create address from the row data
                        CreateStudentAddress(typedRow, result);
                    }
                    
                    // Create student and student parental consent
                    // This is the first call where we're actually persisting data
                    CreateStudentAndParentalConsent(typedRow, result, currentUserId);
                    
                    // Create provider-student relationship
                    CreateProviderStudentRelationship(result, currentUserId);

                    // Create case load
                    CreateCaseLoad(typedRow, result, currentUserId);

                    if (result.MatchingProviderTitle.ServiceCodeId == 5) {
                        // Create case load script
                        CreateCaseLoadScript(typedRow, result, currentUserId);
                    }

                } else if (result.MatchingStudent != null) {
                    // If we have a matching student, we need to check if we need to create a provider-student relationship,
                    if (result.MatchingProviderStudentRelationship == null) {
                        CreateProviderStudentRelationship(result, currentUserId);
                    }
                    if (result.MatchingCaseLoad == null) {
                        if (ValidateIncomingCaseLoad(typedRow, result)){
                            CreateCaseLoad(typedRow, result, currentUserId);
                        } else {
                            throw new Exception("Failed to create case load");
                        }
                    }
                    if (result.MatchingCaseLoadScript == null && result.MatchingProviderTitle.ServiceCodeId == 5) {
                        if (ValidateIncomingCaseLoadScript(typedRow, result)) {
                            CreateCaseLoadScript(typedRow, result, currentUserId);
                        } else {
                            throw new Exception("Failed to create case load script for existing case load");
                        }
                    } else if (result.MatchingProviderTitle.ServiceCodeId == 5) {
                        // If there's a matching case load script, we need to add the goal related
                        // to the ImportSource to the case load script goals if it isn't already there.
                        if (!result.MatchingCaseLoadScript.CaseLoadScriptGoals.Any(g => g.GoalId == result.MatchingGoal.Id)) {
                            _context.CaseLoadScriptGoals.Add(new CaseLoadScriptGoal {
                                CaseLoadScriptId = result.MatchingCaseLoadScript.Id,
                                GoalId = result.MatchingGoal.Id,
                                CreatedById = currentUserId,
                                DateCreated = DateTime.UtcNow
                            });
                        }
                    }
                }
                
                // Validate Encounter Data
                ValidateIncomingEncounterData(typedRow, result);
                
                // If we made it here, we are ready to create the actual encounter data
                if (result.IsValid && result.Encounter != null && result.EncounterStudent != null && result.EncounterStudentCptCode != null) {
                    _context.Encounters.Add(result.Encounter);
                    result.EncounterStudent.EncounterId = result.Encounter.Id;
                    _context.EncounterStudents.Add(result.EncounterStudent);
                    var encounterStudentCptCode = new EncounterStudentCptCode {
                        EncounterStudentId = result.EncounterStudent.Id,
                        CptCodeId = result.EncounterStudentCptCode.Id,
                        Minutes = (int)(result.EncounterStudent.EncounterEndTime - result.EncounterStudent.EncounterStartTime).TotalMinutes,
                        CreatedById = currentUserId,
                        DateCreated = DateTime.UtcNow
                    };
                    _context.EncounterStudentCptCodes.Add(encounterStudentCptCode);

                    // Create encounter student goal if the service code is nursing
                    if (result.MatchingProviderTitle.ServiceCodeId == 5) {
                        _context.EncounterStudentGoals.Add(new EncounterStudentGoal{
                            EncounterStudentId = result.EncounterStudent.Id,
                            Goal = result.MatchingGoal,
                            CreatedById = currentUserId,
                            DateCreated = DateTime.UtcNow,
                            NursingResponseNote = typedRow.ImportSource,
                            NursingResultNote = typedRow.ImportSource,
                            NursingGoalResultId = result.MatchingGoal.NursingGoalResponse?.NursingGoalResults?.FirstOrDefault()?.Id
                        });
                    }
                    _context.SaveChanges();

                    result.EncounterStudent = _encounterStudentService.GenerateEncounterNumber(result.Encounter.ServiceTypeId, result.EncounterStudent, result.MatchingDistrict.Id);
                    _encounterStudentStatusService.CheckEncounterStudentStatus(result.EncounterStudent.Id, currentUserId);
                    _context.SaveChanges();
                } else {
                    throw new Exception("Failed to create encounter data");
                }
                
                // Only commit if we created the transaction
                if (shouldManageTransaction)
                {
                    transaction.Commit();
                }
            }
            catch (Exception ex)
            {
                // Only rollback if we created the transaction
                if (shouldManageTransaction)
                {
                    transaction.Rollback();
                }
                
                // Log the error and add it to the result
                result.Errors.Add($"Error creating data: {ex.Message}");
                result.IsValid = false;
            }
            finally
            {
                // Only dispose if we created the transaction
                if (shouldManageTransaction)
                {
                    transaction.Dispose();
                }
            }
        }

        /// <summary>
        /// Validates if all required student data is present in the import row
        /// </summary>
        /// <param name="row">Dictionary containing the import data</param>
        /// <param name="result">Validation result to update with errors</param>
        /// <returns>True if validation passes, false otherwise</returns>
        private bool ValidateIncomingStudent(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            List<string> missingFields = new List<string>();
            List<string> invalidFields = new List<string>();
            
            // Check required fields
            if (string.IsNullOrWhiteSpace(typedRow.StudentFirstName))
                missingFields.Add("StudentFirstName");
            else if (typedRow.StudentFirstName.Length > 50)
                invalidFields.Add("StudentFirstName (max 50 characters)");
        
            if (string.IsNullOrWhiteSpace(typedRow.StudentLastName))
                missingFields.Add("StudentLastName");
            else if (typedRow.StudentLastName.Length > 50)
                invalidFields.Add("StudentLastName (max 50 characters)");

            if (!string.IsNullOrWhiteSpace(typedRow.StudentMiddleName) && typedRow.StudentMiddleName.Length > 50)
                invalidFields.Add("StudentMiddleName (max 50 characters)");
        
            if (string.IsNullOrWhiteSpace(typedRow.StudentDateOfBirth))
                missingFields.Add("StudentDateOfBirth");
            else
            {
                // Validate date format
                if (!DateTime.TryParse(typedRow.StudentDateOfBirth, out _))
                {
                    result.Errors.Add($"Invalid date format for StudentDateOfBirth: {typedRow.StudentDateOfBirth}. Use MM/DD/YYYY format.");
                    result.IsValid = false;
                    return false;
                }
            }
        
            if (string.IsNullOrWhiteSpace(typedRow.StudentGrade))
                missingFields.Add("StudentGrade");
            else if (typedRow.StudentGrade.Length > 2)
                invalidFields.Add("StudentGrade (max 2 characters)");

            // Validate optional fields if present
            if (!string.IsNullOrWhiteSpace(typedRow.StudentCode) && typedRow.StudentCode.Length > 12)
                invalidFields.Add("StudentCode (max 12 characters)");

            if (!string.IsNullOrWhiteSpace(typedRow.StudentMedicaidNo))
            {
                if (typedRow.StudentMedicaidNo.Length != 12)
                    invalidFields.Add("StudentMedicaidNo (must be exactly 12 characters)");
            }

            if (!string.IsNullOrWhiteSpace(typedRow.StudentNotes) && typedRow.StudentNotes.Length > 250)
                invalidFields.Add("StudentNotes (max 250 characters)");
        
            // If any required fields are missing, add error and return false
            if (missingFields.Count > 0)
            {
                result.Errors.Add($"Missing required fields for creating a student: {string.Join(" ", missingFields)}");
                result.IsValid = false;
                return false;
            }

            // If any fields exceed length limits, add error and return false
            if (invalidFields.Count > 0)
            {
                result.Errors.Add($"Fields exceed maximum length: {string.Join(" ", invalidFields)}");
                result.IsValid = false;
                return false;
            }
        
            return true;
        }

        /// <summary>
        /// Validates the address data if it's provided in the import row
        /// </summary>
        /// <param name="row">Dictionary containing the import data</param>
        /// <param name="result">Validation result to update with errors</param>
        /// <returns>True if validation passes, false otherwise</returns>
        private bool ValidateIncomingAddress(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            if (HasAnyAddressField(typedRow))
            {
                List<string> missingFields = new List<string>();
        
                // If any address field is provided, these fields become required
                if (string.IsNullOrWhiteSpace(typedRow.StudentAddressLine1))
                    missingFields.Add("StudentAddressLine1");
            
                if (string.IsNullOrWhiteSpace(typedRow.StudentCity))
                    missingFields.Add("StudentCity");
            
                if (string.IsNullOrWhiteSpace(typedRow.StudentState))
                    missingFields.Add("StudentState");
                else
                {
                    // Validate state code format
                    string stateCode = typedRow.StudentState.Trim();
                    var state = _context.States.FirstOrDefault(s => s.StateCode == stateCode);
                    if (state == null)
                    {
                        result.Errors.Add($"StudentState must be a 2-character state code. Provided value was not found. Got: {stateCode}");
                        result.IsValid = false;
                        return false;
                    }
                }
            
                if (string.IsNullOrWhiteSpace(typedRow.StudentZip))
                    missingFields.Add("StudentZip");
            
                // If any required address fields are missing, add error and return false
                if (missingFields.Count > 0)
                {
                    result.Errors.Add($"The following address fields are required when any address information is provided: {string.Join(" ", missingFields)}");
                    result.IsValid = false;
                    return false;
                }

                // Create Address from row data
                Address address = new()
                {
                    Address1 = typedRow.StudentAddressLine1.Trim(),
                    Address2 = !string.IsNullOrWhiteSpace(typedRow.StudentAddressLine2) ? typedRow.StudentAddressLine2.Trim() : string.Empty,
                    City = typedRow.StudentCity.Trim(),
                    StateCode = typedRow.StudentState.Trim(),
                    Zip = typedRow.StudentZip.Trim(),
                    CountryCode = "US", // Default value
                    Province = string.Empty,
                    County = string.Empty
                };
                
                // Validate the address using AddressValidator
                var addressValidator = new Service.Utilities.Validators.AddressValidator();
                var addressValidationResult = addressValidator.Validate(address);
                
                if (!addressValidationResult.IsValid)
                {
                    // Add validation errors to result
                    foreach (var error in addressValidationResult.Errors)
                    {
                        result.Errors.Add($"Address validation error: {error.ErrorMessage}");
                    }
                    result.IsValid = false;
                    return false;
                }
            }

            // No errors found
            return true;
        }

        /// <summary>
        /// Checks if any address fields are present
        /// </summary>
        /// <param name="row">Dictionary containing the import data</param>
        /// <returns>True if any address field is present</returns>
        private bool HasAnyAddressField(EncounterImportRow typedRow)
        {
            return !string.IsNullOrWhiteSpace(typedRow.StudentAddressLine1) ||
                   !string.IsNullOrWhiteSpace(typedRow.StudentAddressLine2) ||
                   !string.IsNullOrWhiteSpace(typedRow.StudentCity) ||
                   !string.IsNullOrWhiteSpace(typedRow.StudentState) ||
                   !string.IsNullOrWhiteSpace(typedRow.StudentZip);
        }

        /// <summary>
        /// Validates a diagnosis code against the DiagnosisCodeAssociations table
        /// </summary>
        /// <param name="diagnosisCode">The diagnosis code to validate</param>
        /// <param name="serviceCodeId">The service code ID to validate against</param>
        /// <param name="serviceTypeId">The service type ID to validate against</param>
        /// <returns>A tuple with validation result and error message</returns>
        private (bool isValid, string errorMessage) ValidateDiagnosisCode(string diagnosisCode, int serviceCodeId, int serviceTypeId)
        {
            if (string.IsNullOrWhiteSpace(diagnosisCode))
            {
                return (true, null); // Empty diagnosis codes are allowed
            }

            string code = diagnosisCode.Trim();
            var diagnosisCodeEntity = _context.DiagnosisCodes.FirstOrDefault(dc => dc.Code == code && !dc.Archived);
            
            if (diagnosisCodeEntity == null)
            {
                return (false, $"Diagnosis code '{code}' not found or is archived.");
            }

            // Check if there's a valid association in the DiagnosisCodeAssociations table
            var association = _context.DiagnosisCodeAssociations.FirstOrDefault(dca => 
                dca.DiagnosisCodeId == diagnosisCodeEntity.Id && 
                dca.ServiceCodeId == serviceCodeId && 
                dca.ServiceTypeId == serviceTypeId && 
                !dca.Archived);

            if (association == null)
            {
                return (false, $"Diagnosis code '{code}' is not associated with the specified service code and service type.");
            }

            return (true, null);
        }

        private bool ValidateIncomingCaseLoad(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            // Optional fields for case load - if provided, attempt to validate them
            
            // Validate student type if provided
            if (!string.IsNullOrWhiteSpace(typedRow.StudentTypeId) || !string.IsNullOrWhiteSpace(typedRow.StudentTypeName))
            {
                if (!string.IsNullOrWhiteSpace(typedRow.StudentTypeId))
                {
                    if (int.TryParse(typedRow.StudentTypeId, out int parsedTypeId)) {
                        var studentType = _context.StudentTypes.FirstOrDefault(st => st.Id == parsedTypeId);
                        if (studentType == null)
                        {
                            result.Errors.Add($"Student type with ID {parsedTypeId} not found.");
                            result.IsValid = false;
                            return false;
                        }
                    } else {
                        result.Errors.Add($"Invalid StudentTypeId format: {typedRow.StudentTypeId}");
                        result.IsValid = false;
                        return false;
                    }
                }
                else
                {
                    var studentTypeName = typedRow.StudentTypeName.Trim();
                    var studentType = _context.StudentTypes.FirstOrDefault(st => st.Name == studentTypeName);
                    if (studentType == null)
                    {
                        result.Errors.Add($"Student type with name '{typedRow.StudentTypeName}' not found.");
                        result.IsValid = false;
                        return false;
                    }
                }
            }

            // Validate diagnosis code if provided
            if (!string.IsNullOrWhiteSpace(typedRow.CaseLoadDiagnosisCode))
            {
                // Get the service code ID from the provider title
                int serviceCodeId = result.MatchingProviderTitle.ServiceCodeId;
                
                // For case loads, we use service type 3 (Treatment/Therapy)
                int serviceTypeId = 3;
                
                var (isValid, errorMessage) = ValidateDiagnosisCode(typedRow.CaseLoadDiagnosisCode, serviceCodeId, serviceTypeId);
                if (!isValid)
                {
                    result.Errors.Add(errorMessage);
                    result.IsValid = false;
                    return false;
                }
            }
            
            // Validate IEP dates if provided
            if (!string.IsNullOrWhiteSpace(typedRow.IEPStartDate))
            {
                if (!DateTime.TryParse(typedRow.IEPStartDate, out _))
                {
                    result.Errors.Add($"Invalid date format for IEPStartDate: {typedRow.IEPStartDate}. Use MM/DD/YYYY format.");
                    result.IsValid = false;
                    return false;
                }
            }
            
            if (!string.IsNullOrWhiteSpace(typedRow.IEPEndDate))
            {
                if (!DateTime.TryParse(typedRow.IEPEndDate, out DateTime iepEndDate))
                {
                    result.Errors.Add($"Invalid date format for IEPEndDate: {typedRow.IEPEndDate}. Use MM/DD/YYYY format.");
                    result.IsValid = false;
                    return false;
                }
                
                // If both dates are provided, validate that end date is after start date
                if (!string.IsNullOrWhiteSpace(typedRow.IEPStartDate) && 
                    DateTime.TryParse(typedRow.IEPStartDate, out DateTime iepStartDate))
                {
                    if (iepEndDate < iepStartDate)
                    {
                        result.Errors.Add($"IEPEndDate ({iepEndDate.ToShortDateString()}) must be after IEPStartDate ({iepStartDate.ToShortDateString()}).");
                        result.IsValid = false;
                        return false;
                    }
                }
            }
            
            // All validation checks passed
            return true;
        }

        /// <summary>
        /// Validates the incoming case load script
        /// </summary>
        /// <param name="row">Dictionary containing the import data</param>
        /// <param name="result">Validation result to update with errors</param>
        /// <returns>True if validation passes, false otherwise</returns>
        private bool ValidateIncomingCaseLoadScript(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            if (result.MatchingProviderTitle.ServiceCodeId == 5)
            {
                // CaseLoadScript (prescription) validation
                // Check for required prescription fields
                List<string> missingPrescriptionFields = new List<string>();
                
                if (string.IsNullOrWhiteSpace(typedRow.DoctorFirstName))
                    missingPrescriptionFields.Add("DoctorFirstName");
                else if (typedRow.DoctorFirstName.Trim().Length > 50)
                {
                    result.Errors.Add("DoctorFirstName cannot exceed 50 characters.");
                    result.IsValid = false;
                    return false;
                }
                
                if (string.IsNullOrWhiteSpace(typedRow.DoctorLastName))
                    missingPrescriptionFields.Add("DoctorLastName");
                else if (typedRow.DoctorLastName.Trim().Length > 50)
                {
                    result.Errors.Add("DoctorLastName cannot exceed 50 characters.");
                    result.IsValid = false;
                    return false;
                }
                
                if (string.IsNullOrWhiteSpace(typedRow.DoctorNPI))
                    missingPrescriptionFields.Add("DoctorNPI");
                else if (typedRow.DoctorNPI.Trim().Length != 10)
                {
                    result.Errors.Add("DoctorNPI must be exactly 10 characters.");
                    result.IsValid = false;
                    return false;
                }
                
                if (string.IsNullOrWhiteSpace(typedRow.PrescriptionInitiationDate))
                    missingPrescriptionFields.Add("PrescriptionInitiationDate");
                
                // Require CaseLoadDiagnosisCode for the CaseLoadScript
                if (string.IsNullOrWhiteSpace(typedRow.CaseLoadScriptDiagnosisCode))
                    missingPrescriptionFields.Add("CaseLoadScriptDiagnosisCode");
                
                // If any required prescription fields are missing, add error and return false
                if (missingPrescriptionFields.Count > 0)
                {
                    result.Errors.Add($"The following prescription fields are required: {string.Join(" ", missingPrescriptionFields)}");
                    result.IsValid = false;
                    return false;
                }

                // Validate the diagnosis code using the new validation method
                int serviceCodeId = result.MatchingProviderTitle.ServiceCodeId;
                int serviceTypeId = 3; // For case load scripts, we use service type 3  (Treatment/Therapy)
                
                var (isValid, errorMessage) = ValidateDiagnosisCode(typedRow.CaseLoadScriptDiagnosisCode, serviceCodeId, serviceTypeId);
                if (!isValid)
                {
                    result.Errors.Add(errorMessage);
                    result.IsValid = false;
                    return false;
                }
                
                // Validate prescription dates
                if (!DateTime.TryParse(typedRow.PrescriptionInitiationDate, out DateTime prescriptionStartDate))
                {
                    result.Errors.Add($"Invalid date format for PrescriptionInitiationDate: {typedRow.PrescriptionInitiationDate}. Use MM/DD/YYYY format.");
                    result.IsValid = false;
                    return false;
                }
                
                if (!string.IsNullOrWhiteSpace(typedRow.PrescriptionExpirationDate))
                {
                    if (!DateTime.TryParse(typedRow.PrescriptionExpirationDate, out DateTime prescriptionEndDate))
                    {
                        result.Errors.Add($"Invalid date format for PrescriptionExpirationDate: {typedRow.PrescriptionExpirationDate}. Use MM/DD/YYYY format.");
                        result.IsValid = false;
                        return false;
                    }
                    
                    // Validate that expiration date is after initiation date
                    if (prescriptionEndDate < prescriptionStartDate)
                    {
                        result.Errors.Add($"PrescriptionExpirationDate ({prescriptionEndDate.ToShortDateString()}) must be after PrescriptionInitiationDate ({prescriptionStartDate.ToShortDateString()}).");
                        result.IsValid = false;
                        return false;
                    }
                }
            }

            return true;
        }

        /// <summary>
        /// Creates a student address from import data
        /// </summary>
        /// <param name="row">Dictionary containing the address data</param>
        /// <param name="result">Validation result to update with errors</param>
        /// <returns>Created Address object or null if creation failed</returns>
        private void CreateStudentAddress(EncounterImportRow typedRow, EncounterImportRowValidationResult result)
        {
            // Create Address from row data
            Address address = new()
            {
                Address1 = typedRow.StudentAddressLine1.Trim(),
                Address2 = !string.IsNullOrWhiteSpace(typedRow.StudentAddressLine2) ? typedRow.StudentAddressLine2.Trim() : string.Empty,
                City = typedRow.StudentCity.Trim(),
                StateCode = typedRow.StudentState.Trim(),
                Zip = typedRow.StudentZip.Trim(),
                CountryCode = "US", // Default value
                Province = string.Empty,
                County = string.Empty
            };
            
            // Store created address in result
            result.CreatedAddress = address;
        }

        /// <summary>
        /// Creates a student and student parental consent from import data
        /// </summary>
        /// <param name="row">Dictionary containing the student data</param>
        /// <param name="address">The student's address (can be null)</param>
        /// <param name="result">Validation result to update with the created student</param>
        /// <param name="currentUserId">ID of the user creating the record</param>
        /// <returns>Created Student object or null if creation failed</returns>
        private void CreateStudentAndParentalConsent(EncounterImportRow typedRow, EncounterImportRowValidationResult result, int currentUserId)
        {
            // Extract required student information from the row
            string firstName = typedRow.StudentFirstName.Trim();
            string lastName = typedRow.StudentLastName.Trim();
            string grade = typedRow.StudentGrade.Trim();
            DateTime dateOfBirth = DateTime.Parse(typedRow.StudentDateOfBirth);
            
            // Extract optional student information
            string middleName = !string.IsNullOrWhiteSpace(typedRow.StudentMiddleName) ? typedRow.StudentMiddleName.Trim() : null;
            
            string studentCode = !string.IsNullOrWhiteSpace(typedRow.StudentCode) ? typedRow.StudentCode.Trim() : null;
            
            string medicaidNo = !string.IsNullOrWhiteSpace(typedRow.StudentMedicaidNo) ? typedRow.StudentMedicaidNo.Trim() : null;
            
            string notes = !string.IsNullOrWhiteSpace(typedRow.StudentNotes) ? typedRow.StudentNotes.Trim() : null;
            
            DateTime enrollmentDate = !string.IsNullOrWhiteSpace(typedRow.StudentEnrollmentDate) ? DateTime.Parse(typedRow.StudentEnrollmentDate) : DateTime.UtcNow;
            
            // Create Student record
            var student = new Student
            {
                FirstName = firstName,
                LastName = lastName,
                MiddleName = middleName,
                StudentCode = studentCode,
                MedicaidNo = medicaidNo,
                Grade = grade,
                DateOfBirth = dateOfBirth,
                Notes = notes,
                Address = result.CreatedAddress,
                SchoolId = result.MatchingSchool.Id,
                DistrictId = result.MatchingDistrict.Id,
                EnrollmentDate = enrollmentDate,
                CreatedById = currentUserId,
                DateCreated = DateTime.UtcNow,
                Archived = false
            };
            
            // Create Parental Consent record
            var consent = new StudentParentalConsent
            {
                Student = student,
                ParentalConsentEffectiveDate = DateTime.UtcNow,
                ParentalConsentDateEntered = DateTime.UtcNow,
                ParentalConsentTypeId = (int)StudentParentalConsentTypes.PendingConsent,
                CreatedById = currentUserId,
                DateCreated = DateTime.UtcNow
            };
            
            // Add the consent to the student's collection
            student.StudentParentalConsents = new List<StudentParentalConsent> { consent };
            
            // Add student to context
            _context.Students.Add(student);
            
            // Save all changes to get the IDs
            _context.SaveChanges();
            
            // Store created student in result
            result.CreatedStudent = student;
        }

        /// <summary>
        /// Creates a provider-student relationship
        /// </summary>
        /// <param name="studentId">ID of the student</param>
        /// <param name="result">Validation result to update with the created relationship</param>
        /// <param name="currentUserId">ID of the user creating the record</param>
        /// <returns>Created ProviderStudent object</returns>
        private void CreateProviderStudentRelationship(EncounterImportRowValidationResult result, int currentUserId)
        {
            // Create provider-student relationship
            var providerStudent = new ProviderStudent
            {
                ProviderId = result.MatchingProvider.Id,
                StudentId = result.CreatedStudent != null ? result.CreatedStudent.Id : result.MatchingStudent.Id,
                CreatedById = currentUserId,
                DateCreated = DateTime.UtcNow
            };
            
            _context.ProviderStudents.Add(providerStudent);
            
            // Save to get providerStudent ID
            _context.SaveChanges();
            
            // Store created provider-student relationship in result
            result.CreatedProviderStudentRelationship = providerStudent;
        }

        /// <summary>
        /// Creates a case load record
        /// </summary>
        /// <param name="row">Dictionary containing the case load data</param>
        /// <param name="result">Validation result to update with the created case load</param>
        /// <param name="currentUserId">ID of the user creating the record</param>
        /// <returns>Created CaseLoad object</returns>
        private void CreateCaseLoad(EncounterImportRow typedRow, EncounterImportRowValidationResult result, int currentUserId)
        {
            // Get student type
            int studentTypeId = 1; // Default student type
            if (!string.IsNullOrWhiteSpace(typedRow.StudentTypeId) && int.TryParse(typedRow.StudentTypeId, out int parsedTypeId))
            {
                studentTypeId = parsedTypeId;
            }
            else if (!string.IsNullOrWhiteSpace(typedRow.StudentTypeName))
            {
                var studentTypeName = typedRow.StudentTypeName.Trim();
                var studentType = _context.StudentTypes.FirstOrDefault(st => st.Name == studentTypeName);
                if (studentType != null)
                {
                    studentTypeId = studentType.Id;
                }
            }
            
            // Get diagnosis code if provided
            int? diagnosisCodeId = null;
            if (!string.IsNullOrWhiteSpace(typedRow.CaseLoadDiagnosisCode))
            {
                var diagCode = typedRow.CaseLoadDiagnosisCode.Trim();
                var diagnosisCode = _context.DiagnosisCodes
                    .FirstOrDefault(dc => dc.Code == diagCode && !dc.Archived);
                if (diagnosisCode != null)
                {
                    diagnosisCodeId = diagnosisCode.Id;
                }
            }
            
            // Parse IEP dates
            DateTime iepStartDate = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(typedRow.IEPStartDate) && DateTime.TryParse(typedRow.IEPStartDate, out DateTime parsedStartDate))
            {
                iepStartDate = parsedStartDate;
            }
            
            DateTime? iepEndDate = DateTime.UtcNow.AddYears(1);
            if (!string.IsNullOrWhiteSpace(typedRow.IEPEndDate) && DateTime.TryParse(typedRow.IEPEndDate, out DateTime parsedEndDate))
            {
                iepEndDate = parsedEndDate;
            }
            
            // Create the case load
            var caseLoad = new CaseLoad
            {
                StudentId = result.CreatedStudent != null ? result.CreatedStudent.Id : result.MatchingStudent.Id,
                StudentTypeId = studentTypeId,
                ServiceCodeId = result.MatchingProviderTitle.ServiceCodeId,
                DiagnosisCodeId = diagnosisCodeId,
                IepStartDate = iepStartDate,
                IepEndDate = iepEndDate,
                Archived = false,
                CreatedById = currentUserId,
                DateCreated = DateTime.UtcNow
            };
            
            _context.CaseLoads.Add(caseLoad);
            _context.SaveChanges();

            result.CreatedCaseLoad = caseLoad;
        }

        /// <summary>
        /// Creates a case load script record
        /// </summary>
        /// <param name="caseLoadId">ID of the case load</param>
        /// <param name="row">Dictionary containing the case load script data</param>
        /// <param name="result">Validation result to update with the created case load script</param>  
        private void CreateCaseLoadScript(EncounterImportRow typedRow, EncounterImportRowValidationResult result, int currentUserId)
        {
            // Parse prescription dates
            DateTime initiationDate = DateTime.UtcNow;
            if (DateTime.TryParse(typedRow.PrescriptionInitiationDate, out DateTime parsedInitDate))
            {
                initiationDate = parsedInitDate;
            }
            
            DateTime? expirationDate = null;
            if (!string.IsNullOrWhiteSpace(typedRow.PrescriptionExpirationDate) && 
                DateTime.TryParse(typedRow.PrescriptionExpirationDate, out DateTime parsedExpDate))
            {
                expirationDate = parsedExpDate;
            }

            // Get diagnosis code if provided
            var diagCode = typedRow.CaseLoadScriptDiagnosisCode.Trim();
            var diagnosisCode = _context.DiagnosisCodes.FirstOrDefault(dc => dc.Code == diagCode && !dc.Archived);

            // Create case load script record
            var caseLoadScript = new CaseLoadScript
            {
                CaseLoadId = result.CreatedCaseLoad != null ? result.CreatedCaseLoad.Id : result.MatchingCaseLoad.Id,
                DiagnosisCodeId = diagnosisCode != null ? diagnosisCode.Id : null,
                Npi = typedRow.DoctorNPI.Trim(),
                DoctorFirstName = typedRow.DoctorFirstName.Trim(),
                DoctorLastName = typedRow.DoctorLastName.Trim(),
                InitiationDate = initiationDate,
                ExpirationDate = expirationDate,
                Archived = false,
                FileName = string.Empty,
                FilePath = string.Empty,
                UploadedById = currentUserId,
                DateUpload = DateTime.UtcNow
            };
            
            _context.CaseLoadScripts.Add(caseLoadScript);
            _context.SaveChanges();
            
            // Store created case load script in result
            result.CreatedCaseLoadScript = caseLoadScript;
            
            var caseLoadScriptGoal = new CaseLoadScriptGoal
            {
                CaseLoadScriptId = caseLoadScript.Id,
                GoalId = result.MatchingGoal.Id,
                Archived = false,
                CreatedById = currentUserId,
                DateCreated = DateTime.UtcNow
            };
            
            _context.CaseLoadScriptGoals.Add(caseLoadScriptGoal);
            _context.SaveChanges();
            
            // Store created case load script goal in result
            result.CreatedCaseLoadScriptGoal = caseLoadScriptGoal;
            
            // Update the script record with modification info
            caseLoadScript.ModifiedById = currentUserId;
            caseLoadScript.DateModified = DateTime.UtcNow;
            _context.SaveChanges();
        }

        /// <summary>
        /// Converts SNAP EMR student and service files into the encounter import format.
        /// </summary>
        /// <remarks>
        /// File Format Specification:
        /// - Files are pipe-delimited ("|") ASCII text files with quoted values
        /// - Column names are in the first row
        /// - File naming: CustomerId_TableName_DateCreated_TimeCreated.Extension
        /// 
        /// Student.txt Fields:
        /// 1. StudentId (50, Alphanumeric) - Required: SNAP's unique identifier
        /// 2. StudentLocalId (50, Alphanumeric) - Optional: School-assigned identifier
        /// 3. StudentStateId (50, Alphanumeric) - Optional: State-assigned identifier
        /// 4. LastName (30, Alpha) - Required: Student's last name
        /// 5. FirstName (30, Alpha) - Required: Student's first name
        /// 6. MiddleName (30, Alpha) - Optional: Student's middle name
        /// 7. GenderCode (1, Alpha) - Required: M => Male, F => Female
        /// 8. DateOfBirth (10, Alphanumeric) - Required: Format MM/DD/YYYY
        /// 9. MedicaidNumber (50, Alphanumeric) - Optional: Student's Medicaid number
        /// 10. ParentAuthorization (1, Alpha) - Optional: Y/N for billing authorization
        /// 11. AddressLine1 (50, Alphanumeric) - Optional: Primary address
        /// 12. AddressLine2 (50, Alphanumeric) - Optional: Secondary address
        /// 13. City (18, Alpha) - Optional: City name
        /// 14. State (2, Alpha) - Optional: State abbreviation
        /// 15. ZipCode (15, Alphanumeric) - Optional: Postal code
        /// 16. HomePhone (13, Alphanumeric) - Optional: Contact number
        /// 
        /// ServiceLog.txt Fields:
        /// 1. ServiceLogId (50, Alphanumeric) - Required: SNAP's unique service identifier
        /// 2. ProviderFirstName (50, Alphanumeric) - Required: Provider's first name
        /// 3. ProviderLastName (50, Alphanumeric) - Required: Provider's last name
        /// 4. ProviderId (20, Alphanumeric) - Optional: Provider's identifier
        /// 5. School (100, Alphanumeric) - Required: Service location school
        /// 6. StudentId (50, Alphanumeric) - Required: Links to Student.txt StudentId
        /// 7. LogDate (10, Alphanumeric) - Required: Format MM/DD/YYYY
        /// 8. EntryDescription (500, Alphanumeric) - Optional: Service description
        /// 9. EntryComments (2000, Alphanumeric) - Optional: Additional notes
        /// 10. TimeIn (10, Alphanumeric) - Required: Format HH:MM (e.g., 1:00 PM)
        /// 11. TimeOut (10, Alphanumeric) - Required: Format HH:MM (e.g., 1:45 PM)
        /// 12. DirectTime (10, Numeric) - Required: Session duration in minutes
        /// 13. DiagnosisCode1 (50, Alphanumeric) - Optional: Primary ICD10 code
        /// 14. DiagnosisCode2 (50, Alphanumeric) - Optional: Secondary ICD10 code
        /// 15. PlaceOfServiceCode (2, Alphanumeric) - Optional: Service type identifier
        /// 16. ProcedureCode (50, Alphanumeric) - Required: Service procedure code
        /// 
        /// Conversion Strategy:
        /// 1. Parse Student.txt to build student records
        /// 2. Parse ServiceLog.txt and link to students
        /// 3. Map SNAP fields to encounter import format
        /// 4. Generate CSV in template format
        /// 5. Handle required field validation
        /// 6. Maintain relationships between records
        /// </remarks>
        /// <param name="studentFileContent">The content of the Student.txt file as a byte array</param>
        /// <param name="serviceFileContent">The content of the ServiceLog.txt file as a byte array</param>
        /// <param name="studentFileName">The name of the student file to extract CustomerId</param>
        /// <returns>A byte array containing the converted encounter import file</returns>
        public async Task<byte[]> ConvertSnapFilesAsync(byte[] studentFileContent, byte[] serviceFileContent, string studentFileName)
        {
            try
            {
                // Extract district ID (CustomerId) from filename
                // Format: CustomerId_TableName_DateCreated_TimeCreated.Extension
                string districtId = "";
                if (!string.IsNullOrEmpty(studentFileName))
                {
                    var parts = studentFileName.Split('_');
                    if (parts.Length >= 1)
                    {
                        districtId = parts[0];
                    }
                }

                if (string.IsNullOrEmpty(districtId))
                {
                    throw new ArgumentException("Could not extract district ID from filename. Expected format: CustomerId_TableName_DateCreated_TimeCreated.Extension");
                }

                // Dictionary to store student data for lookup when processing services
                var studentData = new Dictionary<string, SnapStudent>();

                // Parse Student.txt
                using (var studentStream = new MemoryStream(studentFileContent))
                using (var studentReader = new StreamReader(studentStream))
                using (var studentCsv = new CsvReader(studentReader, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    Delimiter = "|",
                    HasHeaderRecord = true,
                    TrimOptions = CsvHelper.Configuration.TrimOptions.Trim
                }))
                {
                    // Read all student records
                    var studentRecords = studentCsv.GetRecords<SnapStudent>().ToList();
                    foreach (var student in studentRecords)
                    {
                        studentData[student.StudentId] = student;
                    }
                }

                // List to store converted EncounterImportRow objects
                var convertedRows = new List<EncounterImportRow>();

                // Process ServiceLog.txt and convert to EncounterImportRow objects
                using (var serviceStream = new MemoryStream(serviceFileContent))
                using (var serviceReader = new StreamReader(serviceStream))
                using (var serviceCsv = new CsvReader(serviceReader, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    Delimiter = "|",
                    HasHeaderRecord = true,
                    TrimOptions = CsvHelper.Configuration.TrimOptions.Trim
                }))
                {
                    var serviceRecords = serviceCsv.GetRecords<SnapServiceLog>().ToList();
                    foreach (var service in serviceRecords)
                    {
                        // Get corresponding student data
                        if (studentData.TryGetValue(service.StudentId, out var student))
                        {
                            // Create a new EncounterImportRow object
                            var importRow = new EncounterImportRow
                            {
                                // Integration information
                                ImportSource = "SNAP Integration",

                                // District and School information
                                DistrictId = "", // Will be looked up during import
                                DistrictName = "", // Will be looked up during import
                                DistrictCode = "",
                                SchoolId = "", // Will be looked up during import
                                SchoolName = service.School,

                                // Provider information
                                ProviderId = "", // Will be looked up during import
                                ProviderNPI = "",
                                ProviderFirstName = service.ProviderFirstName,
                                ProviderLastName = service.ProviderLastName,

                                // Student information
                                StudentId = "", // Will be looked up during import
                                StudentCode = student.StudentLocalId,
                                StudentFirstName = student.FirstName,
                                StudentMiddleName = student.MiddleName,
                                StudentLastName = student.LastName,
                                StudentDateOfBirth = student.DateOfBirth,
                                StudentGrade = "", // Not provided in SNAP data
                                StudentMedicaidNo = student.MedicaidNumber,
                                StudentNotes = "",
                                StudentAddressLine1 = student.AddressLine1,
                                StudentAddressLine2 = student.AddressLine2,
                                StudentCity = student.City,
                                StudentState = student.State,
                                StudentZip = student.ZipCode,
                                StudentEnrollmentDate = "", // Not provided in SNAP data
                                StudentTypeId = "", // Not provided in SNAP data
                                StudentTypeName = "", // Not provided in SNAP data

                                // Case Load information
                                ServiceCodeId = "", // Will be determined during import
                                ServiceCodeName = "", // Will be determined during import
                                CaseLoadDiagnosisCode = service.DiagnosisCode1,
                                IEPStartDate = "", // Not provided in SNAP data
                                IEPEndDate = "", // Not provided in SNAP data

                                // Prescription/Script information
                                DoctorFirstName = "", // Not provided in SNAP data
                                DoctorLastName = "", // Not provided in SNAP data
                                DoctorNPI = "", // Not provided in SNAP data
                                PrescriptionInitiationDate = "", // Not provided in SNAP data
                                PrescriptionExpirationDate = "", // Not provided in SNAP data
                                CaseLoadScriptDiagnosisCode = service.DiagnosisCode1,

                                // Encounter data
                                EncounterDate = service.LogDate,
                                EncounterStartTime = service.TimeIn,
                                EncounterEndTime = service.TimeOut,
                                ServiceTypeId = "3", // Default to Treatment/Therapy
                                EvaluationTypeId = "", // Not provided in SNAP data
                                EncounterDiagnosisCode = service.DiagnosisCode1,
                                IsGroup = "false", // Default to individual session
                                AdditionalStudents = "0", // Default to no additional students

                                // EncounterStudent data
                                EncounterLocation = service.School,
                                StudentStartTime = service.TimeIn,
                                StudentEndTime = service.TimeOut,
                                EncounterStudentDate = service.LogDate,
                                EncounterStudentDiagnosisCode = service.DiagnosisCode1,
                                CPTCode = service.ProcedureCode,
                                TherapyCaseNotes = service.EntryDescription,
                                SupervisorComments = service.EntryComments,
                                IsTelehealth = "false" // Default to in-person
                            };

                            convertedRows.Add(importRow);
                        }
                    }
                }

                // Create output CSV in memory
                using (var outputStream = new MemoryStream())
                using (var writer = new StreamWriter(outputStream))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    // Write all records with automatic header generation
                    csv.WriteRecords(convertedRows);
                    
                    writer.Flush();
                    return outputStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error converting SNAP files: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Converts MST service records into the encounter import format.
        /// </summary>
        /// <remarks>
        /// File Format Specification:
        /// - Data is provided in JSON format
        /// - Each record contains complete student and service information
        /// - JSON structure includes:
        ///   - CPT codes (up to 3) with durations:
        ///     - CPT1, CPT1Duration
        ///     - CPT2, CPT2Duration
        ///     - CPT3, CPT3Duration
        ///   - District and location information:
        ///     - District
        ///     - Location
        ///   - Provider details:
        ///     - ProviderMSTKey
        ///     - ProviderNPI
        ///     - ProviderFirstName
        ///     - ProviderLastName
        ///     - ProviderTitle
        ///   - Referral information:
        ///     - ReferralDate
        ///     - ReferralTherapistNPI
        ///     - ReferralTherapistFirstName
        ///     - ReferralTherapistLastName
        ///   - Service details:
        ///     - ServiceDate
        ///     - ServiceType
        ///     - SessionStart
        ///     - SessionEnd
        ///     - SessionMSTKey
        ///   - Student information:
        ///     - StudentDOB
        ///     - StudentID
        ///     - StudentMSTKey
        ///     - StudentFirstName
        ///     - StudentLastName
        ///   - Supervisor information:
        ///     - TherapistSuperMSTKey
        ///     - TherapistSuperNPI
        ///     - TherapistSuperFirstName
        ///     - TherapistSuperLastName
        ///   - Additional fields:
        ///     - GroupNumber
        ///     - ICD10
        /// 
        /// Conversion Strategy:
        /// 1. Parse JSON data into MstService objects
        /// 2. Map MST fields to encounter import format
        /// 3. Generate CSV in template format
        /// 4. Handle required field validation
        /// </remarks>
        /// <param name="jsonContent">The content of the JSON file as a byte array</param>
        /// <returns>A byte array containing the converted encounter import file</returns>
        public async Task<byte[]> ConvertMstFilesAsync(byte[] jsonContent)
        {
            try
            {
                // Parse JSON data
                string jsonString = Encoding.UTF8.GetString(jsonContent);
                
                // Deserialize as Dictionary<string, MstService> to handle numbered keys
                var mstServicesDict = JsonConvert.DeserializeObject<Dictionary<string, MstService>>(jsonString);

                if (mstServicesDict == null || !mstServicesDict.Any())
                {
                    throw new ArgumentException("No valid MST service records found in the JSON data.");
                }

                // Extract the MstService objects from the dictionary values
                var mstServices = mstServicesDict.Values.ToList();

                // List to store converted EncounterImportRow objects
                var convertedRows = new List<EncounterImportRow>();

                // Process each MST service record and convert to EncounterImportRow objects
                foreach (var service in mstServices)
                {
                    // Create a new EncounterImportRow object
                    var importRow = new EncounterImportRow
                    {
                        // Integration information
                        ImportSource = "MST Integration",

                        // District and School information
                        DistrictId = "", // Will be looked up during import
                        DistrictName = service.District,
                        DistrictCode = "",
                        SchoolId = "", // Will be looked up during import
                        SchoolName = service.Location,

                        // Provider information
                        ProviderId = "", // Will be looked up during import
                        ProviderNPI = service.ProviderNpi,
                        ProviderFirstName = service.ProviderFirstName,
                        ProviderLastName = service.ProviderLastName,

                        // Student information
                        StudentId = "", // Will be looked up during import
                        StudentCode = service.StudentId,
                        StudentFirstName = service.StudentFirstName,
                        StudentMiddleName = "", // Not provided in MST data
                        StudentLastName = service.StudentLastName,
                        StudentDateOfBirth = service.StudentDob,
                        StudentGrade = "", // Not provided in MST data
                        StudentMedicaidNo = "", // Not provided in MST data
                        StudentNotes = "",
                        StudentAddressLine1 = "", // Not provided in MST data
                        StudentAddressLine2 = "", // Not provided in MST data
                        StudentCity = "", // Not provided in MST data
                        StudentState = "", // Not provided in MST data
                        StudentZip = "", // Not provided in MST data
                        StudentEnrollmentDate = "", // Not provided in MST data
                        StudentTypeId = "", // Not provided in MST data
                        StudentTypeName = "", // Not provided in MST data

                        // Case Load information
                        ServiceCodeId = "", // Will be determined during import
                        ServiceCodeName = service.ServiceType,
                        CaseLoadDiagnosisCode = service.Icd10,
                        IEPStartDate = "", // Not provided in MST data
                        IEPEndDate = "", // Not provided in MST data

                        // Prescription/Script information
                        DoctorFirstName = service.ReferralTherapistFirstName,
                        DoctorLastName = service.ReferralTherapistLastName,
                        DoctorNPI = service.ReferralTherapistNpi,
                        PrescriptionInitiationDate = service.ReferralDate,
                        PrescriptionExpirationDate = "", // Not provided in MST data
                        CaseLoadScriptDiagnosisCode = service.Icd10,

                        // Encounter data
                        EncounterDate = service.ServiceDate,
                        EncounterStartTime = service.SessionStart,
                        EncounterEndTime = service.SessionEnd,
                        ServiceTypeId = "3", // Default to Treatment/Therapy
                        EvaluationTypeId = "", // Not provided in MST data
                        EncounterDiagnosisCode = service.Icd10,
                        IsGroup = service.GroupNumber == "1" ? "false" : "true", // Group if GroupNumber > 1
                        AdditionalStudents = service.GroupNumber == "1" ? "0" : (int.Parse(service.GroupNumber) - 1).ToString(), // Additional students = GroupNumber - 1

                        // EncounterStudent data
                        EncounterLocation = service.Location,
                        StudentStartTime = service.SessionStart,
                        StudentEndTime = service.SessionEnd,
                        EncounterStudentDate = service.ServiceDate,
                        EncounterStudentDiagnosisCode = service.Icd10,
                        CPTCode = service.Cpt1, // Use primary CPT code
                        TherapyCaseNotes = "", // Not provided in MST data
                        SupervisorComments = "", // Not provided in MST data
                        IsTelehealth = "false" // Default to in-person
                    };

                    convertedRows.Add(importRow);
                }

                // Create output CSV in memory
                using (var outputStream = new MemoryStream())
                using (var writer = new StreamWriter(outputStream))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    // Write all records with automatic header generation
                    csv.WriteRecords(convertedRows);
                    
                    writer.Flush();
                    return outputStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error converting MST files: {ex.Message}", ex);
            }
        }
    }
    

    /// <summary>
    /// Validation result specific to encounter imports
    /// </summary>
    public class EncounterImportRowValidationResult : DataImportRowValidationResult
    {
        public SchoolDistrict MatchingDistrict { get; set; }
        public School MatchingSchool { get; set; }
        public Provider MatchingProvider { get; set; }
        public ProviderTitle MatchingProviderTitle { get; set; }
        public Student MatchingStudent { get; set; }
        public ProviderStudent MatchingProviderStudentRelationship { get; set; }
        public CaseLoad MatchingCaseLoad { get; set; }
        public CaseLoadScript MatchingCaseLoadScript { get; set; }
        public Goal MatchingGoal { get; set; }
        public Encounter Encounter { get; set; }
        public EncounterStudent EncounterStudent { get; set; }
        public CptCode EncounterStudentCptCode { get; set; }
        
        // Properties for tracking newly created records
        public Address CreatedAddress { get; set; }
        public Student CreatedStudent { get; set; }
        public ProviderStudent CreatedProviderStudentRelationship { get; set; }
        public CaseLoad CreatedCaseLoad { get; set; }
        public CaseLoadScript CreatedCaseLoadScript { get; set; }
        public CaseLoadScriptGoal CreatedCaseLoadScriptGoal { get; set; }

        // Keep only the typed row reference
        public EncounterImportRow OriginalTypedRow { get; set; }
    }
}

