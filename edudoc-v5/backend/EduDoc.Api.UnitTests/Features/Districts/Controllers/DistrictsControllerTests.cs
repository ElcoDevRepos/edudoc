using EduDoc.Api.Endpoints.Districts.Controllers;
using EduDoc.Api.Endpoints.Districts.Models;
using EduDoc.Api.Endpoints.Districts.Queries;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.Infrastructure.Configuration;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace EduDoc.Api.UnitTests.Features.Districts.Controllers;

public class DistrictsControllerTests
{
    private readonly Mock<IMediator> _mockMediator;
    private readonly DistrictsController _controller;

    public DistrictsControllerTests()
    {
        _mockMediator = new Mock<IMediator>();
        _controller = new DistrictsController(_mockMediator.Object);
        
        // Setup mock user claims for BaseApiController
        var claims = new List<Claim>
        {
            new Claim(JwtSettings.ClaimTypes.AuthUserId, "123"),
            new Claim(JwtSettings.ClaimTypes.AuthUsername, "testuser"),
            new Claim(JwtSettings.ClaimTypes.UserRoleId, "1"),
            new Claim(JwtSettings.ClaimTypes.UserRoleTypeId, "1") // Admin role
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnOk_When_DistrictsExist()
    {
        // Arrange
        var districts = new List<DistrictResponseModel>
        {
            new DistrictResponseModel 
            { 
                Id = 1, 
                Name = "Test District 1", 
                Code = "TD1",
                Einnumber = "123456789",
                Irnnumber = "IRN001",
                Npinumber = "NPI001",
                ProviderNumber = "PROV001",
                ActiveStatus = true,
                Archived = false
            },
            new DistrictResponseModel 
            { 
                Id = 2, 
                Name = "Test District 2", 
                Code = "TD2",
                Einnumber = "987654321",
                Irnnumber = "IRN002",
                Npinumber = "NPI002",
                ProviderNumber = "PROV002",
                ActiveStatus = true,
                Archived = false
            }
        };

        var response = new GetMultipleResponse<DistrictResponseModel>(districts);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<GetAllDistrictsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllDistricts();

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<DistrictResponseModel>>();

        var responseData = okResult.Value as GetMultipleResponse<DistrictResponseModel>;
        responseData!.Records.Should().HaveCount(2);
        responseData.Count.Should().Be(2);
        responseData.Errors.Should().BeEmpty();
        
        responseData.Records.First().Name.Should().Be("Test District 1");
        responseData.Records.Skip(1).First().Name.Should().Be("Test District 2");
    }

    [Fact]
    public async Task GetAllDistricts_Should_ReturnOkWithEmptyList_When_NoDistrictsExist()
    {
        // Arrange
        var emptyList = new List<DistrictResponseModel>();
        var response = new GetMultipleResponse<DistrictResponseModel>(emptyList);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<GetAllDistrictsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllDistricts();

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<DistrictResponseModel>>();

        var responseData = okResult.Value as GetMultipleResponse<DistrictResponseModel>;
        responseData!.Records.Should().BeEmpty();
        responseData.Count.Should().Be(0);
        responseData.Errors.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllDistricts_Should_PassCorrectParametersToMediator()
    {
        // Arrange
        var districts = new List<DistrictResponseModel>
        {
            new DistrictResponseModel 
            { 
                Id = 1, 
                Name = "Test District", 
                Code = "TD1",
                Einnumber = "123456789",
                Irnnumber = "IRN001",
                Npinumber = "NPI001",
                ProviderNumber = "PROV001",
                ActiveStatus = true,
                Archived = false
            }
        };

        var response = new GetMultipleResponse<DistrictResponseModel>(districts);

        GetAllDistrictsQuery capturedQuery = null!;
        _mockMediator
            .Setup(m => m.Send(It.IsAny<GetAllDistrictsQuery>(), It.IsAny<CancellationToken>()))
            .Callback<IRequest<GetMultipleResponse<DistrictResponseModel>>, CancellationToken>((query, token) => capturedQuery = (GetAllDistrictsQuery)query)
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllDistricts();

        // Assert
        result.Should().NotBeNull();
        capturedQuery.Should().NotBeNull();
        capturedQuery.CurrentUserRoleType.Should().Be(1); // Admin role type
        capturedQuery.CurrentUserId.Should().Be(123); // Auth user ID from claims
    }

    [Fact]
    public async Task GetAllDistricts_Should_PassCorrectParametersForProviderRole()
    {
        // Arrange - Set up provider role claims
        var claims = new List<Claim>
        {
            new Claim(JwtSettings.ClaimTypes.AuthUserId, "456"),
            new Claim(JwtSettings.ClaimTypes.AuthUsername, "provideruser"),
            new Claim(JwtSettings.ClaimTypes.UserRoleId, "2"),
            new Claim(JwtSettings.ClaimTypes.UserRoleTypeId, "2") // Provider role
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };

        var districts = new List<DistrictResponseModel>
        {
            new DistrictResponseModel 
            { 
                Id = 1, 
                Name = "Provider District", 
                Code = "PD1",
                Einnumber = "123456789",
                Irnnumber = "IRN001",
                Npinumber = "NPI001",
                ProviderNumber = "PROV001",
                ActiveStatus = true,
                Archived = false
            }
        };

        var response = new GetMultipleResponse<DistrictResponseModel>(districts);

        GetAllDistrictsQuery capturedQuery = null!;
        _mockMediator
            .Setup(m => m.Send(It.IsAny<GetAllDistrictsQuery>(), It.IsAny<CancellationToken>()))
            .Callback<IRequest<GetMultipleResponse<DistrictResponseModel>>, CancellationToken>((query, token) => capturedQuery = (GetAllDistrictsQuery)query)
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllDistricts();

        // Assert
        result.Should().NotBeNull();
        capturedQuery.Should().NotBeNull();
        capturedQuery.CurrentUserRoleType.Should().Be(2); // Provider role type
        capturedQuery.CurrentUserId.Should().Be(456); // Auth user ID from claims
    }

    [Fact]
    public async Task GetAllDistricts_Should_PassCorrectParametersForDistrictAdminRole()
    {
        // Arrange - Set up district admin role claims
        var claims = new List<Claim>
        {
            new Claim(JwtSettings.ClaimTypes.AuthUserId, "789"),
            new Claim(JwtSettings.ClaimTypes.AuthUsername, "districtadmin"),
            new Claim(JwtSettings.ClaimTypes.UserRoleId, "3"),
            new Claim(JwtSettings.ClaimTypes.UserRoleTypeId, "3") // District Admin role
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };

        var districts = new List<DistrictResponseModel>
        {
            new DistrictResponseModel 
            { 
                Id = 1, 
                Name = "Admin District", 
                Code = "AD1",
                Einnumber = "123456789",
                Irnnumber = "IRN001",
                Npinumber = "NPI001",
                ProviderNumber = "PROV001",
                ActiveStatus = true,
                Archived = false
            }
        };

        var response = new GetMultipleResponse<DistrictResponseModel>(districts);

        GetAllDistrictsQuery capturedQuery = null!;
        _mockMediator
            .Setup(m => m.Send(It.IsAny<GetAllDistrictsQuery>(), It.IsAny<CancellationToken>()))
            .Callback<IRequest<GetMultipleResponse<DistrictResponseModel>>, CancellationToken>((query, token) => capturedQuery = (GetAllDistrictsQuery)query)
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllDistricts();

        // Assert
        result.Should().NotBeNull();
        capturedQuery.Should().NotBeNull();
        capturedQuery.CurrentUserRoleType.Should().Be(3); // District Admin role type
        capturedQuery.CurrentUserId.Should().Be(789); // Auth user ID from claims
    }

    [Fact]
    public void Controller_Should_HaveValidAuthProperty()
    {
        // Arrange & Act
        var auth = _controller.Auth;

        // Assert
        auth.Should().NotBeNull();
        auth.UserId.Should().Be(123);
        auth.Username.Should().Be("testuser");
        auth.UserRoleId.Should().Be(1);
        auth.UserRoleTypeId.Should().Be(1);
    }

    [Fact]
    public void Controller_Should_HaveValidUserAndClaims()
    {
        // Arrange & Act
        var user = _controller.User;

        // Assert
        user.Should().NotBeNull();
        user.Identity.Should().NotBeNull();
        user.Identity!.IsAuthenticated.Should().BeTrue();
        user.Claims.Should().HaveCount(4);
        user.Claims.Should().Contain(c => c.Type == JwtSettings.ClaimTypes.AuthUserId && c.Value == "123");
        user.Claims.Should().Contain(c => c.Type == JwtSettings.ClaimTypes.AuthUsername && c.Value == "testuser");
        user.Claims.Should().Contain(c => c.Type == JwtSettings.ClaimTypes.UserRoleId && c.Value == "1");
        user.Claims.Should().Contain(c => c.Type == JwtSettings.ClaimTypes.UserRoleTypeId && c.Value == "1");
    }
} 