using FluentValidation;
using Model;
using Model.DTOs;
using Model.Partials.Comparers;
using Service.SchoolDistricts.Rosters.RosterUploads;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using Model.Enums;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using Service.Students.Merge;
using Humanizer;

namespace Service.SchoolDistricts.Rosters
{
    public class SchoolDistrictRosterService : BaseService, ISchoolDistrictRosterService
    {
        private readonly IRosterUploadService _rosterUploadService;
        private readonly IMergeStudentsService _mergeStudentService;

        public SchoolDistrictRosterService(IPrimaryContext context,
            IRosterUploadService rosterUploadService,
            IMergeStudentsService mergeStudentsService
            ) : base(context)
        {
            _rosterUploadService = rosterUploadService;
            _mergeStudentService = mergeStudentsService;
        }

        /// <summary>
        /// Creates SchoolDistictRosters while reading rows from the excel roster file
        /// </summary>
        /// <param name="document"></param>
        /// <returns></returns>
        public List<SchoolDistrictRoster> CreateRosters(SchoolDistrictRosterDocument document)
        {
            // Turn off automatic EF change detection to optimize job time
            Context.Configuration.AutoDetectChangesEnabled = false;
            var districtId = document.SchoolDistrictId;
            return _rosterUploadService.MapToRoster(districtId, document);
        }

        /// <summary>
        /// Get all students in a school district
        /// </summary>
        /// <param name="districtId"></param>
        /// <returns></returns>
        public IQueryable<Student> GetDistrictStudents(int districtId)
        {
            return Context.Students
                .Include("Address")
                .Include("School")
                .Where(s => !s.Archived && s.DistrictId == districtId).AsQueryable();
        }

        /// <summary>
        /// Takes a SchoolDistrictRoster and validates it.
        /// </summary>
        /// <param name="alteredRoster"></param>
        public void ValidateRoster(SchoolDistrictRoster alteredRoster, int districtId)
        {
            var districtStudents = Context.Students.Include(s => s.Address).Where(s => !s.Archived && s.DistrictId == districtId).ToList();

            var dataValidator = new SchoolDistrictRosterDataValidator(Context);
            var duplicateValidator = new SchoolDistrictRosterDuplicateValidator(Context, GetDuplicateCondition, districtStudents);
            var matchValidator = new SchoolDistrictRosterMatchValidator(Context, GetMatchCondition, districtStudents);

            ValidateIssues(dataValidator, alteredRoster);
            ValidateDuplicates(duplicateValidator, matchValidator, alteredRoster);

            if (alteredRoster.HasDataIssues == true)
            {
                throw new ValidationException(dataValidator.Validate(alteredRoster).Errors);
            }

            Context.ChangeTracker.DetectChanges();

        }

        /// <summary>
        /// Iterates through a list of SchoolDistrictRosters and validates
        /// there are no data issues or duplicates.
        /// </summary>
        /// <param name="uploadedRosters"></param>
        public void ValidateRosters(List<SchoolDistrictRoster> uploadedRosters, List<Student> districtStudents)
        {
            Context.SchoolDistrictRosters.AddRange(uploadedRosters);

            var dataValidator = new SchoolDistrictRosterDataValidator(Context);
            var matchValidator = new SchoolDistrictRosterMatchValidator(Context, GetMatchCondition, districtStudents);
            var duplicateValidator = new SchoolDistrictRosterDuplicateValidator(Context, GetDuplicateCondition, districtStudents);

            foreach (var roster in uploadedRosters)
            {
                ValidateIssues(dataValidator, roster);
                ValidateDuplicates(duplicateValidator, matchValidator, roster);
            }
            // Manually check context for changes only if roster has issues
            Context.ChangeTracker.DetectChanges();
        }

        /// <summary>
        /// Takes a list of rosters and returns any without issues
        /// </summary>
        /// <param name="rosterList"></param>
        /// <returns></returns>
        public List<SchoolDistrictRoster> GetValidRosters(List<SchoolDistrictRoster> rosterList)
        {
            var validRosters = new List<SchoolDistrictRoster>();

            foreach (var roster in rosterList)
            {
                if (!(bool)roster.HasDataIssues && !(bool)roster.HasDuplicates)
                    validRosters.Add(roster);
            }

            return validRosters;
        }

