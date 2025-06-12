using System;
using System.Data.Entity;
using System.Data.Entity.Validation;
using BreckServiceBase.Utilities.Interfaces;
using Microsoft.Extensions.Configuration;
using Model;
using Moq;
using Service.Encounters;
using Xunit;
using System.Linq;
using System.Text;
using System.Collections.Generic;

namespace Service.DataImport
{
    public abstract class EncounterImportServiceTestBase : IDisposable
    {
        protected readonly IPrimaryContext Context;
        protected readonly Mock<IEncounterStudentService> EncounterStudentServiceMock;
        protected readonly Mock<IEncounterStudentStatusService> EncounterStudentStatusServiceMock;
        protected readonly EncounterImportService Service;
        protected readonly DbContextTransaction Transaction;

        // Test data properties
        protected SchoolDistrict TestDistrict { get; private set; }
        protected School TestSchool { get; private set; }
        protected Provider TestProvider { get; private set; }
        protected Provider TestArchivedProvider { get; private set; }
        protected Provider TestNonNursingProvider { get; private set; }
        protected Student TestStudent { get; private set; }
        protected Student TestArchivedStudent { get; private set; }
        protected Student TestArchivedSchoolStudent { get; private set; }
        protected CaseLoad TestCaseLoad { get; private set; }
        protected CptCode TestCptCode { get; private set; }

        public EncounterImportServiceTestBase()
        {
            // Create configuration for database connection
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            // Initialize the database context with the configuration
            Context = new PrimaryContext(configuration);

            // Initialize mock services
            EncounterStudentServiceMock = new Mock<IEncounterStudentService>();
            EncounterStudentStatusServiceMock = new Mock<IEncounterStudentStatusService>();

            // Set up mock behavior
            EncounterStudentServiceMock
                .Setup(x => x.GenerateEncounterNumber(
                    It.IsAny<int>(), 
                    It.IsAny<EncounterStudent>(), 
                    It.IsAny<int>()))
                .Returns((int serviceTypeId, EncounterStudent encounterStudent, int districtId) => encounterStudent);

            EncounterStudentStatusServiceMock
                .Setup(x => x.CheckEncounterStudentStatus(
                    It.IsAny<int>(), 
                    It.IsAny<int>()))
                .Verifiable();

            // Initialize the service under test
            Service = new EncounterImportService(Context, EncounterStudentServiceMock.Object, EncounterStudentStatusServiceMock.Object);

            // Begin transaction for test isolation
            Transaction = Context.Database.BeginTransaction();

            // Set up test data
            SetupTestData();
        }

