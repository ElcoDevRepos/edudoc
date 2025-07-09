using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.IntegrationTests.Infrastructure;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class DistrictsControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public DistrictsControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
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
    public async Task GetAllDistricts_Should_ReturnUnauthorized_When_NoTokenProvided()
    {
        // Act & Assert
        try
        {
            await _testResources.GetUnauthenticatedApiClient().DistrictsAsync(); 
            Assert.Fail("Should not have succeeded");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnAllDistricts_When_AdminUser()
    {
        // Arrange

        // Create admin user (for current user authorization)
        await _testResources.TestDatabaseRepository.InsertUserAsync(new User
        {
            Id = 998,
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1, // This matches the JWT token AuthUserId
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        });

        var districts = new List<SchoolDistrict>
        {
            new SchoolDistrict 
            { 
                Id = 1001, 
                Name = "Test District 1", 
                Code = "TST1",
                Einnumber = "123456789",
                Irnnumber = "654321",
                Npinumber = "9876543210",
                ProviderNumber = "1234567",
                CreatedById = 998
            },
            new SchoolDistrict 
            { 
                Id = 1002, 
                Name = "Test District 2", 
                Code = "TST2",
                Einnumber = "987654321",
                Irnnumber = "123456",
                Npinumber = "0123456789",
                ProviderNumber = "7654321",
                CreatedById = 998
            },
            new SchoolDistrict 
            { 
                Id = 1003, 
                Name = "Test District 3", 
                Code = "TST3",
                Einnumber = "555666777",
                Irnnumber = "888999",
                Npinumber = "1112223333",
                ProviderNumber = "9998888",
                CreatedById = 998
            }
        };

        await _testResources.TestDatabaseRepository.InsertSchoolDistrictsAsync(districts);

        // Act
        var response = await _testResources.GetAuthenticatedApiClient(UserRoleIds.Admin).DistrictsAsync();

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Records.Should().HaveCount(3);
        response.Errors.Should().BeEmpty();

        response.Records.Should().Contain(d => d.Name == "Test District 1" && d.Code == "TST1");
        response.Records.Should().Contain(d => d.Name == "Test District 2" && d.Code == "TST2");
        response.Records.Should().Contain(d => d.Name == "Test District 3" && d.Code == "TST3");
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnEmptyList_When_NoDistrictsExist()
    {
        // Arrange

        // Create admin user (for current user authorization)
        await _testResources.TestDatabaseRepository.InsertUserAsync(new User 
        { 
            Id = 998, 
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1,
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        });

        // Act
        var response = await _testResources.GetAuthenticatedApiClient(UserRoleIds.Admin).DistrictsAsync();

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Records.Should().BeEmpty();
        response.Errors.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnOnlyAssociatedDistricts_When_ProviderUser()
    {
        // Arrange

        // Create admin user (for current user authorization)
        await _testResources.TestDatabaseRepository.InsertUserAsync(new User
        {
            Id = 998,
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1, // This matches the JWT token AuthUserId
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        });
        // Create provider user
        await _testResources.TestDatabaseRepository.InsertProviderTitleAsync(new ProviderTitle()
        {
            Id = 1,
            Name = "Test Title",
            ServiceCodeId = 1,
        });

        await _testResources.TestDatabaseRepository.InsertAuthUserAsync(new AuthUser
        {
            Id = 2,
            Username = "provider1",
            Password = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            Salt = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            RoleId = UserRoleIds.Provider
        });

        await _testResources.TestDatabaseRepository.InsertUserAsync(new User 
        { 
            Id = 999, 
            Email = "provider@test.com",
            FirstName = "Provider",
            LastName = "User",
            AuthUserId = 2, // This matches the JWT token AuthUserId
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]
        });

        // Create districts
        var districts = new List<SchoolDistrict>
        {
            new SchoolDistrict 
            { 
                Id = 1001, 
                Name = "Associated District 1", 
                Code = "ASD1",
                Einnumber = "123456789",
                Irnnumber = "654321",
                Npinumber = "9876543210",
                ProviderNumber = "1234567",
                CreatedById = 998
            },
            new SchoolDistrict 
            { 
                Id = 1002, 
                Name = "Associated District 2", 
                Code = "ASD2",
                Einnumber = "987654321",
                Irnnumber = "123456",
                Npinumber = "0123456789",
                ProviderNumber = "7654321",
                CreatedById = 998
            },
            new SchoolDistrict 
            { 
                Id = 1003, 
                Name = "Unassociated District", 
                Code = "UAD",
                Einnumber = "555666777",
                Irnnumber = "888999",
                Npinumber = "1112223333",
                ProviderNumber = "9998888",
                CreatedById = 998
            }
        };

        await _testResources.TestDatabaseRepository.InsertSchoolDistrictsAsync(districts);

        // Create provider
        await _testResources.TestDatabaseRepository.InsertProviderAsync(new Provider
        {
            Id = 1001,
            ProviderUserId = 999, // Points to User.Id
            TitleId = 1,
            CreatedById = 999,
            ProviderEmploymentTypeId = 1
        });

        // Create provider-district associations (only for districts 1 and 2)
        await _testResources.TestDatabaseRepository.InsertProviderEscAssignmentAsync(new ProviderEscAssignment
        {
            Id = 1001,
            ProviderId = 1001,
            StartDate = DateTime.UtcNow.AddMonths(-6),
            EndDate = null, // Active assignment
            Archived = false,
            CreatedById = 999
        });

        var providerEscs = new List<ProviderEscSchoolDistrict>
        {
            new ProviderEscSchoolDistrict
            {
                Id = 1001,
                ProviderEscAssignmentId = 1001,
                SchoolDistrictId = 1001
            },
            new ProviderEscSchoolDistrict
            {
                Id = 1002,
                ProviderEscAssignmentId = 1001,
                SchoolDistrictId = 1002
            }
        };
        await _testResources.TestDatabaseRepository.InsertProviderEscSchoolDistrictsAsync(providerEscs);

        // Act
        var response = await _testResources.GetAuthenticatedApiClient(UserRoleIds.Provider, "2").DistrictsAsync();

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Records.Should().HaveCount(2);
        response.Errors.Should().BeEmpty();

        response.Records.Should().Contain(d => d.Name == "Associated District 1");
        response.Records.Should().Contain(d => d.Name == "Associated District 2");
        response.Records.Should().NotContain(d => d.Name == "Unassociated District");
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnEmptyList_When_ProviderHasNoAssociatedDistricts()
    {
        // Arrange

        //Create admin user
        await _testResources.TestDatabaseRepository.InsertUserAsync(new User
        {
            Id = 998,
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1,
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        });

        // Create provider user
        await _testResources.TestDatabaseRepository.InsertProviderTitleAsync(new ProviderTitle()
        {
            Id = 1,
            Name = "Test Title",
            ServiceCodeId = 1,
        });

        await _testResources.TestDatabaseRepository.InsertAuthUserAsync(new AuthUser
        {
            Id = 2,
            Username = "provider1",
            Password = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            Salt = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            RoleId = UserRoleIds.Provider
        });

        await _testResources.TestDatabaseRepository.InsertUserAsync(new User 
        { 
            Id = 999, 
            Email = "provider@test.com",
            FirstName = "Provider",
            LastName = "User",
            AuthUserId = 2, // This matches the JWT token AuthUserId
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]
        });

        // Create districts (but no associations)
        var districts = new List<SchoolDistrict>
        {
            new SchoolDistrict 
            { 
                Id = 1001, 
                Name = "Unassociated District", 
                Code = "UAD",
                Einnumber = "123456789",
                Irnnumber = "654321",
                Npinumber = "9876543210",
                ProviderNumber = "1234567",
                CreatedById = 998
            }
        };

        await _testResources.TestDatabaseRepository.InsertSchoolDistrictsAsync(districts);

        // Create provider (but no associations)
        await _testResources.TestDatabaseRepository.InsertProviderAsync(new Provider
        {
            Id = 1001,
            ProviderUserId = 999, // Points to User.Id
            TitleId = 1,
            CreatedById = 999,
            ProviderEmploymentTypeId = 1
        });

        // Act
        var response = await _testResources.GetAuthenticatedApiClient(UserRoleIds.Provider, "2").DistrictsAsync();

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Records.Should().BeEmpty();
        response.Errors.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnOnlyAssignedDistrict_When_DistrictAdminUser()
    {
        // Arrange

        // Create admin user
        await _testResources.TestDatabaseRepository.InsertUserAsync(new User
        {
            Id = 998,
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1,
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        });

        // Create districts
        var districts = new List<SchoolDistrict>
        {
            new SchoolDistrict 
            { 
                Id = 1001, 
                Name = "Assigned District", 
                Code = "ASD",
                Einnumber = "123456789",
                Irnnumber = "654321",
                Npinumber = "9876543210",
                ProviderNumber = "1234567",
                CreatedById = 998
            },
            new SchoolDistrict 
            { 
                Id = 1002, 
                Name = "Unassigned District", 
                Code = "UAD",
                Einnumber = "987654321",
                Irnnumber = "123456",
                Npinumber = "0123456789",
                ProviderNumber = "7654321",
                CreatedById = 998
            }
        };

        await _testResources.TestDatabaseRepository.InsertSchoolDistrictsAsync(districts);

        // Create district admin user
        await _testResources.TestDatabaseRepository.InsertAuthUserAsync(new AuthUser
        {
            Id = 3,
            Username = "districtadmin1",
            Password = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            Salt = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            RoleId = UserRoleIds.SchoolDistrictAdmin
        });

        await _testResources.TestDatabaseRepository.InsertUserAsync(new User
        {
            Id = 1000,
            Email = "districtadmin@test.com",
            FirstName = "District",
            LastName = "Admin",
            AuthUserId = 3, // This matches the JWT token AuthUserId,
            SchoolDistrictId = 1001,
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02]
        });

        // Act
        var response = await _testResources.GetAuthenticatedApiClient(UserRoleIds.SchoolDistrictAdmin, "3").DistrictsAsync();

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Records.Should().HaveCount(1);
        response.Errors.Should().BeEmpty();

        response.Records.Should().Contain(d => d.Name == "Assigned District");
        response.Records.Should().NotContain(d => d.Name == "Unassigned District");
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnEmptyList_When_DistrictAdminHasNoAssignedDistrict()
    {
        // Arrange

        // Create admin user
        await _testResources.TestDatabaseRepository.InsertUserAsync(new User
        {
            Id = 998,
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1,
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        });

        // Create district admin user
        await _testResources.TestDatabaseRepository.InsertAuthUserAsync(new AuthUser
        {
            Id = 3,
            Username = "districtadmin1",
            Password = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            Salt = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
            RoleId = UserRoleIds.SchoolDistrictAdmin
        });

        await _testResources.TestDatabaseRepository.InsertUserAsync(new User 
        { 
            Id = 1000, 
            Email = "districtadmin@test.com",
            FirstName = "District",
            LastName = "Admin",
            AuthUserId = 3, // This matches the JWT token AuthUserId
            Version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02]
        });

        // Create districts (but no assignments)
        var districts = new List<SchoolDistrict>
        {
            new SchoolDistrict 
            { 
                Id = 1001, 
                Name = "Unassigned District", 
                Code = "UAD",
                Einnumber = "123456789",
                Irnnumber = "654321",
                Npinumber = "9876543210",
                ProviderNumber = "1234567",
                CreatedById = 998
            }
        };

        await _testResources.TestDatabaseRepository.InsertSchoolDistrictsAsync(districts);

        // Act

        var response = await _testResources.GetAuthenticatedApiClient(UserRoleIds.SchoolDistrictAdmin, "3").DistrictsAsync();

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Records.Should().BeEmpty();
        response.Errors.Should().BeEmpty();
    }
} 