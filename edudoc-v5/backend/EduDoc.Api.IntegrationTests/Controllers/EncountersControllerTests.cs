using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.EF.Models;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using EduDoc.Api.EF;
using EduDoc.Api.Infrastructure.Responses;
using EduDocV5Client;
using EduDoc.Api.IntegrationTests.TestBase;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EncountersControllerTests : AuthorizedIntegrationTestBase
{
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public EncountersControllerTests(CustomWebApplicationFactory<global::Program> factory) : base(factory)
    {
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
    }

    [Fact]
    public async Task GetEncounterById_ShouldReturnEncounter_WhenEncounterExists()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);
        
        var encounterId = 1;
        var encounter = new Encounter { 
            Id = encounterId, 
            ServiceTypeId = 1,
            ProviderId = 1,
            CreatedById = 1,
            IsGroup = false,
            AdditionalStudents = 0,
            FromSchedule = true,
            Archived = false
        };

        await _context.Encounters.AddAsync(encounter);
        await _context.SaveChangesAsync();
        
        // Act
        var response = await _client.EncountersAsync(encounterId);

        // Assert
        response.Record.Should().NotBeNull();
        response.Record.Id.Should().Be(encounter.Id);
    }

    [Fact]
    public async Task GetEncounterById_ShouldReturnNotFound_WhenEncounterDoesNotExist()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);
        var encounterId = 999;

        // Act
        try
        {
            var response = await _client.EncountersAsync(encounterId);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            // Assert
            aix.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        }
    }

    [Fact]
    public async Task GetEncounterById_ShouldReturnUnauthorized_WhenNoTokenProvided()
    {
        // Arrange - No authorization header set
        var encounterId = 1;

        // Act & Assert
        try
        {
            await _client.EncountersAsync(encounterId);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }

    public override void Dispose()
    {
        _scope.Dispose();
        _context.Dispose();
        base.Dispose();
    }
} 