        protected virtual void SetupTestData()
        {
            // Create ProviderTitles first since they're referenced by CPT code associations
            var providerTitles = new[]
            {
                new ProviderTitle
                {
                    Name = "Test Provider Title",
                    ServiceCodeId = 5, // Nursing Service
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new ProviderTitle
                {
                    Name = "Archived Provider Title",
                    ServiceCodeId = 5, // Nursing Service
                    Archived = true,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new ProviderTitle
                {
                    Name = "Non-nursing provider title",
                    ServiceCodeId = 3,
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow   
                }
            };
            Context.ProviderTitles.AddRange(providerTitles);
            Context.SaveChanges();

            // Create CPT codes
            var cptCode = new CptCode
            {
                Code = "NU",
                Description = "Nursing Service",
                Archived = false,
                CreatedById = 1,
                DateCreated = DateTime.UtcNow
            };
            Context.CptCodes.Add(cptCode);
            Context.SaveChanges();

            TestCptCode = cptCode;

            // Create CPT code associations
            var cptCodeAssociations = new[]
            {
                new CptCodeAssocation
                {
                    CptCodeId = cptCode.Id,
                    ProviderTitleId = providerTitles[0].Id,
                    ServiceCodeId = 5,      // Nursing Service
                    ServiceTypeId = 3,      // Treatment/Therapy
                    IsGroup = false,
                    Default = false,
                    IsTelehealth = false,
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new CptCodeAssocation
                {
                    CptCodeId = cptCode.Id,
                    ProviderTitleId = providerTitles[2].Id,
                    ServiceCodeId = 3,      // Other Service
                    ServiceTypeId = 3,      // Treatment/Therapy
                    IsGroup = false,
                    Default = false,
                    IsTelehealth = false,
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                }
            };
            Context.CptCodeAssocations.AddRange(cptCodeAssociations);
            Context.SaveChanges();

            // Create diagnosis codes
            var diagnosisCode = new DiagnosisCode
            {
                Code = "Z71.89",
                Description = "Other specified counseling",
                Archived = false,
                CreatedById = 1,
                DateCreated = DateTime.UtcNow
            };
            Context.DiagnosisCodes.Add(diagnosisCode);
            Context.SaveChanges();

            // Create diagnosis code associations
            var diagnosisCodeAssociations = new[]
            {
                new DiagnosisCodeAssociation
                {
                    DiagnosisCodeId = diagnosisCode.Id,
                    ServiceCodeId = 5,      // Nursing Service
                    ServiceTypeId = 3,      // Treatment/Therapy
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new DiagnosisCodeAssociation
                {
                    DiagnosisCodeId = diagnosisCode.Id,
                    ServiceCodeId = 3,      // Other Service
                    ServiceTypeId = 3,      // Treatment/Therapy
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                }
            };
            Context.DiagnosisCodeAssociations.AddRange(diagnosisCodeAssociations);
            Context.SaveChanges();

            // Create encounter locations
            var location = new EncounterLocation
            {
                Name = "School"
            };
            Context.EncounterLocations.Add(location);
            Context.SaveChanges();

            // Create goals
            var goal = new Goal
            {
                Description = "SNAP Integration",
                Archived = false,
                CreatedById = 1,
                DateCreated = DateTime.UtcNow
            };
            Context.Goals.Add(goal);
            Context.SaveChanges();

            // Create districts
            var districts = new[]
            {
                new SchoolDistrict
                {
                    Name = "Test District",
                    Code = "TD001",
                    EinNumber = "123456789",  // 9 digits required
                    IrnNumber = "123456",     // 6 digits required
                    NpiNumber = "1234567890", // 10 digits required
                    ProviderNumber = "1234567", // 7 digits required
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    ActiveStatus = true,
                    ProgressReports = false,
                    RequireNotesForAllEncountersSent = false,
                    UseDisabilityCodes = false,
                    CaseNotesRequired = false,
                    IepDatesRequired = false
                },
                new SchoolDistrict
                {
                    Name = "Duplicate District",
                    Code = "DD001",
                    EinNumber = "987654321",  // 9 digits required
                    IrnNumber = "654321",     // 6 digits required
                    NpiNumber = "0987654321", // 10 digits required
                    ProviderNumber = "7654321", // 7 digits required
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    ActiveStatus = true,
                    ProgressReports = false,
                    RequireNotesForAllEncountersSent = false,
                    UseDisabilityCodes = false,
                    CaseNotesRequired = false,
                    IepDatesRequired = false
                },
                new SchoolDistrict
                {
                    Name = "Duplicate District",
                    Code = "DD002",
                    EinNumber = "111222333",  // 9 digits required
                    IrnNumber = "111222",     // 6 digits required
                    NpiNumber = "1112223333", // 10 digits required
                    ProviderNumber = "1112222", // 7 digits required
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    ActiveStatus = true,
                    ProgressReports = false,
                    RequireNotesForAllEncountersSent = false,
                    UseDisabilityCodes = false,
                    CaseNotesRequired = false,
                    IepDatesRequired = false
                },
                new SchoolDistrict
                {
                    Name = "Archived District",
                    Code = "AD001",
                    EinNumber = "333444555",  // 9 digits required
                    IrnNumber = "333444",     // 6 digits required
                    NpiNumber = "3334445555", // 10 digits required
                    ProviderNumber = "3334444", // 7 digits required
                    Archived = true,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    ActiveStatus = false,
                    ProgressReports = false,
                    RequireNotesForAllEncountersSent = false,
                    UseDisabilityCodes = false,
                    CaseNotesRequired = false,
                    IepDatesRequired = false
                }
            };

            Context.SchoolDistricts.AddRange(districts);
            Context.SaveChanges();

            var district = districts[0]; // Keep reference to the first district for later use

            // Create all schools
            var allSchools = new[]
            {
                new School
                {
                    Name = "Test School",
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new School
                {
                    Name = "Archived School",
                    Archived = true,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new School
                {
                    Name = "Duplicate Name School", // Same name as first school
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new School
                {
                    Name = "Duplicate Name School", // Same name as first school
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                }
            };
            Context.Schools.AddRange(allSchools);
            Context.SaveChanges();

            var school = allSchools[0]; // Keep reference to the first school for later use

            // Create all school-district relationships
            var allSchoolDistrictSchools = new[]
            {
                new SchoolDistrictsSchool
                {
                    SchoolDistrictId = district.Id,
                    SchoolId = allSchools[0].Id, // Test School
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new SchoolDistrictsSchool
                {
                    SchoolDistrictId = district.Id,
                    SchoolId = allSchools[1].Id, // Archived School
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new SchoolDistrictsSchool
                {
                    SchoolDistrictId = district.Id,
                    SchoolId = allSchools[2].Id, // Second Test School
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                },
                new SchoolDistrictsSchool
                {
                    SchoolDistrictId = district.Id,
                    SchoolId = allSchools[3].Id, // Third Test School
                    Archived = false,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow
                }
            };
            Context.SchoolDistrictsSchools.AddRange(allSchoolDistrictSchools);
            Context.SaveChanges();

            // Create user role for provider
            var userRole = new UserRole
            {
                Name = "Provider Role",
                Description = "Provider Role",
                UserTypeId = 2, // Provider type
                Archived = false,
                CreatedById = 1,
                DateCreated = DateTime.UtcNow
            };
            Context.UserRoles.Add(userRole);
            Context.SaveChanges();

            // Create all auth users in one batch
            var allAuthUsers = new[]
            {
                new AuthUser
                {
                    Username = "provider@example.com",
                    Password = new byte[] { 0 },
                    Salt = new byte[] { 0 },
                    ResetKey = new byte[] { 0 },
                    ResetKeyExpirationUtc = DateTime.UtcNow,
                    RoleId = userRole.Id,
                    HasAccess = true,
                    IsEditable = true,
                    HasLoggedIn = false
                },
                new AuthUser
                {
                    Username = "archived.title@example.com",
                    Password = new byte[] { 0 },
                    Salt = new byte[] { 0 },
                    ResetKey = new byte[] { 0 },
                    ResetKeyExpirationUtc = DateTime.UtcNow,
                    RoleId = userRole.Id,
                    HasAccess = true,
                    IsEditable = true,
                    HasLoggedIn = false
                },
                new AuthUser
                {
                    Username = "duplicate.npi1@example.com",
                    Password = new byte[] { 0 },
                    Salt = new byte[] { 0 },
                    ResetKey = new byte[] { 0 },
                    ResetKeyExpirationUtc = DateTime.UtcNow,
                    RoleId = userRole.Id,
                    HasAccess = true,
                    IsEditable = true,
                    HasLoggedIn = false
                },
                new AuthUser
                {
                    Username = "duplicate.npi2@example.com",
                    Password = new byte[] { 0 },
                    Salt = new byte[] { 0 },
                    ResetKey = new byte[] { 0 },
                    ResetKeyExpirationUtc = DateTime.UtcNow,
                    RoleId = userRole.Id,
                    HasAccess = true,
                    IsEditable = true,
                    HasLoggedIn = false
                },
                new AuthUser
                {
                    Username = "john.smith1@example.com",
                    Password = new byte[] { 0 },
                    Salt = new byte[] { 0 },
                    ResetKey = new byte[] { 0 },
                    ResetKeyExpirationUtc = DateTime.UtcNow,
                    RoleId = userRole.Id,
                    HasAccess = true,
                    IsEditable = true,
                    HasLoggedIn = false
                },
                new AuthUser
                {
                    Username = "john.smith2@example.com",
                    Password = new byte[] { 0 },
                    Salt = new byte[] { 0 },
                    ResetKey = new byte[] { 0 },
                    ResetKeyExpirationUtc = DateTime.UtcNow,
                    RoleId = userRole.Id,
                    HasAccess = true,
                    IsEditable = true,
                    HasLoggedIn = false
                },
                new AuthUser
                {
                    Username = "non-nursing.provider@example.com",
                    Password = new byte[] { 0 },
                    Salt = new byte[] { 0 },
                    ResetKey = new byte[] { 0 },
                    ResetKeyExpirationUtc = DateTime.UtcNow,
                    RoleId = userRole.Id,
                    HasAccess = true,
                    IsEditable = true,
                    HasLoggedIn = false
                }
            };
            Context.AuthUsers.AddRange(allAuthUsers);
            Context.SaveChanges();

            // Create all users in one batch
            var allUsers = new[]
            {
                new User
                {
                    FirstName = "Provider",
                    LastName = "Test",
                    Email = "provider@example.com",
                    AuthUserId = allAuthUsers[0].Id,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new User
                {
                    FirstName = "Archived",
                    LastName = "Title",
                    Email = "archived.title@example.com",
                    AuthUserId = allAuthUsers[1].Id,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new User
                {
                    FirstName = "Duplicate",
                    LastName = "NPI1",
                    Email = "duplicate.npi1@example.com",
                    AuthUserId = allAuthUsers[2].Id,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new User
                {
                    FirstName = "Duplicate",
                    LastName = "NPI2",
                    Email = "duplicate.npi2@example.com",
                    AuthUserId = allAuthUsers[3].Id,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new User
                {
                    FirstName = "John",
                    LastName = "Smith",
                    Email = "john.smith1@example.com",
                    AuthUserId = allAuthUsers[4].Id,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new User
                {
                    FirstName = "John",
                    LastName = "Smith",
                    Email = "john.smith2@example.com",
                    AuthUserId = allAuthUsers[5].Id,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new User
                {
                    FirstName = "Non-nursing",
                    LastName = "Provider",
                    Email = "non-nursing.provider@example.com",
                    AuthUserId = allAuthUsers[6].Id,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                }
            };
            Context.Users.AddRange(allUsers);
            Context.SaveChanges();

            // Create all providers in one batch
            var allProviders = new[]
            {
                new Provider
                {
                    ProviderUserId = allUsers[0].Id,
                    TitleId = providerTitles[0].Id,
                    Npi = "1234567890",
                    Phone = "(555)-555-5555",
                    ProviderEmploymentTypeId = 1,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Provider
                {
                    ProviderUserId = allUsers[1].Id,
                    TitleId = providerTitles[1].Id,
                    Npi = "0987654321",
                    Phone = "(555)-555-5556",
                    ProviderEmploymentTypeId = 1,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Provider
                {
                    ProviderUserId = allUsers[2].Id,
                    TitleId = providerTitles[0].Id,
                    Npi = "1112223333",
                    Phone = "(555)-555-5557",
                    ProviderEmploymentTypeId = 1,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Provider
                {
                    ProviderUserId = allUsers[3].Id,
                    TitleId = providerTitles[0].Id,
                    Npi = "1112223333",
                    Phone = "(555)-555-5558",
                    ProviderEmploymentTypeId = 1,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Provider
                {
                    ProviderUserId = allUsers[4].Id,
                    TitleId = providerTitles[0].Id,
                    Npi = "2223334444",
                    Phone = "(555)-555-5559",
                    ProviderEmploymentTypeId = 1,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Provider
                {
                    ProviderUserId = allUsers[5].Id,
                    TitleId = providerTitles[0].Id,
                    Npi = "3334445555",
                    Phone = "(555)-555-5560",
                    ProviderEmploymentTypeId = 1,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Provider
                {
                    ProviderUserId = allUsers[6].Id,
                    TitleId = providerTitles[2].Id,
                    Npi = "4445556666",
                    Phone = "(555)-555-5561",
                    ProviderEmploymentTypeId = 1,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                }
            };
            Context.Providers.AddRange(allProviders);
            Context.SaveChanges();

            var provider = allProviders[0];
            var archivedProvider = allProviders[1];
            var nonNursingProvider = allProviders[6];

            // Create test address
            var address = new Address
            {
                Address1 = "123 Test St",
                Address2 = "Apt 4B",
                City = "Test City",
                StateCode = "TX",
                Zip = "12345",
                CountryCode = "US",
                Province = "",
                County = "Test County"
            };
            Context.Addresses.Add(address);
            Context.SaveChanges();

            // Create all students
            var allStudents = new[]
            {
                new Student
                {
                    FirstName = "John",
                    MiddleName = "M",
                    LastName = "Doe",
                    StudentCode = "STU001",
                    MedicaidNo = "MED001234567",
                    Grade = "10",
                    DateOfBirth = new DateTime(2008, 1, 1),
                    Notes = "Test student",
                    AddressId = address.Id,
                    SchoolId = allSchools[0].Id,
                    DistrictId = district.Id,
                    EnrollmentDate = DateTime.UtcNow.Date,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Student
                {
                    FirstName = "Archived",
                    MiddleName = "A",
                    LastName = "Student",
                    StudentCode = "STU002",
                    MedicaidNo = "MED002345678",
                    Grade = "11",
                    DateOfBirth = new DateTime(2007, 1, 1),
                    Notes = "Archived student",
                    AddressId = address.Id,
                    SchoolId = allSchools[0].Id,
                    DistrictId = district.Id,
                    EnrollmentDate = DateTime.UtcNow.Date,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = true
                },
                new Student
                {
                    FirstName = "Archived",
                    MiddleName = "S",
                    LastName = "School",
                    StudentCode = "STU003",
                    MedicaidNo = "MED003456789",
                    Grade = "12",
                    DateOfBirth = new DateTime(2006, 1, 1),
                    Notes = "Student in archived school",
                    AddressId = address.Id,
                    SchoolId = allSchools[1].Id, // Archived School
                    DistrictId = district.Id,
                    EnrollmentDate = DateTime.UtcNow.Date,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Student
                {
                    FirstName = "Duplicate",
                    MiddleName = "C",
                    LastName = "Code1",
                    StudentCode = "STU004", // Same code as next student
                    MedicaidNo = "MED004567890",
                    Grade = "9",
                    DateOfBirth = new DateTime(2009, 1, 1),
                    Notes = "First student with duplicate code",
                    AddressId = address.Id,
                    SchoolId = allSchools[0].Id,
                    DistrictId = district.Id,
                    EnrollmentDate = DateTime.UtcNow.Date,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Student
                {
                    FirstName = "Duplicate",
                    MiddleName = "C",
                    LastName = "Code2",
                    StudentCode = "STU004", // Same code as previous student
                    MedicaidNo = "MED005678901",
                    Grade = "9",
                    DateOfBirth = new DateTime(2009, 1, 1),
                    Notes = "Second student with duplicate code",
                    AddressId = address.Id,
                    SchoolId = allSchools[0].Id,
                    DistrictId = district.Id,
                    EnrollmentDate = DateTime.UtcNow.Date,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Student
                {
                    FirstName = "John", // Same name as next student
                    MiddleName = "D",
                    LastName = "Smith",
                    StudentCode = "STU005",
                    MedicaidNo = "MED006789012",
                    Grade = "10",
                    DateOfBirth = new DateTime(2008, 1, 1),
                    Notes = "First student with duplicate name",
                    AddressId = address.Id,
                    SchoolId = allSchools[0].Id,
                    DistrictId = district.Id,
                    EnrollmentDate = DateTime.UtcNow.Date,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                },
                new Student
                {
                    FirstName = "John", // Same name as previous student
                    MiddleName = "D",
                    LastName = "Smith",
                    StudentCode = "STU006",
                    MedicaidNo = "MED007890123",
                    Grade = "10",
                    DateOfBirth = new DateTime(2008, 1, 1),
                    Notes = "Second student with duplicate name",
                    AddressId = address.Id,
                    SchoolId = allSchools[0].Id,
                    DistrictId = district.Id,
                    EnrollmentDate = DateTime.UtcNow.Date,
                    CreatedById = 1,
                    DateCreated = DateTime.UtcNow,
                    Archived = false
                }
            };
            Context.Students.AddRange(allStudents);
            Context.SaveChanges();

            var student = allStudents[0]; // Keep reference to the first student for later use
            var archivedStudent = allStudents[1];
            var archivedSchoolStudent = allStudents[2];

            // Create provider-student relationship
            var providerStudent = new ProviderStudent
            {
                ProviderId = allProviders[0].Id,
                StudentId = student.Id,
                CreatedById = 1,
                DateCreated = DateTime.UtcNow
            };
            Context.ProviderStudents.Add(providerStudent);
            Context.SaveChanges();

            // Create parental consent
            var parentalConsent = new StudentParentalConsent
            {
                StudentId = student.Id,
                ParentalConsentEffectiveDate = DateTime.UtcNow.Date,
                ParentalConsentDateEntered = DateTime.UtcNow.Date,
                ParentalConsentTypeId = 1,
                CreatedById = 1,
                DateCreated = DateTime.UtcNow
            };
            Context.StudentParentalConsents.Add(parentalConsent);
            Context.SaveChanges();

            // Create case load
            var caseLoad = new CaseLoad
            {
                StudentTypeId = 1, // IEP
                ServiceCodeId = 5, // Nursing Service
                StudentId = student.Id,
                DiagnosisCodeId = diagnosisCode.Id,
                IepStartDate = DateTime.UtcNow.Date,
                IepEndDate = DateTime.UtcNow.Date.AddYears(1),
                CreatedById = 1,
                DateCreated = DateTime.UtcNow,
                Archived = false
            };
            Context.CaseLoads.Add(caseLoad);
            Context.SaveChanges();

            // Create case load script
            var caseLoadScript = new CaseLoadScript
            {
                CaseLoadId = caseLoad.Id,
                Npi = "1234567890",
                DiagnosisCodeId = diagnosisCode.Id,
                DoctorFirstName = "John",
                DoctorLastName = "Smith",
                InitiationDate = DateTime.UtcNow.Date,
                ExpirationDate = DateTime.UtcNow.Date.AddYears(1),
                FileName = "test_script.pdf",
                FilePath = "/test/path/test_script.pdf",
                UploadedById = 1,
                DateUpload = DateTime.UtcNow.Date,
                Archived = false
            };
            Context.CaseLoadScripts.Add(caseLoadScript);
            Context.SaveChanges();

            // Create case load script goal
            var caseLoadScriptGoal = new CaseLoadScriptGoal
            {
                CaseLoadScriptId = caseLoadScript.Id,
                GoalId = goal.Id,
                Archived = false,
                CreatedById = 1,
                DateCreated = DateTime.UtcNow.Date
            };
            Context.CaseLoadScriptGoals.Add(caseLoadScriptGoal);
            Context.SaveChanges();

            // Load the test data objects with their navigation properties
            TestDistrict = district;
            TestSchool = school;
            TestProvider = Context.Providers
                .Include(p => p.ProviderUser)
                .First(p => p.Id == provider.Id);
            TestArchivedProvider = Context.Providers
                .Include(p => p.ProviderUser)
                .First(p => p.Id == archivedProvider.Id);
            TestNonNursingProvider = Context.Providers
                .Include(p => p.ProviderUser)
                .First(p => p.Id == nonNursingProvider.Id);
            TestStudent = Context.Students
                .Include(s => s.Address)
                .First(s => s.Id == student.Id);
            TestArchivedStudent = Context.Students
                .Include(s => s.Address)
                .First(s => s.Id == archivedStudent.Id);
            TestArchivedSchoolStudent = Context.Students
                .Include(s => s.Address)
                .First(s => s.Id == archivedSchoolStudent.Id); // Student in archived school
            TestCaseLoad = Context.CaseLoads
                .Include(c => c.ServiceCode)
                .Include(c => c.DiagnosisCode)
                .Include(c => c.CaseLoadScripts.Select(cs => cs.DiagnosisCode))
                .Include(c => c.CaseLoadScripts.Select(cs => cs.CaseLoadScriptGoals))
                .First(c => c.Id == caseLoad.Id);
        }

        protected virtual void Setup()
        {
            // Additional setup can be done in derived classes
        }

        protected virtual void Teardown()
        {
            // Additional cleanup can be done in derived classes
        }

        /// <summary>
        /// Returns a dictionary mapping CSV headers to their valid test values.
        /// The order matches the GenerateTemplate method's header order.
        /// </summary>
        protected Dictionary<string, string> GetValidCsvRowData()
        {
            var now = DateTime.UtcNow;
            var rowData = new Dictionary<string, string>
            {
                // Integration information
                { "ImportSource", "SNAP Integration" },
                
                // District and School information
                { "DistrictId", TestDistrict.Id.ToString() },
                { "DistrictName", TestDistrict.Name },
                { "DistrictCode", TestDistrict.Code },
                { "SchoolId", TestSchool.Id.ToString() },
                { "SchoolName", TestSchool.Name },
                
                // Provider information
                { "ProviderId", TestProvider.Id.ToString() },
                { "ProviderNPI", TestProvider.Npi },
                { "ProviderFirstName", TestProvider.ProviderUser.FirstName },
                { "ProviderLastName", TestProvider.ProviderUser.LastName },
                
                // Student information
                { "StudentId", TestStudent.Id.ToString() },
                { "StudentCode", TestStudent.StudentCode },
                { "StudentFirstName", TestStudent.FirstName },
                { "StudentMiddleName", TestStudent.MiddleName },
                { "StudentLastName", TestStudent.LastName },
                { "StudentDateOfBirth", $"{TestStudent.DateOfBirth:MM/dd/yyyy}" },
                { "StudentGrade", TestStudent.Grade },
                { "StudentMedicaidNo", TestStudent.MedicaidNo },
                { "StudentNotes", TestStudent.Notes },
                { "StudentAddressLine1", TestStudent.Address.Address1 },
                { "StudentAddressLine2", TestStudent.Address.Address2 },
                { "StudentCity", TestStudent.Address.City },
                { "StudentState", TestStudent.Address.StateCode },
                { "StudentZip", TestStudent.Address.Zip },
                { "StudentEnrollmentDate", $"{TestStudent.EnrollmentDate:MM/dd/yyyy}" },
                { "StudentTypeId", "1" }, // IEP
                { "StudentTypeName", "IEP" }, // IEP
                
                // Case Load information
                { "ServiceCodeId", TestCaseLoad.ServiceCodeId.ToString() },
                { "ServiceCodeName", TestCaseLoad.ServiceCode.Name },
                { "CaseLoadDiagnosisCode", TestCaseLoad.DiagnosisCode.Code },
                { "IEPStartDate", $"{TestCaseLoad.IepStartDate:MM/dd/yyyy}" },
                { "IEPEndDate", $"{TestCaseLoad.IepEndDate:MM/dd/yyyy}" },
                
                // Prescription/Script information
                { "DoctorFirstName", TestCaseLoad.CaseLoadScripts.First().DoctorFirstName },
                { "DoctorLastName", TestCaseLoad.CaseLoadScripts.First().DoctorLastName },
                { "DoctorNPI", TestCaseLoad.CaseLoadScripts.First().Npi },
                { "PrescriptionInitiationDate", $"{TestCaseLoad.CaseLoadScripts.First().InitiationDate:MM/dd/yyyy}" },
                { "PrescriptionExpirationDate", $"{TestCaseLoad.CaseLoadScripts.First().ExpirationDate:MM/dd/yyyy}" },
                { "CaseLoadScriptDiagnosisCode", TestCaseLoad.CaseLoadScripts.First().DiagnosisCode.Code },
                
                // Encounter data
                { "EncounterDate", $"{now:MM/dd/yyyy}" },
                { "EncounterStartTime", "09:00" },
                { "EncounterEndTime", "10:00" },
                { "ServiceTypeId", "3" }, // Treatment/Therapy
                { "EvaluationTypeId", null }, // Initial Evaluation
                { "EncounterDiagnosisCode", TestCaseLoad.DiagnosisCode.Code },
                { "IsGroup", "false" },
                { "AdditionalStudents", "0" },

                // EncounterStudent data
                { "EncounterLocation", "School" },
                { "StudentStartTime", "09:00" },
                { "StudentEndTime", "10:00" },
                { "EncounterStudentDate", $"{now:MM/dd/yyyy}" },
                { "EncounterStudentDiagnosisCode", TestCaseLoad.DiagnosisCode.Code },
                { "CPTCode", "NU" },
                { "TherapyCaseNotes", "Test therapy notes" },
                { "SupervisorComments", "Test supervisor comments" },
                { "IsTelehealth", "false" }
            };

            return rowData;
        }

        public void Dispose()
        {
            // Roll back transaction to ensure test isolation
            Transaction?.Rollback();
            
            // Dispose of resources
            Transaction?.Dispose();
            Context?.Dispose();
        }
    }
}