        /// <summary>
        /// Iterates through a list of SchoolDistrictRosters and compares them to
        /// existing Student records. Returns and students taht satisfy matching conditions
        /// </summary>
        /// <param name="validRosters"></param>
        /// <returns></returns>
        public List<SchoolDistrictRoster> MatchRostersToStudents(List<SchoolDistrictRoster> validRosters, IQueryable<Student> students)
        {
            var matchedRosters = new List<SchoolDistrictRoster>();

            foreach (var roster in validRosters)
            {
                var matchingStudent = students.Where(GetMatchCondition(roster)).FirstOrDefault();

                if (matchingStudent != null)
                    matchedRosters.Add(roster);
            }

            return matchedRosters;
        }

        /// <summary>
        /// Updates existing student when matched on LastName, FirstName,
        /// StudentCode, Birthdate
        /// </summary>
        /// <param name="schoolDistrictRoster"></param>
        /// <param name="matchingStudents"></param>
        public void SetMatchingStudentProperties(List<SchoolDistrictRoster> matchingRosters, IQueryable<Student> students)
        {
            foreach (var roster in matchingRosters)
            {
                var matchingStudent = students.Where(GetMatchCondition(roster)).FirstOrDefault();

                var addressHasChanged = setMatchingStudentAddress(roster, matchingStudent);

                if (!MatchingSchools(roster, matchingStudent) ||
                    !MatchingMiddleNames(roster, matchingStudent) ||
                    !MatchingGrades(roster, matchingStudent) ||
                    addressHasChanged
                    )
                    matchingStudent.DateModified = DateTime.UtcNow;

                matchingStudent.School = FindSchool(roster.SchoolBuilding, roster.SchoolDistrictId);
                matchingStudent.Grade = roster.Grade.Trim();
                matchingStudent.MiddleName = roster.MiddleName != null && Regex.IsMatch(roster.MiddleName, @"^[a-zA-Z]+$") && roster.MiddleName.Length > 0
                    ? roster.MiddleName : matchingStudent.MiddleName;

                if (roster.Id > 0)
                {
                    roster.StudentId = matchingStudent.Id;
                }
                else
                {
                    matchingStudent.SchoolDistrictRosters.Add(roster); // Add new roster
                }

                Context.Entry(matchingStudent).CurrentValues.SetValues(matchingStudent);
            }

        }

        /// <summary>
        /// Updates existing student's address. Creates new address if none exists
        /// </summary>
        /// <param name="schoolDistrictRoster"></param>
        /// <param name="matchingStudent"></param>
        /// <returns></returns>
        private bool setMatchingStudentAddress(SchoolDistrictRoster schoolDistrictRoster, Student matchingStudent)
        {
            var existingAddress = matchingStudent.Address;

            var addressHasChanged = false;
            if ((RosterHasAddress(schoolDistrictRoster) && existingAddress == null))
            {
                matchingStudent.Address = CreateStudentAddress(schoolDistrictRoster);
                addressHasChanged = true;
            }
            if (existingAddress != null && IsNewAddress(schoolDistrictRoster, existingAddress))
            {
                UpdateStudentAddress(schoolDistrictRoster, existingAddress);
                addressHasChanged = true;
            }

            return addressHasChanged;
        }


        /// <summary>
        /// Updates existing student address if address is available
        /// </summary>
        /// <param name="sdr"></param>
        /// <param name="address"></param>
        private void UpdateStudentAddress(SchoolDistrictRoster sdr, Address address)
        {
            address.Address1 = sdr.Address1.Trim();
            address.Address2 = sdr.Address2.Trim();
            address.City = sdr.City.Trim();
            address.StateCode = sdr.StateCode.Trim();
            address.Zip = sdr.Zip.Trim();
            Context.Entry(address).CurrentValues.SetValues(address);

        }

