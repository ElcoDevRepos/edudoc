using Azure;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.IntegrationTests.Infrastructure;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EncounterStatusesControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public EncounterStatusesControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
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
    public async Task GetAllEncounterStatuses_Should_ReturnUnauthorized_When_NoTokenProvided()
    {        
        // Act
        try
        {
            await _testResources.GetUnauthenticatedApiClient().EncounterStatusesAsync();
            Assert.Fail("Should not have succeeded");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }

    [Fact]
    public async Task GetAllEncounterStatuses_Should_ReturnStatuses_When_ValidTokenProvided()
    {
        // Arrange
        // Records already exist in test db

        // Act
        var response = await _testResources.GetAuthenticatedApiClient().EncounterStatusesAsync();

        // Assert
        response.Should().NotBeNull();
        response.Records.Should().HaveCount(37);
        response.Records.Should().Contain(x => x.Name == "New");
        response.Records.Should().Contain(x => x.Name == "Service Unit Rule Violation");
    }
} 