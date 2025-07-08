using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.IntegrationTests.Infrastructure;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EncounterLocationsControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public EncounterLocationsControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
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
    public async Task GetAllEncounterLocations_Should_ReturnUnauthorized_When_NoTokenProvided()
    {
        // Act
        try
        {
            await _testResources.GetUnauthenticatedApiClient().EncounterLocationsAsync();
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

        await _testResources.TestDatabaseRepository.InsertEncounterLocationsAsync(new List<EncounterLocation>
        {
            new EncounterLocation { Id = 1, Name = "Main Campus" },
            new EncounterLocation { Id = 2, Name = "Remote Site" }
        });

        // Act
        var response = await _testResources.GetAuthenticatedApiClient().EncounterLocationsAsync();

        // Assert
        response.Count.Should().Be(2);
        response.Records.Should().Contain(x => x.Name == "Main Campus");
        response.Records.Should().Contain(x => x.Name == "Remote Site");
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_ReturnEmptyList_When_NoLocationsExist()
    {
        // Arrange

        // No locations added

        // Act
        var response = await _testResources.GetAuthenticatedApiClient().EncounterLocationsAsync();

        // Assert
        response.Records.Should().BeEmpty();
        response.Count.Should().Be(0);
    }
} 