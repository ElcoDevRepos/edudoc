using EduDoc.Api.Endpoints.DeviationReasons.Controllers;
using EduDoc.Api.Endpoints.DeviationReasons.Models;
using EduDoc.Api.Endpoints.DeviationReasons.Queries;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace EduDoc.Api.UnitTests.Features.DeviationReasons.Controllers
{
    public class DeviationReasonsControllerTests
    {
        private readonly Mock<IMediator> _mediatorMock;
        private readonly DeviationReasonsController _controller;

        public DeviationReasonsControllerTests()
        {
            _mediatorMock = new Mock<IMediator>();
            _controller = new DeviationReasonsController(_mediatorMock.Object);
        }

        [Fact]
        public async Task GetAllDeviationReasons_Should_ReturnOk_When_ReasonsExist()
        {
            // Arrange
            var reasons = new List<DeviationReasonResponseModel>
            {
                new DeviationReasonResponseModel { Id = 1, Name = "Reason 1" },
                new DeviationReasonResponseModel { Id = 2, Name = "Reason 2" }
            };
            var response = new GetMultipleResponse<DeviationReasonResponseModel>(reasons);
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllDeviationReasonsQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetAllDeviationReasons();

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeOfType<GetMultipleResponse<DeviationReasonResponseModel>>();
            var value = okResult!.Value as GetMultipleResponse<DeviationReasonResponseModel>;
            value.Should().NotBeNull();
            value!.Records.Should().HaveCount(2);
            value.Records[0].Name.Should().Be("Reason 1");
            value.Records[1].Name.Should().Be("Reason 2");
        }

        [Fact]
        public async Task GetAllDeviationReasons_Should_ReturnOkWithEmptyList_When_NoReasonsExist()
        {
            // Arrange
            var response = new GetMultipleResponse<DeviationReasonResponseModel>(new List<DeviationReasonResponseModel>());
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllDeviationReasonsQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetAllDeviationReasons();

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeOfType<GetMultipleResponse<DeviationReasonResponseModel>>();
            var value = okResult!.Value as GetMultipleResponse<DeviationReasonResponseModel>;
            value.Should().NotBeNull();
            value!.Records.Should().BeEmpty();
        }

        [Fact]
        public async Task GetAllDeviationReasons_Should_CallMediatorOnce_When_Invoked()
        {
            // Arrange
            var response = new GetMultipleResponse<DeviationReasonResponseModel>(new List<DeviationReasonResponseModel>());
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllDeviationReasonsQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(response);

            // Act
            await _controller.GetAllDeviationReasons();

            // Assert
            _mediatorMock.Verify(m => m.Send(It.IsAny<GetAllDeviationReasonsQuery>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetAllDeviationReasons_Should_ThrowException_When_MediatorThrows()
        {
            // Arrange
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllDeviationReasonsQuery>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new System.Exception("Mediator error"));

            // Act
            var act = async () => await _controller.GetAllDeviationReasons();

            // Assert
            await act.Should().ThrowAsync<System.Exception>().WithMessage("Mediator error");
        }
    }
} 