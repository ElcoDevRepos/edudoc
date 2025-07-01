using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.IntegrationTests.Infrastructure;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Threading.Tasks;
using Xunit.Abstractions;

#pragma warning disable EF1002 // SQL injection warnings - test file with controlled parameters

namespace EduDoc.Api.IntegrationTests.Controllers;

public class StudentsControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public StudentsControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
    {
        _factory = factory;
        _factory.OutputHelper = output;
    }

    public async Task InitializeAsync()
    {
        _testResources = await _factory.SetupTest();
    }

    public async Task DisposeAsync()
    {
        await Task.CompletedTask;
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnUnauthorized_WhenNoTokenProvided()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "John" 
        };

        // Act & Assert
        try
        {
            await _testResources.GetUnauthenticatedApiClient().SearchStudentsAsync(request);
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
        // Create test data
        await CreateTestUser(_testResources, 999, "admin@test.com", "Admin", "User", 1);
        await CreateTestUser(_testResources, 998, "test@test.com", "Test", "User", 2);

        // Create test school and district
        await CreateTestSchool(_testResources, 999, "Test Elementary School");
        await CreateTestDistrict(_testResources, 999, "Test School District", "TST");

        await _testResources.TestDatabaseRepository.InsertStudentsAsync(
            new List<Student>
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
             });

        var request = new StudentSearchRequestModel 
        { 
            SearchText = "John",
            DistrictId = 999
        };
        
        // Act
        var responseData = await _testResources.GetAuthenticatedApiClient().SearchStudentsAsync(request);

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
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "NonExistentStudent"
        };

        // Act
        var responseData = await _testResources.GetAuthenticatedApiClient().SearchStudentsAsync(request);

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
        var request = new StudentSearchRequestModel 
        { 
            SearchText = ""
        };

        // Act & Assert
        try
        {
            await _testResources.GetAuthenticatedApiClient().SearchStudentsAsync(request);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.UnprocessableEntity);
        }
    }

    [Fact]
    public async Task SearchStudents_ShouldFilterByDistrict_WhenDistrictIdProvided()
    {
        // Arrange
        // Create admin user (for current user authorization)
        await CreateTestUser(_testResources, 997, "admin@test.com", "Admin", "User", 1);
        await CreateTestUser(_testResources, 998, "test2@test.com", "Test", "User", 2);

        // Create test districts first
        await CreateTestDistrict(_testResources, 1, "Test District 1", "TD1");
        await CreateTestDistrict(_testResources, 2, "Test District 2", "TD2");

        // Create test schools for different districts
        await CreateTestSchool(_testResources, 997, "District 1 School");
        await CreateTestSchool(_testResources, 998, "District 2 School");

        await _testResources.TestDatabaseRepository.InsertStudentsAsync(new List<Student>
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
        });

        // Act
        var responseData = await _testResources.GetAuthenticatedApiClient().SearchStudentsAsync(new StudentSearchRequestModel
        {
            SearchText = "Alice",
            DistrictId = 1
        });
        
        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().HaveCount(1);
        responseData.Records.First().LastName.Should().Be("District1");
        responseData.Records.First().DistrictId.Should().Be(1);
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnOnlyAuthorizedStudents_WhenProviderHasActiveAssignments()
    {
        // Arrange
        var providerUserId = 500;
        var providerId = 100;
        var escId = 10;
        var districtId = 50;

        // Create User record that links AuthUser to User
        await CreateTestUser(_testResources, 600, "provider@test.com", "Test", "Provider", providerUserId);

        // Create ProviderTitle first (required for Provider)
        await CreateTestProviderTitle(_testResources, 1, "Test Provider Title");

        // Create the ESC record before assigning it
        await CreateTestEsc(_testResources, escId, "Test ESC", "TESC");

        // Create Provider
        await _testResources.TestDatabaseRepository.InsertProviderAsync(new Provider
        {
            Id = providerId,
            ProviderUserId = 600, // Points to User.Id (not AuthUser.Id)
            TitleId = 1,
            ProviderEmploymentTypeId = 1,
            CreatedById = 1
        });

        await _testResources.TestDatabaseRepository.InsertProviderEscAssignmentAsync(new ProviderEscAssignment
        {
            Id = 200,
            ProviderId = providerId,
            EscId = escId,
            StartDate = DateTime.UtcNow.AddMonths(-6),
            EndDate = null, // Active assignment
            Archived = false,
            CreatedById = 1
        });

        // Create test districts and schools first
        await CreateTestDistrict(_testResources, districtId, "Provider Test District", "PTD");
        await CreateTestSchool(_testResources, 400, "Provider Test School");
        await CreateTestDistrict(_testResources, 999, "Unauthorized District", "UD");

        await _testResources.TestDatabaseRepository.InsertProviderEscSchoolDistrictAsync(new ProviderEscSchoolDistrict
        {
            Id = 300,
            ProviderEscAssignmentId = 200,
            SchoolDistrictId = districtId
        });


        // Create students - one in authorized district, one in unauthorized district
        await _testResources.TestDatabaseRepository.InsertStudentsAsync(new List<Student>
        {
            new Student
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
            },
            new Student
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
            }
        });

        var authenticatedClient = _testResources.GetAuthenticatedApiClient(
            userRoleTypeId: 2, // Provider
            userId: "500", 
            userName: "provider@test.com");


        var request = new StudentSearchRequestModel
        {
            SearchText = "Student"
        };

        // Act
        var responseData = await authenticatedClient.SearchStudentsAsync(request);

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

        // Create User record that links AuthUser to User  
        await CreateTestUser(_testResources, 601, "provider2@test.com", "Test", "Provider2", providerUserId);

        // Create ProviderTitle first (required for Provider)
        await CreateTestProviderTitle(_testResources, 1, "Test Provider Title");

        // Create Provider
        await _testResources.TestDatabaseRepository.InsertProviderAsync(new Provider
        {
            Id = providerId,
            ProviderUserId = 601, // Points to User.Id (not AuthUser.Id)
            TitleId = 1,
            ProviderEmploymentTypeId = 1,
            CreatedById = 1
        });

        // Create test district and school for the student
        await CreateTestDistrict(_testResources, 10, "Test District", "TD");
        await CreateTestSchool(_testResources, 10, "Test School");

        await _testResources.TestDatabaseRepository.InsertStudentAsync(new Student
        {
            Id = 3003,
            FirstName = "Should",
            LastName = "NotSee",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 1, 1),
            SchoolId = 10,
            DistrictId = 10,
            CreatedById = 601, // Using the provider user we created
            Archived = false
        });


        var authenticatedClient = _testResources.GetAuthenticatedApiClient(
            userRoleTypeId: 2, // Provider role
            userId: "501", // The provider's AuthUser ID
            userName: "provider2@test.com");


        var request = new StudentSearchRequestModel
        {
            SearchText = "Should"
        };

        // Act
        var responseData = await authenticatedClient.SearchStudentsAsync(request);

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

        // Create User record that links AuthUser to User
        await CreateTestUser(_testResources, 700, "district.admin@test.com", "District", "Admin", districtAdminUserId);

        // Create test district and school FIRST (required for AdminSchoolDistrict FK)
        await CreateTestDistrict(_testResources, assignedDistrictId, "Admin Test District", "ATD");
        await CreateTestSchool(_testResources, 401, "Admin Test School");

        // Create unauthorized district for testing (student will be in this district)
        await CreateTestDistrict(_testResources, 999, "Unauthorized District", "UD");

        // Create AdminSchoolDistrict assignment
        await _testResources.TestDatabaseRepository.InsertAdminSchoolDistrictAsync(new AdminSchoolDistrict
        {
            Id = 400,
            AdminId = 700, // Points to User.Id (not AuthUser.Id)
            SchoolDistrictId = assignedDistrictId,
            Archived = false,
            CreatedById = 1
        });

        // Create test user for CreatedBy
        await CreateTestUser(_testResources, 602, "admin.test@test.com", "Test", "User", 1);

        // Create students - one in authorized district, one in unauthorized district
        await _testResources.TestDatabaseRepository.InsertStudentsAsync(new List<Student>
        {
            new Student
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
            },
            new Student
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
            }
        });

        var authenticatedClient = _testResources.GetAuthenticatedApiClient(
            userRoleTypeId: 3, // School District Administrator
            userId: "502", // The district admin user ID
            userName: "district.admin@test.com");


        var request = new StudentSearchRequestModel
        {
            SearchText = "District"
        };

        // Act
        var responseData = await authenticatedClient.SearchStudentsAsync(request);

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

        // Create User record that links AuthUser to User (but no AdminSchoolDistrict assignment)
        await CreateTestUser(_testResources, 701, "district.admin2@test.com", "District", "Admin2", districtAdminUserId);

        // Create test user and student (but no AdminSchoolDistrict assignment)
        await CreateTestUser(_testResources, 603, "admin.test2@test.com", "Test", "User", 1);

        // Create test district and school
        await CreateTestDistrict(_testResources, 100, "Test District", "TD");
        await CreateTestSchool(_testResources, 100, "Test School");

        await _testResources.TestDatabaseRepository.InsertStudentAsync(new Student
        {
            Id = 3006,
            FirstName = "Should",
            LastName = "NotSeeThis",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 1, 1),
            SchoolId = 100,
            DistrictId = 100,
            CreatedById = 603,
            Archived = false
        });

        var authenticatedClient = _testResources.GetAuthenticatedApiClient(
            userRoleTypeId: 3, // School District Administrator
            userId: "503", // The district admin user ID
            userName: "district.admin2@test.com");


        var request = new StudentSearchRequestModel
        {
            SearchText = "Should"
        };

        // Act
        var responseData = await authenticatedClient.SearchStudentsAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchStudents_ShouldReturnValidationErrors_WhenDistrictIdIsInvalid()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "Valid",
            DistrictId = -1 // Invalid district ID
        };

        // Act & Assert
        try
        {
            await _testResources.GetAuthenticatedApiClient().SearchStudentsAsync(request);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.UnprocessableEntity);
        }
    }

    [Fact]
    public async Task SearchStudents_ShouldTrimSearchText_WhenSearchTextHasWhitespace()
    {
        // Arrange
        // Create test data
        await CreateTestUser(_testResources, 604, "trim.test@test.com", "Test", "User", 1);
        await CreateTestSchool(_testResources, 402, "Trim Test School");
        await CreateTestDistrict(_testResources, 52, "Trim Test District", "TTD");

        await _testResources.TestDatabaseRepository.InsertStudentAsync(new Student
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
        });

        var authenticatedClient = _testResources.GetAuthenticatedApiClient();

        var request = new StudentSearchRequestModel
        {
            SearchText = "  Trimmed  " // Search text with leading/trailing whitespace
        };

        // Act
        var responseData = await authenticatedClient.SearchStudentsAsync(request);

        // Assert
        responseData.Should().NotBeNull();
        responseData.Records.Should().HaveCount(1);
        responseData.Records.First().FirstName.Should().Be("Trimmed");
    }

    /* Refactor these reuseable methods to use the shared functionality 
     * await testResources.TestDatabaseRepository.InsertStudentAsync(...)
     *  
     */
    private async Task<User> CreateTestUser(TestResources testResources, int id, string email, string firstName, string lastName, int authUserId)
    {
        // Create the AuthUser first if it doesn't exist
        var existingAuthUser = await testResources.DbContext.AuthUsers.FindAsync(authUserId);
        if (existingAuthUser == null)
        {
            await testResources.TestDatabaseRepository.InsertAuthUserAsync(new AuthUser
            {
                Id = authUserId,
                Username = $"test_user_{authUserId}",
                Password = new byte[12],
                Salt = new byte[12],
                ResetKey = new byte[12],
                ResetKeyExpirationUtc = DateTime.MinValue,
                RoleId = 2,
                HasAccess = true,
                IsEditable = true,
                HasLoggedIn = false
            });
        }

        // Then create the User
        var user = new User
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            AuthUserId = authUserId,
            ImageId = null,
            AddressId = null,
            SchoolDistrictId = null,
            CreatedById = 1,
            ModifiedById = null,
            DateCreated = DateTime.UtcNow,
            DateModified = null,
            Archived = false,
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        };
        return await testResources.TestDatabaseRepository.InsertUserAsync(user);
    }

    private async Task<School> CreateTestSchool(TestResources testResources, int id, string name)
    {
        var school = new School
        {
            Id = id,
            Name = name,
            CreatedById = 1,
            ModifiedById = null,
            DateCreated = DateTime.UtcNow,
            DateModified = null,
            Archived = false
        };
        return await testResources.TestDatabaseRepository.InsertSchoolAsync(school);
    }

    private async Task<SchoolDistrict> CreateTestDistrict(TestResources testResources, int id, string name, string code)
    {
        var district = new SchoolDistrict
        {
            Id = id,
            Name = name,
            Code = code,
            Einnumber = "123456789",
            Irnnumber = "654321",
            Npinumber = "9876543210",
            ProviderNumber = "1234567",
            CreatedById = 1
        };
        return await testResources.TestDatabaseRepository.InsertSchoolDistrictAsync(district);
    }

    private async Task CreateTestProviderTitle(TestResources testResources, int id, string name)
    {
        // First create ServiceCode if it doesn't exist (ProviderTitles has FK to ServiceCodes)
        var existingServiceCode = await testResources.DbContext.ServiceCodes.FindAsync(1);
        if (existingServiceCode == null)
        {
            await testResources.TestDatabaseRepository.InsertServiceCodeAsync(new ServiceCode
            {
                Id = 1,
                Name = "Test Service",
                Code = "TEST",
                Area = "Test Area",
                IsBillable = true,
                NeedsReferral = false,
                CanHaveMultipleProgressReportsPerStudent = false,
                CanCosignProgressReports = false,
            });
        }

        // Create ProviderEmploymentType if it doesn't exist (Providers has FK to ProviderEmploymentTypes)
        var existingEmploymentType = await testResources.DbContext.ProviderEmploymentTypes.FindAsync(1);
        if (existingEmploymentType == null)
        {
            await testResources.TestDatabaseRepository.InsertProviderEmploymentTypeAsync(new ProviderEmploymentType
            {
                Id = 1,
                Name = "Test Employment",
            });
        }

        await testResources.TestDatabaseRepository.InsertProviderTitleAsync(new ProviderTitle
        {
            Id = id,
            Name = name,
            ServiceCodeId = 1,
            CreatedById = 1,
            DateCreated = DateTime.UtcNow,
            Archived = false
        });
    }

    private async Task<Esc> CreateTestEsc(TestResources testResources, int id, string name, string code)
    {
        var esc = new Esc
        {
            Id = id,
            Name = name,
            Code = code,
            CreatedById = 1
        };
        return await testResources.TestDatabaseRepository.InsertEscAsync(esc);
    }
} 