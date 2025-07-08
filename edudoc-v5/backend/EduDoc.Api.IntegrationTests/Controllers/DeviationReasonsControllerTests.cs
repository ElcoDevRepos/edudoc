using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.IntegrationTests.Infrastructure;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Net;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class DeviationReasonsControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public DeviationReasonsControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
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
    public async Task GetAllDeviationReasons_Should_ReturnUnauthorized_When_NoTokenProvided()
    {
        // Act
        try
        {
            await _testResources.GetUnauthenticatedApiClient().DeviationReasonsAsync();
            Assert.Fail("Should not have succeeded");
        }
        catch (ApiException aix)
        {
            aix.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }
    }

    [Fact]
    public async Task GetAllDeviationReasons_Should_ReturnReasons_When_ValidTokenProvided()
    {
        // Arrange
        await _testResources.TestDatabaseRepository.InsertStudentDeviationReasonsAsync(new List<StudentDeviationReason>
        {
            new StudentDeviationReason { Id = 1, Name = "Reason 1" },
            new StudentDeviationReason { Id = 2, Name = "Reason 2" }
        });

        // Act
        var result = await _testResources.GetAuthenticatedApiClient().DeviationReasonsAsync();

        // Assert
        result.Should().NotBeNull();
        result.Records.Should().HaveCount(2);
        result.Records.Should().Contain(x => x.Name == "Reason 1");
        result.Records.Should().Contain(x => x.Name == "Reason 2");
    }

    [Fact]
    public async Task GetAllDeviationReasons_Should_ReturnEmptyList_When_NoReasonsExist()
    {
        // Arrange
        // No Reasons added

        // Act
        var result = await _testResources.GetAuthenticatedApiClient().DeviationReasonsAsync();

        // Assert
        result.Should().NotBeNull();
        result.Records.Should().BeEmpty();
    }
} 