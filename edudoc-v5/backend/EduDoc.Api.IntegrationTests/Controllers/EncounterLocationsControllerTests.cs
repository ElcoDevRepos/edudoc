using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using EduDoc.Api.IntegrationTests.TestBase;
using Xunit;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EncounterLocationsControllerTests : AuthorizedIntegrationTestBase
{
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public EncounterLocationsControllerTests(CustomWebApplicationFactory<global::Program> factory) : base(factory)
    {
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_ReturnUnauthorized_When_NoTokenProvided()
    {
        // Act
        try
        {
            await _client.EncounterLocationsAsync();
            Assert.Fail("Should not have succeeded");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_ReturnLocations_When_ValidTokenProvided()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);
        var locations = new List<EncounterLocation>
        {
            new EncounterLocation { Id = 1, Name = "Main Campus" },
            new EncounterLocation { Id = 2, Name = "Remote Site" }
        };
        await _context.EncounterLocations.AddRangeAsync(locations);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.EncounterLocationsAsync();

        // Assert
        response.Count.Should().Be(2);
        response.Records.Should().Contain(x => x.Name == "Main Campus");
        response.Records.Should().Contain(x => x.Name == "Remote Site");
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_ReturnEmptyList_When_NoLocationsExist()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Provider);
        // No locations added

        // Act
        var response = await _client.EncounterLocationsAsync();

        // Assert
        response.Records.Should().BeEmpty();
        response.Count.Should().Be(0);
    }

    public override void Dispose()
    {
        _scope.Dispose();
        _context.Dispose();
        base.Dispose();
    }
} 