        /// <summary>
        /// Creates and saves new students from rosters that do
        /// not have issues after validation
        /// </summary>
        /// <param name="nonMatchedRosters"></param>
        public void CreateStudentsFromRosters(List<SchoolDistrictRoster> matchingRosters, List<SchoolDistrictRoster> rosterList)
        {
            List<SchoolDistrictRoster> nonMatchedRosters = rosterList.Except(matchingRosters).ToList();

            var newStudents = new List<Student>();

            foreach (var student in nonMatchedRosters)
            {
                var newStudent = MapRosterToStudent(student);

                var newConsent = new StudentParentalConsent()
                {
                    ParentalConsentTypeId = (int)StudentParentalConsentTypes.PendingConsent,
                    ParentalConsentDateEntered = DateTime.UtcNow,
                    ParentalConsentEffectiveDate = DateTime.UtcNow
                };
                newStudent.StudentParentalConsents.Add(newConsent);
                newStudent.SchoolDistrictRosters.Add(student);
                newStudents.Add(newStudent);
            }
            Context.Students.AddRange(newStudents);
            Context.ChangeTracker.DetectChanges();
        }

        /// <summary>
        /// Maps SchoolDistrictRosters to Students and returns
        /// new students
        /// </summary>
        /// <param name="sdr"></param>
        /// <returns></returns>
        private Student MapRosterToStudent(SchoolDistrictRoster sdr)
        {
            var newStudent = new Student();
            newStudent.Address = CreateStudentAddress(sdr);
            newStudent.FirstName = sdr.FirstName.Trim();
            newStudent.MiddleName = sdr.MiddleName?.Trim();
            newStudent.LastName = sdr.LastName.Trim();
            newStudent.StudentCode = sdr.StudentCode.Trim();
            newStudent.DateOfBirth = DateTime.Parse(sdr.DateOfBirth, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeLocal);
            newStudent.Grade = sdr.Grade.Trim();
            newStudent.School = FindSchool(sdr.SchoolBuilding, sdr.SchoolDistrictId);
            newStudent.DistrictId = sdr.SchoolDistrictId;
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
        /// Create and returns address based on the provided roster
        /// </summary>
        /// <param name="sdr"></param>
        /// <returns></returns>
        private Address CreateStudentAddress(SchoolDistrictRoster sdr)
        {
            Address address = new Address();
            address.Address1 = sdr.Address1.Trim();
            address.Address2 = sdr.Address2?.Trim();
            address.City = sdr.City.Trim();
            address.CountryCode = "US";
            address.StateCode = sdr.StateCode.Trim();
            address.Zip = sdr.Zip.Trim();
            Context.Addresses.Add(address);
            return address;
        }

        /// <summary>
        /// Takes a userId and returns all rosters if they are within the
        /// user's district, have no associated Student, and NOT archived.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IEnumerable<SchoolDistrictRoster> GetRostersBySchoolDistrictId(int userId)
        {

            return Context.SchoolDistrictRosters
                .Where(
                    r => r.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) &&
                    r.StudentId == null &&
                   !r.Archived &&
                    (r.HasDataIssues == true || r.HasDuplicates == true)
                )
                .OrderByDescending(r => r.SchoolDistrictRosterDocumentId)
                .ToList();
        }

        /// <summary>
        /// Takes a rosterId and userId and returns the roster if
        ///  it is within the user's district and NOT archived.
        /// </summary>
        /// <param name="rosterId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public SchoolDistrictRoster GetRosterById(int rosterId, int userId)
        {

            return Context.SchoolDistrictRosters
                .Where(
                    r => r.SchoolDistrict.Users_SchoolDistrictId.Any(u => u.Id == userId) &&
                        !r.Archived &&
                        r.StudentId == null &&
                        r.Id == rosterId &&
                        ((bool)r.HasDataIssues || (bool)r.HasDuplicates)
                )
                .OrderByDescending(r => r.SchoolDistrictRosterDocumentId)
                .FirstOrDefault();
        }

