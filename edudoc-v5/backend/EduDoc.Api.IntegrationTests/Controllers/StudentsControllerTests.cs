using System.Net;
using System.Threading.Tasks;
using EduDoc.Api.EF.Models;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using EduDoc.Api.EF;
using EduDocV5Client;
using EduDoc.Api.IntegrationTests.TestBase;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class StudentsControllerTests : AuthorizedIntegrationTestBase
{
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public StudentsControllerTests(CustomWebApplicationFactory<global::Program> factory) : base(factory)
    {
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnUnauthorized_WhenNoTokenProvided()
    {
        // Arrange
        var request = new EduDocV5Client.StudentSearchRequestModel 
        { 
            SearchText = "John" 
        };

        // Act & Assert
        try
        {
            await _client.SearchAsync(request);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnStudents_WhenValidTokenAndMatchingStudentsExist()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);

        // Create admin user (for current user authorization)
        var adminUser = new User 
        { 
            Id = 998, 
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1, // This matches the JWT token AuthUserId
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 }
        };
        await _context.Users.AddAsync(adminUser);

        // Create test users for CreatedBy
        var testUser = new User 
        { 
            Id = 999, 
            Email = "test@test.com",
            FirstName = "Test",
            LastName = "User",
            AuthUserId = 2, // Different AuthUserId for CreatedBy
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01 }
        };
        await _context.Users.AddAsync(testUser);

        // Create test school
        var testSchool = new School
        {
            Id = 999,
            Name = "Test Elementary School",
            CreatedById = 1
        };
        await _context.Schools.AddAsync(testSchool);

        // Create test district
        var testDistrict = new SchoolDistrict
        {
            Id = 999,
            Name = "Test School District",
            Code = "TST",
            Einnumber = "123456789",
            Irnnumber = "654321",
            Npinumber = "9876543210",
            ProviderNumber = "1234567",
            CreatedById = 1
        };
        await _context.SchoolDistricts.AddAsync(testDistrict);

        var students = new List<Student>
        {
            new Student 
            { 
                Id = 1001, 
                FirstName = "John", 
                LastName = "Doe", 
                Grade = "5", 
                DateOfBirth = new DateTime(2010, 1, 1),
                SchoolId = 999,
                DistrictId = 999,
                CreatedById = 999,
                Archived = false
            },
            new Student 
            { 
                Id = 1002, 
                FirstName = "Johnny", 
                LastName = "Smith", 
                Grade = "6", 
                DateOfBirth = new DateTime(2009, 5, 15),
                SchoolId = 999,
                DistrictId = 999,
                CreatedById = 999,
                Archived = false
            },
            new Student 
            { 
                Id = 1003, 
                FirstName = "Jane", 
                LastName = "Johnson", 
                Grade = "4", 
                DateOfBirth = new DateTime(2011, 8, 20),
                SchoolId = 999,
                DistrictId = 999,
                CreatedById = 999,
                Archived = false
            }
        };

        await _context.Students.AddRangeAsync(students);
        await _context.SaveChangesAsync();

        var request = new EduDocV5Client.StudentSearchRequestModel 
        { 
            SearchText = "John",
            DistrictId = 999
        };
        
        // Act
        var responseData = await _client.SearchAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().NotBeNull();
        responseData.Records.Should().HaveCount(3); // John, Johnny, and Jane Johnson should match
        responseData.Success.Should().BeTrue();
        responseData.Errors.Should().BeEmpty();

        responseData.Records.Should().Contain(s => s.FirstName == "John" && s.LastName == "Doe");
        responseData.Records.Should().Contain(s => s.FirstName == "Johnny" && s.LastName == "Smith");
        responseData.Records.Should().Contain(s => s.FirstName == "Jane" && s.LastName == "Johnson"); // Johnson contains "john"
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnEmptyList_WhenNoMatchingStudentsExist()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Provider);
        
        var request = new EduDocV5Client.StudentSearchRequestModel 
        { 
            SearchText = "NonExistentStudent"
        };

        // Act
        var responseData = await _client.SearchAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().NotBeNull();
        responseData.Records.Should().BeEmpty();
        responseData.Success.Should().BeTrue();
        responseData.Errors.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnValidationErrors_WhenSearchTextIsEmpty()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);
        
        var request = new EduDocV5Client.StudentSearchRequestModel 
        { 
            SearchText = ""
        };

        // Act & Assert
        try
        {
            await _client.SearchAsync(request);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.UnprocessableEntity);
            // Note: Validation error details would be in the response body if needed
        }
    }

    [Fact]
    public async Task SearchStudents_ShouldFilterByDistrict_WhenDistrictIdProvided()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);

        // Create admin user (for current user authorization)
        var adminUser = new User 
        { 
            Id = 997, 
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1, // This matches the JWT token AuthUserId
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01 }
        };
        await _context.Users.AddAsync(adminUser);

        // Create test users for CreatedBy
        var testUser = new User 
        { 
            Id = 998, 
            Email = "test2@test.com",
            FirstName = "Test",
            LastName = "User",
            AuthUserId = 2, // Different AuthUserId for CreatedBy
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02 }
        };
        await _context.Users.AddAsync(testUser);

        // Create test schools for different districts
        var school1 = new School
        {
            Id = 997,
            Name = "District 1 School",
            CreatedById = 1
        };
        var school2 = new School
        {
            Id = 998,
            Name = "District 2 School", 
            CreatedById = 1
        };
        await _context.Schools.AddRangeAsync(school1, school2);

        var students = new List<Student>
        {
            new Student 
            { 
                Id = 2001, 
                FirstName = "Alice", 
                LastName = "District1", 
                Grade = "5", 
                DateOfBirth = new DateTime(2010, 1, 1),
                SchoolId = 997,
                DistrictId = 1,
                CreatedById = 998,
                Archived = false
            },
            new Student 
            { 
                Id = 2002, 
                FirstName = "Alice", 
                LastName = "District2", 
                Grade = "6", 
                DateOfBirth = new DateTime(2009, 5, 15),
                SchoolId = 998,
                DistrictId = 2,
                CreatedById = 998,
                Archived = false
            }
        };

        await _context.Students.AddRangeAsync(students);
        await _context.SaveChangesAsync();

        var request = new EduDocV5Client.StudentSearchRequestModel 
        { 
            SearchText = "Alice",
            DistrictId = 1
        };
        
        // Act
        var responseData = await _client.SearchAsync(request);
        
        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().HaveCount(1);
        responseData.Records.First().LastName.Should().Be("District1");
        responseData.Records.First().DistrictId.Should().Be(1);
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnOnlyAuthorizedStudents_WhenProviderHasActiveAssignments()
    {
        // Arrange - Create Provider user with active ESC assignments
        var providerUserId = 500;
        var providerId = 100;
        var escId = 10;
        var districtId = 50;

        SetAuthorizationHeader(UserRoleIds.Provider, providerUserId.ToString());

        // Create User record that links AuthUser to User
        var providerUser = new User
        {
            Id = 600, // User ID
            AuthUserId = providerUserId, // Links to AuthUser ID from JWT
            Email = "provider@test.com",
            FirstName = "Test",
            LastName = "Provider",
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06 }
        };
        await _context.Users.AddAsync(providerUser);

        // Create Provider
        var provider = new Provider
        {
            Id = providerId,
            ProviderUserId = 600, // Points to User.Id (not AuthUser.Id)
            TitleId = 1,
            CreatedById = 1
        };
        await _context.Providers.AddAsync(provider);

        // Create ESC Assignment
        var escAssignment = new ProviderEscAssignment
        {
            Id = 200,
            ProviderId = providerId,
            EscId = escId,
            StartDate = DateTime.UtcNow.AddMonths(-6),
            EndDate = null, // Active assignment
            Archived = false,
            CreatedById = 1
        };
        await _context.ProviderEscAssignments.AddAsync(escAssignment);

        // Create ESC School District mapping
        var escSchoolDistrict = new ProviderEscSchoolDistrict
        {
            Id = 300,
            ProviderEscAssignmentId = 200,
            SchoolDistrictId = districtId
        };
        await _context.ProviderEscSchoolDistricts.AddAsync(escSchoolDistrict);

        // Create test district and school
        var testDistrict = new SchoolDistrict
        {
            Id = districtId,
            Name = "Provider Test District",
            Code = "PTD",
            Einnumber = "111111111",
            Irnnumber = "222222",
            Npinumber = "3333333333",
            ProviderNumber = "4444444",
            CreatedById = 1
        };
        await _context.SchoolDistricts.AddAsync(testDistrict);

        var testSchool = new School
        {
            Id = 400,
            Name = "Provider Test School",
            CreatedById = 1
        };
        await _context.Schools.AddAsync(testSchool);

        // User already created above for provider authorization

        // Create students - one in authorized district, one in unauthorized district
        var authorizedStudent = new Student
        {
            Id = 3001,
            FirstName = "Authorized",
            LastName = "Student",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 1, 1),
            SchoolId = 400,
            DistrictId = districtId, // In provider's authorized district
            CreatedById = 600,
            Archived = false
        };

        var unauthorizedStudent = new Student
        {
            Id = 3002,
            FirstName = "Unauthorized",
            LastName = "Student",
            Grade = "6",
            DateOfBirth = new DateTime(2009, 1, 1),
            SchoolId = 400,
            DistrictId = 999, // Different district
            CreatedById = 600,
            Archived = false
        };

        await _context.Students.AddRangeAsync(authorizedStudent, unauthorizedStudent);
        await _context.SaveChangesAsync();

        var request = new EduDocV5Client.StudentSearchRequestModel
        {
            SearchText = "Student"
        };

        // Act
        var responseData = await _client.SearchAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().HaveCount(1);
        responseData.Records.First().FirstName.Should().Be("Authorized");
        responseData.Records.First().DistrictId.Should().Be(districtId);
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnEmpty_WhenProviderHasNoActiveAssignments()
    {
        // Arrange - Create Provider user with NO active assignments
        var providerUserId = 501;
        var providerId = 101;

        SetAuthorizationHeader(UserRoleIds.Provider, providerUserId.ToString());

        // Create User record that links AuthUser to User  
        var providerUser2 = new User
        {
            Id = 601, // User ID
            AuthUserId = providerUserId, // Links to AuthUser ID from JWT
            Email = "provider2@test.com",
            FirstName = "Test",
            LastName = "Provider2",
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07 }
        };
        await _context.Users.AddAsync(providerUser2);

        // Create Provider
        var provider = new Provider
        {
            Id = providerId,
            ProviderUserId = 601, // Points to User.Id (not AuthUser.Id)
            TitleId = 1,
            CreatedById = 1
        };
        await _context.Providers.AddAsync(provider);

        // User already created above for provider authorization

        var student = new Student
        {
            Id = 3003,
            FirstName = "Should",
            LastName = "NotSee",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 1, 1),
            SchoolId = 1,
            DistrictId = 1,
            CreatedById = 601, // Using the provider user we created
            Archived = false
        };
        await _context.Students.AddAsync(student);
        await _context.SaveChangesAsync();

        var request = new EduDocV5Client.StudentSearchRequestModel
        {
            SearchText = "Should"
        };

        // Act
        var responseData = await _client.SearchAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnOnlyAuthorizedStudents_WhenDistrictAdminHasAssignedDistricts()
    {
        // Arrange - Create District Admin user with assigned districts
        var districtAdminUserId = 502;
        var assignedDistrictId = 51;

        SetAuthorizationHeader(UserRoleIds.SchoolDistrictAdmin, districtAdminUserId.ToString());

        // Create User record that links AuthUser to User
        var districtAdminUser = new User
        {
            Id = 700, // User ID
            AuthUserId = districtAdminUserId, // Links to AuthUser ID from JWT
            Email = "district.admin@test.com",
            FirstName = "District",
            LastName = "Admin",
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0B }
        };
        await _context.Users.AddAsync(districtAdminUser);

        // Create AdminSchoolDistrict assignment
        var adminSchoolDistrict = new AdminSchoolDistrict
        {
            Id = 400,
            AdminId = 700, // Points to User.Id (not AuthUser.Id)
            SchoolDistrictId = assignedDistrictId,
            Archived = false,
            CreatedById = 1
        };
        await _context.AdminSchoolDistricts.AddAsync(adminSchoolDistrict);

        // Create test district and school
        var testDistrict = new SchoolDistrict
        {
            Id = assignedDistrictId,
            Name = "Admin Test District",
            Code = "ATD",
            Einnumber = "555555555",
            Irnnumber = "666666",
            Npinumber = "7777777777",
            ProviderNumber = "8888888",
            CreatedById = 1
        };
        await _context.SchoolDistricts.AddAsync(testDistrict);

        var testSchool = new School
        {
            Id = 401,
            Name = "Admin Test School",
            CreatedById = 1
        };
        await _context.Schools.AddAsync(testSchool);

        // Create test user for CreatedBy
        var testUser = new User
        {
            Id = 602,
            Email = "admin.test@test.com",
            FirstName = "Test",
            LastName = "User",
            AuthUserId = 1,
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08 }
        };
        await _context.Users.AddAsync(testUser);

        // Create students - one in authorized district, one in unauthorized district
        var authorizedStudent = new Student
        {
            Id = 3004,
            FirstName = "District",
            LastName = "Authorized",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 1, 1),
            SchoolId = 401,
            DistrictId = assignedDistrictId, // In admin's authorized district
            CreatedById = 602,
            Archived = false
        };

        var unauthorizedStudent = new Student
        {
            Id = 3005,
            FirstName = "District",
            LastName = "Unauthorized",
            Grade = "6",
            DateOfBirth = new DateTime(2009, 1, 1),
            SchoolId = 401,
            DistrictId = 999, // Different district
            CreatedById = 602,
            Archived = false
        };

        await _context.Students.AddRangeAsync(authorizedStudent, unauthorizedStudent);
        await _context.SaveChangesAsync();

        var request = new EduDocV5Client.StudentSearchRequestModel
        {
            SearchText = "District"
        };

        // Act
        var responseData = await _client.SearchAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().HaveCount(1);
        responseData.Records.First().LastName.Should().Be("Authorized");
        responseData.Records.First().DistrictId.Should().Be(assignedDistrictId);
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnEmpty_WhenDistrictAdminHasNoAssignedDistricts()
    {
        // Arrange - District Admin with no assigned districts
        var districtAdminUserId = 503;

        SetAuthorizationHeader(UserRoleIds.SchoolDistrictAdmin, districtAdminUserId.ToString());

        // Create User record that links AuthUser to User (but no AdminSchoolDistrict assignment)
        var districtAdminUser2 = new User
        {
            Id = 701, // User ID
            AuthUserId = districtAdminUserId, // Links to AuthUser ID from JWT
            Email = "district.admin2@test.com",
            FirstName = "District",
            LastName = "Admin2",
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0C }
        };
        await _context.Users.AddAsync(districtAdminUser2);

        // Create test user and student (but no AdminSchoolDistrict assignment)
        var testUser = new User
        {
            Id = 603,
            Email = "admin.test2@test.com",
            FirstName = "Test",
            LastName = "User",
            AuthUserId = 1,
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09 }
        };
        await _context.Users.AddAsync(testUser);

        var student = new Student
        {
            Id = 3006,
            FirstName = "Should",
            LastName = "NotSeeThis",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 1, 1),
            SchoolId = 1,
            DistrictId = 1,
            CreatedById = 603,
            Archived = false
        };
        await _context.Students.AddAsync(student);
        await _context.SaveChangesAsync();

        var request = new EduDocV5Client.StudentSearchRequestModel
        {
            SearchText = "Should"
        };

        // Act
        var responseData = await _client.SearchAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnValidationErrors_WhenDistrictIdIsInvalid()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);

        var request = new EduDocV5Client.StudentSearchRequestModel
        {
            SearchText = "Valid",
            DistrictId = -1 // Invalid district ID
        };

        // Act & Assert
        try
        {
            await _client.SearchAsync(request);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.UnprocessableEntity);
            // Note: Validation error details would be in the response body if needed
        }
    }

    [Fact]
    public async Task SearchStudents_ShouldTrimSearchText_WhenSearchTextHasWhitespace()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);

        // Create test data
        var testUser = new User
        {
            Id = 604,
            Email = "trim.test@test.com",
            FirstName = "Test",
            LastName = "User",
            AuthUserId = 1,
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0A }
        };
        await _context.Users.AddAsync(testUser);

        var testSchool = new School
        {
            Id = 402,
            Name = "Trim Test School",
            CreatedById = 1
        };
        await _context.Schools.AddAsync(testSchool);

        var testDistrict = new SchoolDistrict
        {
            Id = 52,
            Name = "Trim Test District",
            Code = "TTD",
            Einnumber = "999999999",
            Irnnumber = "888888",
            Npinumber = "1111111111",
            ProviderNumber = "2222222",
            CreatedById = 1
        };
        await _context.SchoolDistricts.AddAsync(testDistrict);

        var student = new Student
        {
            Id = 3007,
            FirstName = "Trimmed",
            LastName = "Search",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 1, 1),
            SchoolId = 402,
            DistrictId = 52,
            CreatedById = 604,
            Archived = false
        };
        await _context.Students.AddAsync(student);
        await _context.SaveChangesAsync();

        var request = new EduDocV5Client.StudentSearchRequestModel
        {
            SearchText = "  Trimmed  " // Search text with leading/trailing whitespace
        };

        // Act
        var responseData = await _client.SearchAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().HaveCount(1);
        responseData.Records.First().FirstName.Should().Be("Trimmed");
    }

    public override void Dispose()
    {
        _scope.Dispose();
        _context.Dispose();
        base.Dispose();
    }
} 