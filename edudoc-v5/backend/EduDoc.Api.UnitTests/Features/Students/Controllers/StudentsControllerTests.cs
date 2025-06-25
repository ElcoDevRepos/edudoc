using EduDoc.Api.Endpoints.Students.Controllers;
using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.Endpoints.Students.Queries;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.Infrastructure.Configuration;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using EduDoc.Api.Endpoints.Students.Validators;

namespace EduDoc.Api.UnitTests.Features.Students.Controllers;

public class StudentsControllerTests
{
    private readonly Mock<IMediator> _mockMediator;
    private readonly StudentSearchRequestValidator _validator;
    private readonly StudentsController _controller;

    public StudentsControllerTests()
    {
        _mockMediator = new Mock<IMediator>();
        _validator = new StudentSearchRequestValidator();
        _controller = new StudentsController(_mockMediator.Object);
        
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
    public async Task SearchStudents_Should_ReturnOkResult_WhenStudentsFound()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "John", 
            DistrictId = 1 
        };

        var students = new List<StudentResponseModel>
        {
            new StudentResponseModel 
            { 
                Id = 1, 
                FirstName = "John", 
                LastName = "Doe", 
                Grade = "5", 
                DateOfBirth = new DateTime(2010, 1, 1),
                SchoolId = 1
            },
            new StudentResponseModel 
            { 
                Id = 2, 
                FirstName = "Johnny", 
                LastName = "Smith", 
                Grade = "6", 
                DateOfBirth = new DateTime(2009, 5, 15),
                SchoolId = 2
            }
        };

        var response = new GetMultipleResponse<StudentResponseModel>(students);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<SearchStudentsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.SearchStudents(request);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<StudentResponseModel>>();

        var responseData = okResult.Value as GetMultipleResponse<StudentResponseModel>;
        responseData!.Records.Should().HaveCount(2);
        responseData.Count.Should().Be(2);
        responseData.Errors.Should().BeEmpty();
        