        /// <summary>
        /// Gets a list of duplicate students by testing against the duplicate conditions
        /// defined in GetDuplicateConditions
        /// </summary>
        /// <param name="rosterId"></param>
        /// <returns></returns>
        public List<Student> GetDuplicates(int rosterId, int userId)
        {
            var sdAdmin = Context.Users.FirstOrDefault(u => u.Id == userId);
            ThrowIfNull(sdAdmin.SchoolDistrictId);
            var sdr = Context.SchoolDistrictRosters.FirstOrDefault(sdr => sdr.Id == rosterId);
            var duplicateStudents = Context.Students
                .Include(s => s.Address)
                .Include(s => s.School)
                .Include(s => s.StudentParentalConsents)
                .Include(s => s.StudentParentalConsents.Select(spc => spc.StudentParentalConsentType))
                .Where(s => !s.Archived && s.DistrictId == sdAdmin.SchoolDistrictId)
                .Where(GetDuplicateCondition(sdr));

            if (!duplicateStudents.Any())
            {
                sdr.HasDuplicates = false;
                Context.SaveChanges();
            }

            return duplicateStudents.ToList();
        }

        /// <summary>
        /// Takes a roster then updates the record and saves changes to the context.
        /// </summary>
        /// <param name="schoolDistrictRoster"></param>
        /// <returns></returns>
        public SchoolDistrictRoster UpdateRoster(SchoolDistrictRoster schoolDistrictRoster)
        {
            var toUpdate = Context.SchoolDistrictRosters.FirstOrDefault(sdr => sdr.Id == schoolDistrictRoster.Id);

            Context.Entry(toUpdate).CurrentValues.SetValues(schoolDistrictRoster);

            Context.SaveChanges();

            return toUpdate;
        }

