using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.EncounterLocations.Controllers;
using EduDoc.Api.Endpoints.EncounterLocations.Models;
using EduDoc.Api.Endpoints.EncounterLocations.Queries;
using EduDoc.Api.Infrastructure.Responses;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EduDoc.Api.UnitTests.Features.EncounterLocations.Controllers;

public class EncounterLocationsControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly EncounterLocationsController _controller;

    public EncounterLocationsControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _controller = new EncounterLocationsController(_mediatorMock.Object);
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_ReturnOk_When_LocationsExist()
    {
        // Arrange
        var locations = new List<EncounterLocationResponseModel>
        {
            new EncounterLocationResponseModel { Id = 1, Name = "Location 1" },
            new EncounterLocationResponseModel { Id = 2, Name = "Location 2" }
        };
        var response = new GetMultipleResponse<EncounterLocationResponseModel>(locations);
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterLocationsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllEncounterLocations();

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<EncounterLocationResponseModel>>();
        var value = okResult.Value as GetMultipleResponse<EncounterLocationResponseModel>;
        value!.Count.Should().Be(2);
        value.Success.Should().BeTrue();
        value.Records.Should().ContainSingle(x => x.Name == "Location 1");
        value.Records.Should().ContainSingle(x => x.Name == "Location 2");
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_ReturnOkWithEmptyList_When_NoLocationsExist()
    {
        // Arrange
        var response = new GetMultipleResponse<EncounterLocationResponseModel>(new List<EncounterLocationResponseModel>());
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterLocationsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetAllEncounterLocations();

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeOfType<GetMultipleResponse<EncounterLocationResponseModel>>();
        var value = okResult.Value as GetMultipleResponse<EncounterLocationResponseModel>;
        value!.Count.Should().Be(0);
        value.Success.Should().BeTrue();
        value.Records.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_CallMediatorOnce_When_Invoked()
    {
        // Arrange
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterLocationsQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new GetMultipleResponse<EncounterLocationResponseModel>(new List<EncounterLocationResponseModel>()));

        // Act
        await _controller.GetAllEncounterLocations();

        // Assert
        _mediatorMock.Verify(m => m.Send(It.IsAny<GetAllEncounterLocationsQuery>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetAllEncounterLocations_Should_ThrowException_When_MediatorThrows()
    {
        // Arrange
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterLocationsQuery>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new System.Exception("Test exception"));

        // Act
        var act = async () => await _controller.GetAllEncounterLocations();

        // Assert
        await act.Should().ThrowAsync<System.Exception>().WithMessage("Test exception");
    }
} 