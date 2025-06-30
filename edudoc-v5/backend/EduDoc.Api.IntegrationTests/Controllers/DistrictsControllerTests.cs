using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.Districts.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class DistrictsControllerTests : AuthorizedIntegrationTestBase
{
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public DistrictsControllerTests(CustomWebApplicationFactory<global::Program> factory) : base(factory)
    {
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnUnauthorized_When_NoTokenProvided()
    {
        // Act & Assert
        try
        {
            await _client.DistrictsAsync(); 
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

        await _context.SchoolDistricts.AddRangeAsync(districts);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.DistrictsAsync();

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
        SetAuthorizationHeader(UserRoleIds.Admin);

        // Create admin user (for current user authorization)
        var adminUser = new User 
        { 
            Id = 998, 
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            AuthUserId = 1,
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 }
        };
        await _context.Users.AddAsync(adminUser);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.DistrictsAsync();

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
        SetAuthorizationHeader(UserRoleIds.Provider, "2", "Provider User");

        // Create provider user
        var providerUser = new User 
        { 
            Id = 999, 
            Email = "provider@test.com",
            FirstName = "Provider",
            LastName = "User",
            AuthUserId = 2, // This matches the JWT token AuthUserId
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01 }
        };
        await _context.Users.AddAsync(providerUser);

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
        await _context.SchoolDistricts.AddRangeAsync(districts);

        // Create provider
        var provider = new Provider
        {
            Id = 1001,
            ProviderUserId = 999, // Points to User.Id
            TitleId = 1,
            CreatedById = 999
        };
        await _context.Providers.AddAsync(provider);

        // Create provider-district associations (only for districts 1 and 2)
        var escAssignment = new ProviderEscAssignment
        {
            Id = 1001,
            ProviderId = 1001,
            StartDate = DateTime.UtcNow.AddMonths(-6),
            EndDate = null, // Active assignment
            Archived = false,
            CreatedById = 999
        };
        await _context.ProviderEscAssignments.AddAsync(escAssignment);

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
        await _context.ProviderEscSchoolDistricts.AddRangeAsync(providerEscs);

        await _context.SaveChangesAsync();

        // Act
        var response = await _client.DistrictsAsync();

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
        SetAuthorizationHeader(UserRoleIds.Provider, "2", "Provider User");

        // Create provider user
        var providerUser = new User 
        { 
            Id = 999, 
            Email = "provider@test.com",
            FirstName = "Provider",
            LastName = "User",
            AuthUserId = 2, // This matches the JWT token AuthUserId
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01 }
        };
        await _context.Users.AddAsync(providerUser);

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
        await _context.SchoolDistricts.AddRangeAsync(districts);

        // Create provider (but no associations)
        var provider = new Provider
        {
            Id = 1001,
            ProviderUserId = 999, // Points to User.Id
            TitleId = 1,
            CreatedById = 999
        };
        await _context.Providers.AddAsync(provider);

        await _context.SaveChangesAsync();

        // Act
        var response = await _client.DistrictsAsync();

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
        SetAuthorizationHeader(UserRoleIds.SchoolDistrictAdmin, "3", "District Admin User");

        // Create district admin user
        var districtAdminUser = new User 
        { 
            Id = 1000, 
            Email = "districtadmin@test.com",
            FirstName = "District",
            LastName = "Admin",
            AuthUserId = 3, // This matches the JWT token AuthUserId,
            SchoolDistrictId = 1001,
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02 }
        };
        await _context.Users.AddAsync(districtAdminUser);

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
        await _context.SchoolDistricts.AddRangeAsync(districts);

        await _context.SaveChangesAsync();

        // Act
        var response = await _client.DistrictsAsync();

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
        SetAuthorizationHeader(UserRoleIds.SchoolDistrictAdmin, "3", "District Admin User");

        // Create district admin user
        var districtAdminUser = new User 
        { 
            Id = 1000, 
            Email = "districtadmin@test.com",
            FirstName = "District",
            LastName = "Admin",
            AuthUserId = 3, // This matches the JWT token AuthUserId
            Version = new byte[8] { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02 }
        };
        await _context.Users.AddAsync(districtAdminUser);

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
        await _context.SchoolDistricts.AddRangeAsync(districts);

        await _context.SaveChangesAsync();

        // Act
        var response = await _client.DistrictsAsync();

        // Assert
        response.Should().NotBeNull();
        response.Success.Should().BeTrue();
        response.Records.Should().BeEmpty();
        response.Errors.Should().BeEmpty();
    }

    public override void Dispose()
    {
        _scope.Dispose();
        _context.Dispose();
        base.Dispose();
    }
} 