        /// <summary>
        /// Takes a MergeDTO and assigns the property values to the associated duplicate student record.
        /// </summary>
        /// <param name="mergeDTO"></param>
        public void MergeRoster(MergeDTO mergeDTO)
        {
            // If they are 2 or more students to be merged
            // Merge those students into newly created student from roster info
            if (mergeDTO.StudentIds.Count > 1)
            {
                // Create new student
                var newStudent = MapRosterToStudent(mergeDTO.Roster);
                var consent = new StudentParentalConsent()
                {
                    ParentalConsentDateEntered = DateTime.UtcNow,
                    ParentalConsentTypeId = (int)StudentParentalConsentTypes.PendingConsent
                };
                newStudent.StudentParentalConsents.Add(consent);

                Context.Students.Add(newStudent);
                Context.SaveChanges();

                // Update roster in context to point to new studentId and have updated values
                mergeDTO.Roster.StudentId = newStudent.Id;
                mergeDTO.Roster.HasDuplicates = false;
                UpdateRoster(mergeDTO.Roster);

                mergeDTO.MergingIntoStudentId = newStudent.Id;
                var mostRecentConsent = Context.StudentParentalConsents
                	.Where(spc => mergeDTO.StudentIds.Contains(spc.StudentId))
                    .OrderByDescending(c => c.ParentalConsentEffectiveDate)
                    .FirstOrDefault();
                mergeDTO.ParentalConsentTypeID = mostRecentConsent != null ? mostRecentConsent.ParentalConsentTypeId : (int)StudentParentalConsentTypes.PendingConsent;
                mergeDTO.ParentalConsentEffectiveDate = mostRecentConsent != null ? mostRecentConsent.ParentalConsentEffectiveDate : DateTime.UtcNow; 
                try
                {
                    _mergeStudentService.MergeStudent(mergeDTO);
                }
                catch (Exception ex)
                {
                    // Reverse creation of new roster student and merge 
                    var entities = Context.ChangeTracker.Entries().ToList();
                    foreach (var entity in entities)
                    {
                        if (entity != null)
                        {
                            entity.State = EntityState.Detached;
                        }
                    }
                    mergeDTO.Roster.StudentId = null;
                    mergeDTO.Roster.HasDuplicates = true;
                    UpdateRoster(mergeDTO.Roster);

                    if (newStudent != null && newStudent.Id > 0)
                    {
                        var consentsToRemove = Context.StudentParentalConsents.Where(spc => spc.StudentId == newStudent.Id);
                        Context.StudentParentalConsents.RemoveRange(consentsToRemove);
                        var studentToRemove = Context.Students.FirstOrDefault(s => s.Id == newStudent.Id);
                        Context.Students.Remove(studentToRemove);
                    }
                    Context.SaveChanges();

                    throw new ValidationException($"Encountered error when merging student: {ex.Message}.");
                }
            }
            // If there are no students to merge into
            // Create new student out of roster info
            else if (!mergeDTO.StudentIds.Any())
            {
                var newStudent = MapRosterToStudent(mergeDTO.Roster);
                var newConsent = new StudentParentalConsent()
                {
                    ParentalConsentTypeId = (int)StudentParentalConsentTypes.PendingConsent,
                    ParentalConsentDateEntered = DateTime.UtcNow,
                    ParentalConsentEffectiveDate = DateTime.UtcNow
                };
                newStudent.StudentParentalConsents.Add(newConsent);

                Context.Students.Add(newStudent);
                Context.SaveChanges();
            }
            // If there is only 1 student to merge
            // Apply roster info onto existing student
            else
            {
                var roster = mergeDTO.Roster;
                var studentToUpdate = Context.Students.FirstOrDefault(s => s.Id == mergeDTO.StudentIds.FirstOrDefault());

                studentToUpdate.FirstName = roster.FirstName.Trim();
                studentToUpdate.LastName = roster.LastName.Trim();
                studentToUpdate.MiddleName = roster.MiddleName != null
                    && Regex.IsMatch(roster.MiddleName.Trim(), @"^[a-zA-Z]+$")
                    ? roster.MiddleName.Trim() : studentToUpdate.MiddleName;
                studentToUpdate.Grade = roster.Grade.Trim();
                studentToUpdate.StudentCode = roster.StudentCode.Trim();
                studentToUpdate.DateOfBirth = DateTime.Parse(roster.DateOfBirth, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeLocal);
                studentToUpdate.SchoolId = FindSchool(roster.SchoolBuilding, roster.SchoolDistrictId).Id;

                if (studentToUpdate.AddressId != null)
                {
                    var addressToUpdate = Context.Addresses.FirstOrDefault(a => a.Id == studentToUpdate.AddressId);
                    addressToUpdate.Address1 = roster.Address1.Trim();
                    addressToUpdate.Address2 = roster.Address2?.Trim();
                    addressToUpdate.City = roster.City.Trim();
                    addressToUpdate.CountryCode = "US";
                    addressToUpdate.StateCode = roster.StateCode.Trim();
                    addressToUpdate.Zip = roster.Zip.Trim();
                }
                else
                {
                    studentToUpdate.Address = CreateStudentAddress(roster);
                }

                Context.SaveChanges();

                roster.HasDuplicates = false;
                roster.StudentId = studentToUpdate.Id;
                UpdateRoster(roster);
            }
        }


        private List<MergedStudent> MapStudentsToMergedStudent(List<Student> students, int newStudentId)
        {
            var mergedStudents = new List<MergedStudent>();
            foreach (var student in students)
            {
                mergedStudents.Add(new MergedStudent
                {
                    FirstName = student.FirstName,
                    MiddleName = student.MiddleName,
                    LastName = student.LastName,
                    StudentCode = student.StudentCode,
                    Grade = student.Grade,
                    DateOfBirth = student.DateOfBirth,
                    AddressId = student.AddressId,
                    SchoolId = student.SchoolId,
                    MergedToStudentId = newStudentId,
                });
            }
            return mergedStudents;
        }

        /// <summary>
        /// Takes a roster and archives it.
        /// </summary>
        /// <param name="roster"></param>
        public void ArchiveRoster(int id, int modifiedBy)
        {

            var toUpdate = Context.SchoolDistrictRosters.FirstOrDefault(sdr => sdr.Id == id);

            toUpdate.Archived = !toUpdate.Archived;
            toUpdate.ModifiedById = modifiedBy;
            toUpdate.DateModified = DateTime.UtcNow;
            Context.SaveChanges();

        }