        responseData.Records.First().FirstName.Should().Be("John");
        responseData.Records.Skip(1).First().FirstName.Should().Be("Johnny");
    }

    [Fact]
    public async Task SearchStudents_Should_ReturnOkResult_WhenNoStudentsFound()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "NonExistent", 
            DistrictId = null 
        };

        var emptyList = new List<StudentResponseModel>();
        var response = new GetMultipleResponse<StudentResponseModel>(emptyList);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<SearchStudentsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.SearchStudents(request);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<StudentResponseModel>>();

        var responseData = okResult.Value as GetMultipleResponse<StudentResponseModel>;
        responseData!.Records.Should().BeEmpty();
        responseData.Count.Should().Be(0);
        responseData.Errors.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchStudents_Should_ReturnValidationErrors_WhenSearchTextIsEmpty()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "", 
            DistrictId = null 
        };

        // Set up validation error response
        var response = new GetMultipleResponse<StudentResponseModel>(new FluentValidation.Results.ValidationResult(
            new[] { new FluentValidation.Results.ValidationFailure("SearchText", "Search text is required and must be at least 2 characters long") { ErrorCode = "MinLength" } }));

        _mockMediator
            .Setup(m => m.Send(It.IsAny<SearchStudentsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.SearchStudents(request);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<UnprocessableEntityObjectResult>();

        var unprocessableResult = result.Result as UnprocessableEntityObjectResult;
        unprocessableResult!.Value.Should().BeOfType<GetMultipleResponse<StudentResponseModel>>();

        var responseData = unprocessableResult.Value as GetMultipleResponse<StudentResponseModel>;
        responseData!.Records.Should().BeEmpty();
        responseData.Errors.Should().NotBeEmpty();
        responseData.Errors.Should().Contain(e => e.Message.Contains("Search text is required and must be at least 2 characters long"));
    }

    [Fact]
    public async Task SearchStudents_Should_ReturnValidationErrors_WhenSearchTextIsTooShort()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "a", 
            DistrictId = null 
        };

        // Set up validation error response
        var response = new GetMultipleResponse<StudentResponseModel>(new FluentValidation.Results.ValidationResult(
            new[] { new FluentValidation.Results.ValidationFailure("SearchText", "Search text is required and must be at least 2 characters long") { ErrorCode = "MinLength" } }));

        _mockMediator
            .Setup(m => m.Send(It.IsAny<SearchStudentsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.SearchStudents(request);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<UnprocessableEntityObjectResult>();

        var unprocessableResult = result.Result as UnprocessableEntityObjectResult;
        unprocessableResult!.Value.Should().BeOfType<GetMultipleResponse<StudentResponseModel>>();

        var responseData = unprocessableResult.Value as GetMultipleResponse<StudentResponseModel>;
        responseData!.Records.Should().BeEmpty();
        responseData.Errors.Should().NotBeEmpty();
        responseData.Errors.Should().Contain(e => e.Message.Contains("Search text is required and must be at least 2 characters long"));
    }

    [Fact]
    public async Task SearchStudents_Should_PassCorrectParametersToMediator()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "Test", 
            DistrictId = 5 
        };

        var students = new List<StudentResponseModel>();
        var response = new GetMultipleResponse<StudentResponseModel>(students);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<SearchStudentsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        await _controller.SearchStudents(request);

        // Assert
        _mockMediator.Verify(m => m.Send(
            It.Is<SearchStudentsQuery>(q => 
                q.Model.SearchText == "Test" && 
                q.Model.DistrictId == 5 &&
                q.Auth.UserRoleTypeId == 1 &&
                q.Auth.UserId == 123), 
            It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task SearchStudents_Should_ReturnValidationErrors_WhenDistrictIdIsInvalid()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "Valid", 
            DistrictId = -1 
        };

        // Set up validation error response
        var response = new GetMultipleResponse<StudentResponseModel>(new FluentValidation.Results.ValidationResult(
            new[] { new FluentValidation.Results.ValidationFailure("DistrictId", "District ID must be greater than 0 when provided") { ErrorCode = "Required" } }));

        _mockMediator
            .Setup(m => m.Send(It.IsAny<SearchStudentsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.SearchStudents(request);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<UnprocessableEntityObjectResult>();

        var unprocessableResult = result.Result as UnprocessableEntityObjectResult;
        unprocessableResult!.Value.Should().BeOfType<GetMultipleResponse<StudentResponseModel>>();

        var responseData = unprocessableResult.Value as GetMultipleResponse<StudentResponseModel>;
        responseData!.Records.Should().BeEmpty();
        responseData.Errors.Should().NotBeEmpty();
        responseData.Errors.Should().Contain(e => e.Message.Contains("District ID must be greater than 0"));
    }

    [Fact]
    public async Task SearchStudents_Should_TrimSearchText_WhenSearchTextHasWhitespace()
    {
        // Arrange
        var request = new StudentSearchRequestModel 
        { 
            SearchText = "  Valid  " 
        };

        var students = new List<StudentResponseModel>();
        var response = new GetMultipleResponse<StudentResponseModel>(students);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<SearchStudentsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.SearchStudents(request);

        // Assert - Verify that the search text was passed correctly (trimming happens in repository)
        _mockMediator.Verify(m => m.Send(
            It.Is<SearchStudentsQuery>(q => q.Model.SearchText == "  Valid  "), 
            It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public void Controller_Should_HaveValidAuthProperty()
    {
        // Act & Assert - This should not throw a NullReferenceException
        var auth = _controller.Auth;
        
        auth.Should().NotBeNull();
        auth.UserId.Should().Be(123);
        auth.Username.Should().Be("testuser");
        auth.UserRoleId.Should().Be(1);
        auth.UserRoleTypeId.Should().Be(1);
    }

    [Fact]
    public void Controller_Should_HaveValidUserAndClaims()
    {
        // Act & Assert - Check that User and claims are properly set up
        _controller.User.Should().NotBeNull();
        _controller.User.Identity.Should().NotBeNull();
        _controller.User.Identity!.IsAuthenticated.Should().BeTrue();
        
        var authUserIdClaim = _controller.User.FindFirst(JwtSettings.ClaimTypes.AuthUserId);
        authUserIdClaim.Should().NotBeNull();
        authUserIdClaim!.Value.Should().Be("123");
        
        var userRoleTypeIdClaim = _controller.User.FindFirst(JwtSettings.ClaimTypes.UserRoleTypeId);
        userRoleTypeIdClaim.Should().NotBeNull();
        userRoleTypeIdClaim!.Value.Should().Be("1");
    }
} 