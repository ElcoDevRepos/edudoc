using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.EF.Models;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using EduDoc.Api.EF;
using EduDoc.Api.Infrastructure.Responses;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class EncountersControllerTests : IClassFixture<CustomWebApplicationFactory<global::Program>>, IDisposable
{
    private readonly HttpClient _client;
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public EncountersControllerTests(CustomWebApplicationFactory<global::Program> factory)
    {
        _client = factory.CreateClient();
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
        _context.Database.EnsureCreated();
    }

    [Fact]
    public async Task GetEncounterById_ShouldReturnEncounter_WhenEncounterExists()
    {
        // Arrange
        var encounterId = 1;
        var encounter = new Encounter { 
            Id = encounterId, 
            ServiceTypeId = 1,
            ProviderId = 1  // Required field
        };

        await _context.Encounters.AddAsync(encounter);
        await _context.SaveChangesAsync();
        
        // Act
        var response = await _client.GetAsync($"/api/encounters/{encounterId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var responseData = await response.Content.ReadFromJsonAsync<GetSingleResponse<EncounterResponseModel>>();
        responseData.Should().NotBeNull();
        responseData!.Record.Should().NotBeNull();
        responseData.Record.Id.Should().Be(encounter.Id);
    }

    [Fact]
    public async Task GetEncounterById_ShouldReturnNotFound_WhenEncounterDoesNotExist()
    {
        // Arrange
        var encounterId = 999;

        // Act
        var response = await _client.GetAsync($"/api/encounters/{encounterId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    public void Dispose()
    {
        _scope.Dispose();
        _context.Dispose();
    }
} 