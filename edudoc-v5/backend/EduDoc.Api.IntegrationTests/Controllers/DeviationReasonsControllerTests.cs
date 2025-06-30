using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using EduDoc.Api.IntegrationTests.TestBase;
using EduDocV5Client;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Net;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;
using Xunit;

namespace EduDoc.Api.IntegrationTests.Controllers;

public class DeviationReasonsControllerTests : AuthorizedIntegrationTestBase
{
    private readonly IServiceScope _scope;
    private readonly EdudocSqlContext _context;

    public DeviationReasonsControllerTests(CustomWebApplicationFactory<global::Program> factory) : base(factory)
    {
        _scope = factory.Services.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
    }

    [Fact]
    public async Task GetAllDeviationReasons_Should_ReturnUnauthorized_When_NoTokenProvided()
    {
        // Act
        try
        {
            await _client.DeviationReasonsAsync();
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
        SetAuthorizationHeader(UserRoleIds.Admin);
        var reasons = new List<StudentDeviationReason>
        {
            new StudentDeviationReason { Id = 1, Name = "Reason 1" },
            new StudentDeviationReason { Id = 2, Name = "Reason 2" }
        };
        await _context.StudentDeviationReasons.AddRangeAsync(reasons);
        await _context.SaveChangesAsync();

        // Act
        var result = await _client.DeviationReasonsAsync();

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
        SetAuthorizationHeader(UserRoleIds.Admin);
        // No Reasons added

        // Act
        var result = await _client.DeviationReasonsAsync();

        // Assert
        result.Should().NotBeNull();
        result.Records.Should().BeEmpty();
    }

    public override void Dispose()
    {
        _scope.Dispose();
        _context.Dispose();
        base.Dispose();
    }
} 