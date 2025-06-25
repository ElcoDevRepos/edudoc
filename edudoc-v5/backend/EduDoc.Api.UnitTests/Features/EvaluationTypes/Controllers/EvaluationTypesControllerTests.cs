using EduDoc.Api.Endpoints.EvaluationTypes.Controllers;
using EduDoc.Api.Endpoints.EvaluationTypes.Models;
using EduDoc.Api.Endpoints.EvaluationTypes.Queries;
using EduDoc.Api.Infrastructure.Responses;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace EduDoc.Api.UnitTests.Features.EvaluationTypes.Controllers;

public class EvaluationTypesControllerTests
{
    private readonly Mock<IMediator> _mockMediator;
    private readonly EvaluationTypesController _controller;

    public EvaluationTypesControllerTests()
    {
        _mockMediator = new Mock<IMediator>();
        _controller = new EvaluationTypesController(_mockMediator.Object);
    }

    [Fact]
    public async Task GetAllEvaluationTypes_Should_ReturnOkResult_WhenEvaluationTypesExist()
    {
        // Arrange
        var evaluationTypes = new List<EvaluationTypeResponseModel>
        {
            new EvaluationTypeResponseModel { Id = 1, Name = "Psychological Evaluation" },
            new EvaluationTypeResponseModel { Id = 2, Name = "Speech Therapy Evaluation" }
        };

        var response = new GetMultipleResponse<EvaluationTypeResponseModel>(evaluationTypes);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<GetAllEvaluationTypesQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllEvaluationTypes();

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<EvaluationTypeResponseModel>>();

        var actualResponse = okResult.Value as GetMultipleResponse<EvaluationTypeResponseModel>;
        actualResponse!.Records.Should().HaveCount(2);
        actualResponse.Count.Should().Be(2);
        actualResponse.Errors.Should().BeEmpty();
        
        actualResponse.Records[0].Id.Should().Be(1);
        actualResponse.Records[0].Name.Should().Be("Psychological Evaluation");
        
        actualResponse.Records[1].Id.Should().Be(2);
        actualResponse.Records[1].Name.Should().Be("Speech Therapy Evaluation");
    }

    [Fact]
    public async Task GetAllEvaluationTypes_Should_ReturnOkResult_WhenNoEvaluationTypesExist()
    {
        // Arrange
        var emptyList = new List<EvaluationTypeResponseModel>();
        var response = new GetMultipleResponse<EvaluationTypeResponseModel>(emptyList);

        _mockMediator
            .Setup(m => m.Send(It.IsAny<GetAllEvaluationTypesQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllEvaluationTypes();

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<EvaluationTypeResponseModel>>();

        var actualResponse = okResult.Value as GetMultipleResponse<EvaluationTypeResponseModel>;
        actualResponse!.Records.Should().BeEmpty();
        actualResponse.Count.Should().Be(0);
        actualResponse.Errors.Should().BeEmpty();
    }
} 