        /// <summary>
        /// Reverse a roster upload by school district id
        /// </summary>
        /// <param name="schoolDistrictId"></param>
        public void ReverseRosterUpload(int id, int modifiedBy)
        {

            var toUpdate = Context.SchoolDistrictRosters.Where(sdr => sdr.SchoolDistrictId == id
                && ((bool)sdr.HasDataIssues || (bool)sdr.HasDuplicates) && !sdr.Archived);

            foreach (var roster in toUpdate)
            {
                roster.Archived = true;
                roster.ModifiedById = modifiedBy;
                roster.DateModified = DateTime.UtcNow;
            }

            Context.SaveChanges();

        }

        /// <summary>
        /// Returns a function that to pass as where clause for finding duplicates
        /// in students table when provessing a SchoolDistrictRoster
        /// </summary>
        /// <param name="sdr"></param>
        /// <returns></returns>
        private Expression<Func<Student, bool>> GetDuplicateCondition(SchoolDistrictRoster sdr)
        {
            DateTime date;
            var d = DateTime.TryParse(sdr.DateOfBirth, out date);
            return
                (s) =>
                 (s.LastName.ToLower().Trim() == sdr.LastName.ToLower().Trim() &&
                 s.StudentCode != null && s.StudentCode.Trim() == sdr.StudentCode.Trim())
                 ||
                 (s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim() &&
                 s.StudentCode != null && s.StudentCode.Trim() == sdr.StudentCode.Trim())
                 ||
                 (s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim() &&
                 s.DateOfBirth.Day == date.Date.Day && s.DateOfBirth.Month == date.Date.Month && s.DateOfBirth.Year == date.Date.Year)
                 ||
                 (s.LastName.ToLower().Trim() == sdr.LastName.ToLower().Trim() &&
                 s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim());
        }

        /// <summary>
        /// Returns a function to pass in where clause that determines
        /// whether a roster is a complete match to a student and
        /// needs to be updated.
        /// </summary>
        /// <param name="sdr"></param>
        /// <returns></returns>
        private Expression<Func<Student, bool>> GetMatchCondition(SchoolDistrictRoster sdr)
        {
            DateTime date;
            var d = DateTime.TryParse(sdr.DateOfBirth, out date);
            return
                (s) =>
                s.FirstName.ToLower().Trim() == sdr.FirstName.ToLower().Trim() &&
                s.DateOfBirth.Day == date.Date.Day && s.DateOfBirth.Month == date.Date.Month && s.DateOfBirth.Year == date.Date.Year &&
                (s.LastName.ToLower().Trim() == sdr.LastName.ToLower().Trim()
                ||
                (s.StudentCode != null && s.StudentCode.Trim() == sdr.StudentCode.Trim() &&
                s.Address != null && s.Address.Address1.ToLower().Trim() == sdr.Address1.ToLower().Trim() &&
                s.Address.Address2.ToLower().Trim() == sdr.Address2.ToLower().Trim() &&
                s.Address.City.ToLower().Trim() == sdr.City.ToLower().Trim() && s.Address.Zip.Trim() == sdr.Zip.Trim())
                );
        }

        private static void ValidateDuplicates(SchoolDistrictRosterDuplicateValidator duplicateValidator, SchoolDistrictRosterMatchValidator matchValidator, SchoolDistrictRoster roster)
        {
            roster.HasDuplicates = duplicateValidator.Validate(roster).Errors.Any() && !matchValidator.Validate(roster).Errors.Any();
        }

        private static void ValidateIssues(SchoolDistrictRosterDataValidator dataValidator, SchoolDistrictRoster roster)
        {
            roster.HasDataIssues = dataValidator.Validate(roster).Errors.Any();
        }

        private bool MatchingSchools(SchoolDistrictRoster schoolDistrictRoster, Student matchingStudent)
        {
            return matchingStudent.School.Name == schoolDistrictRoster.SchoolBuilding;
        }

