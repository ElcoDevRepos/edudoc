using Azure;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.EvaluationTypes.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.IntegrationTests.Infrastructure;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EvaluationTypesControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public EvaluationTypesControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
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
    public async Task GetAllEvaluationTypes_ShouldReturnUnauthorized_WhenNoTokenProvided()
    {
        // Act
        try
        {
            await _testResources.GetUnauthenticatedApiClient().GetAllEvaluationTypesAsync();
            Assert.Fail("Should not have succeeded");
        }
        catch (ApiException aix)
        {
            // Assert
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }

    [Fact]
    public async Task GetAllEvaluationTypes_ShouldReturnEvaluationTypes_WhenValidTokenProvided()
    {
        // Act
        var response = await _testResources.GetAuthenticatedApiClient().GetAllEvaluationTypesAsync();

        // Assert
        response.Records.Should().NotBeNull();
        response.Records.Should().HaveCount(2);
        response.Records.Should().Contain(et => et.Name == "Initial Evaluation/Assessment");
        response.Records.Should().Contain(et => et.Name == "Re-evaluation/Re-assessment");
    }
}
