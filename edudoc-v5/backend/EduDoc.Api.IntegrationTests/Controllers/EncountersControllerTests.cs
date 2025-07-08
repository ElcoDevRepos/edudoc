using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.IntegrationTests.Infrastructure;
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

public class EncountersControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public EncountersControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
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
    public async Task GetEncounterById_ShouldReturnEncounter_WhenEncounterExists()
    {
        // Arrange
        await _testResources.TestDatabaseRepository.InsertProviderTitleAsync(new ProviderTitle()
        {
            Id = 1,
            Name = "Test Title",
            ServiceCodeId = 1,
        });

        await _testResources.TestDatabaseRepository.InsertProviderAsync(new Provider()
        {
            Id = 1,
            ProviderUserId = 1,
            TitleId = 1,
            ProviderEmploymentTypeId = 1,
            CreatedById = 1,
        });

        await _testResources.TestDatabaseRepository.InsertEncounterAsync(new Encounter
        {
            Id = 1,
            ServiceTypeId = 1,
            ProviderId = 1,
            CreatedById = 1,
            IsGroup = false,
            AdditionalStudents = 0,
            FromSchedule = true,
            Archived = false
        });

        // Act
        var response = await _testResources.GetAuthenticatedApiClient().EncountersAsync(1);

        // Assert
        response.Record.Should().NotBeNull();
        response.Record.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetEncounterById_ShouldReturnNotFound_WhenEncounterDoesNotExist()
    {
        // Act
        try
        {
            var response = await _testResources.GetAuthenticatedApiClient().EncountersAsync(1);
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
        // Act & Assert
        try
        {
            await _testResources.GetUnauthenticatedApiClient().EncountersAsync(1);
            Assert.Fail("Should not have made it here");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }
}