using Azure;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.EvaluationTypes.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EvaluationTypesControllerTests : AuthorizedIntegrationTestBase
{
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public EvaluationTypesControllerTests(CustomWebApplicationFactory<global::Program> factory) : base(factory)
    {
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
    }

    [Fact]
    public async Task GetAllEvaluationTypes_ShouldReturnUnauthorized_WhenNoTokenProvided()
    {
        // Act
        try
        {
            var response = await _client.EvaluationTypesAsync();
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
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin); // Any valid user should work with just [Authorize]
        
        var evaluationTypes = new List<EvaluationType>
        {
            new EvaluationType { Id = 1, Name = "Psychological Evaluation" },
            new EvaluationType { Id = 2, Name = "Speech Therapy Evaluation" },
            new EvaluationType { Id = 3, Name = "Occupational Therapy Evaluation" }
        };

        await _context.EvaluationTypes.AddRangeAsync(evaluationTypes);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.EvaluationTypesAsync();

        // Assert
        response.Count.Should().Be(3);

        response.Records.Should().Contain(et => et.Name == "Psychological Evaluation");
        response.Records.Should().Contain(et => et.Name == "Speech Therapy Evaluation");
        response.Records.Should().Contain(et => et.Name == "Occupational Therapy Evaluation");
    }

    [Fact]
    public async Task GetAllEvaluationTypes_ShouldReturnEmptyList_WhenNoEvaluationTypesExist()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Provider); // Any valid user should work with just [Authorize]

        // Act
        var response = await _client.EvaluationTypesAsync();

        // Assert
        response.Records.Should().BeEmpty();
    }

    public override void Dispose()
    {
        _scope.Dispose();
        _context.Dispose();
        base.Dispose();
    }
} 