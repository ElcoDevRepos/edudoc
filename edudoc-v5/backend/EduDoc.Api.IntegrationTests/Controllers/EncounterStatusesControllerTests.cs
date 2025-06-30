using Azure;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EncounterStatusesControllerTests : AuthorizedIntegrationTestBase
{
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public EncounterStatusesControllerTests(CustomWebApplicationFactory<global::Program> factory) : base(factory)
    {
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
    }

    [Fact]
    public async Task GetAllEncounterStatuses_Should_ReturnUnauthorized_When_NoTokenProvided()
    {        
        // Act
        try
        {
            await _client.EncounterStatusesAsync();
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
        SetAuthorizationHeader(UserRoleIds.Admin);
        var statuses = new List<EncounterStatus>
        {
            new EncounterStatus { Id = 1, Name = "Draft", IsAuditable = true, IsBillable = false, ForReview = false, HpcadminOnly = false },
            new EncounterStatus { Id = 2, Name = "Submitted", IsAuditable = true, IsBillable = true, ForReview = true, HpcadminOnly = false }
        };
        await _context.EncounterStatuses.AddRangeAsync(statuses);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.EncounterStatusesAsync();

        // Assert
        response.Should().NotBeNull();
        response.Records.Should().HaveCount(2);
        response.Records.Should().Contain(x => x.Name == "Draft");
        response.Records.Should().Contain(x => x.Name == "Submitted");
    }

    [Fact]
    public async Task GetAllEncounterStatuses_Should_ReturnEmptyList_When_NoStatusesExist()
    {
        // Arrange
        SetAuthorizationHeader(UserRoleIds.Admin);        
        // No statuses added

        // Act
        var response = await _client.EncounterStatusesAsync();

        // Assert
        response.Should().NotBeNull();
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