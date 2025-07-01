using EduDoc.Api.Endpoints.EncounterStatuses.Controllers;
using EduDoc.Api.Endpoints.EncounterStatuses.Models;
using EduDoc.Api.Endpoints.EncounterStatuses.Queries;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System.Security.Claims;
using FluentAssertions;

namespace EduDoc.Api.UnitTests.Features.EncounterStatuses.Controllers
{
    public class EncounterStatusesControllerTests
    {
        private readonly Mock<IMediator> _mediatorMock;
        private readonly EncounterStatusesController _controller;

        public EncounterStatusesControllerTests()
        {
            _mediatorMock = new Mock<IMediator>();
            _controller = new EncounterStatusesController(_mediatorMock.Object);
        }

        [Fact]
        public async Task GetAllEncounterStatuses_Should_ReturnOk_When_StatusesExist()
        {
            // Arrange
            var statuses = new List<EncounterStatusResponseModel>
            {
                new EncounterStatusResponseModel { Id = 1, Name = "Draft", IsAuditable = true, IsBillable = false, ForReview = false, HpcadminOnly = false },
                new EncounterStatusResponseModel { Id = 2, Name = "Submitted", IsAuditable = true, IsBillable = true, ForReview = true, HpcadminOnly = false }
            };
            var response = new GetMultipleResponse<EncounterStatusResponseModel>(statuses);
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterStatusesQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetAllEncounterStatuses();

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull(); 
            okResult!.Value.Should().BeOfType<GetMultipleResponse<EncounterStatusResponseModel>>();
            var value = okResult!.Value as GetMultipleResponse<EncounterStatusResponseModel>;
            value.Should().NotBeNull();
            value!.Records.Should().HaveCount(2);
            value.Records[0].Name.Should().Be("Draft");
            value.Records[1].Name.Should().Be("Submitted");
        }

        [Fact]
        public async Task GetAllEncounterStatuses_Should_ReturnOkWithEmptyList_When_NoStatusesExist()
        {
            // Arrange
            var response = new GetMultipleResponse<EncounterStatusResponseModel>(new List<EncounterStatusResponseModel>());
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterStatusesQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.GetAllEncounterStatuses();

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
            var okResult = result.Result as OkObjectResult; 
            okResult!.Value.Should().BeOfType<GetMultipleResponse<EncounterStatusResponseModel>>();
            okResult.Should().NotBeNull();
            var value = okResult!.Value as GetMultipleResponse<EncounterStatusResponseModel>;
            value.Should().NotBeNull();
            value!.Records.Should().BeEmpty();
        }

        [Fact]
        public async Task GetAllEncounterStatuses_Should_CallMediatorOnce_When_Invoked()
        {
            // Arrange
            var response = new GetMultipleResponse<EncounterStatusResponseModel>(new List<EncounterStatusResponseModel>());
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterStatusesQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(response);

            // Act
            await _controller.GetAllEncounterStatuses();

            // Assert
            _mediatorMock.Verify(m => m.Send(It.IsAny<GetAllEncounterStatusesQuery>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task GetAllEncounterStatuses_Should_ThrowException_When_MediatorThrows()
        {
            // Arrange
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetAllEncounterStatusesQuery>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new System.Exception("Mediator error"));

            // Act
            var act = async () => await _controller.GetAllEncounterStatuses();

            // Assert
            await act.Should().ThrowAsync<System.Exception>().WithMessage("Mediator error");
        }
    }
} 