        private bool MatchingGrades(SchoolDistrictRoster schoolDistrictRoster, Student matchingStudent)
        {
            return matchingStudent.Grade == schoolDistrictRoster.Grade.Trim();
        }

        private bool MatchingMiddleNames(SchoolDistrictRoster schoolDistrictRoster, Student matchingStudent)
        {
            return matchingStudent.MiddleName?.Trim().ToLower() == schoolDistrictRoster.MiddleName?.Trim().ToLower();
        }

        private bool RosterHasAddress(SchoolDistrictRoster sdr)
        {
            return !string.IsNullOrWhiteSpace(sdr.Address1) && !string.IsNullOrWhiteSpace(sdr.City) &&
                !string.IsNullOrWhiteSpace(sdr.StateCode) && !string.IsNullOrWhiteSpace(sdr.Zip);
        }

        private bool IsNewAddress(SchoolDistrictRoster sdr, Address address)
        {
            return !(address.Address1 == sdr.Address1 && address.Address2 == sdr.Address2 &&
                address.City == sdr.City && address.StateCode == sdr.StateCode &&
                address.Zip == sdr.Zip);
        }

        public UniqueAndDuplicateRosters FilterDuplicateRosters(List<SchoolDistrictRoster> rosterList)
        {
            var unique = new List<SchoolDistrictRoster> { rosterList.First() };
            var duplicates = new List<SchoolDistrictRoster>();
            var comparer = new SchoolDistrictRosterComparer();
            for (var i = 1; i < rosterList.Count; i++)
            {
                if (!unique.Contains(rosterList[i], comparer))
                {
                    unique.Add(rosterList[i]);
                }
                else
                {
                    duplicates.Add(rosterList[i]);
                }
            }
            return new UniqueAndDuplicateRosters { UniqueRosters = unique, DuplicateRosters = duplicates };
        }

        public void RemoveAllIssues(int userId)
        {
            var rosters = Context.SchoolDistrictRosters.Where(sdr => sdr.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) &&
                !sdr.Archived && ((bool)sdr.HasDataIssues || (bool)sdr.HasDuplicates));

            foreach (var roster in rosters)
            {
                roster.Archived = true;
                roster.ModifiedById = userId;
                roster.DateModified = DateTime.UtcNow;
            }
            Context.SaveChanges();

        }

        public int GetNextRosterIssueId(NextRosterIssueCallDto dto, int userId)
        {
            IQueryable<SchoolDistrictRoster> rosters = Context.SchoolDistrictRosters.Where(sdr => sdr.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) &&
                !sdr.Archived && ((bool)sdr.HasDataIssues || (bool)sdr.HasDuplicates));
            bool isDesc = dto.OrderDirection == "desc";

            switch (dto.Order)
            {
                case "LastName":
                    rosters = isDesc ? rosters.OrderByDescending(r => r.LastName).ThenBy(r => r.Id) : rosters.OrderBy(r => r.LastName).ThenBy(r => r.Id);
                    break;
                case "FirstName":
                    rosters = isDesc ? rosters.OrderByDescending(r => r.FirstName).ThenBy(r => r.Id) : rosters.OrderBy(r => r.FirstName).ThenBy(r => r.Id);
                    break;
                case "StudentCode":
                    rosters = isDesc ? rosters.OrderByDescending(r => r.StudentCode).ThenBy(r => r.Id) : rosters.OrderBy(r => r.StudentCode).ThenBy(r => r.Id);
                    break;
                case "SchoolBuilding":
                    rosters = isDesc ? rosters.OrderByDescending(r => r.SchoolBuilding).ThenBy(r => r.Id) : rosters.OrderBy(r => r.SchoolBuilding).ThenBy(r => r.Id);
                    break;
                default:
                    rosters = isDesc ? rosters.OrderByDescending(r => r.LastName).ThenBy(r => r.Id) : rosters.OrderBy(r => r.LastName).ThenBy(r => r.Id);
                    break;
            }

            return rosters.Select(s => s.Id).AsEnumerable().SkipWhile(i => i != dto.RosterIssueId).Skip(1).FirstOrDefault(0);
        }
    }
}

