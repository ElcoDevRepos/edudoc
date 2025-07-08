using EduDoc.Api.Endpoints.Districts.Models;
using EduDoc.Api.Endpoints.Districts.Queries;
using EduDoc.Api.Endpoints.Encounters.Controllers;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Endpoints.Encounters.Queries;
using EduDoc.Api.Infrastructure.Models;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using Xunit;

namespace EduDoc.Api.UnitTests.Features.Encounters.Controllers
{
    public class EncountersControllerTests
    {
        private readonly Mock<IMediator> _mediatorMock;
        private readonly EncountersController _controller;

        public EncountersControllerTests()
        {
            _mediatorMock = new Mock<IMediator>();
            _controller = new EncountersController(_mediatorMock.Object);
            
            // Setup HttpContext for BaseApiController
            var httpContext = new DefaultHttpContext();
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim("AuthUserId", "1"),
                new Claim("AuthUsername", "testuser"),
                new Claim("UserRoleId", "1"),
                new Claim("UserRoleTypeId", "1")
            }));
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };
        }

        [Fact]
        public async Task GetEncounterById_Should_ReturnOk_When_EncounterExists()
        {
            // Arrange
            var encounterId = 1;
            var encounterResponse = new EncounterResponseModel
            {
                Id = encounterId,
                ProviderId = 1,
                ServiceTypeId = Constants.ServiceTypeId.TreatmentTherapy,
                EncounterDate = DateTime.Now,
                IsGroup = false,
                AdditionalStudents = 0,
                FromSchedule = true,
                Archived = false
            };

            _mediatorMock.Setup(m => m.Send(It.IsAny<GetEncounterByIdQuery>(), default))
                .ReturnsAsync(encounterResponse);

            // Act
            var result = await _controller.GetEncounterById(encounterId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<GetSingleResponse<EncounterResponseModel>>(okResult.Value);
            Assert.Equal(encounterId, response.Record?.Id);
        }

        [Fact]
        public async Task GetEncounterById_Should_ReturnNotFound_When_EncounterDoesNotExist()
        {
            // Arrange
            var encounterId = 999;
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetEncounterByIdQuery>(), default))
                .ReturnsAsync(null as EncounterResponseModel);

            // Act
            var result = await _controller.GetEncounterById(encounterId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.IsType<GetSingleResponse<EncounterResponseModel>>(notFoundResult.Value);
        }

        [Fact]
        public async Task GetEncounterById_Should_CallMediator_WithCorrectQuery()
        {
            // Arrange
            var encounterId = 1;
            _mediatorMock.Setup(m => m.Send(It.IsAny<GetEncounterByIdQuery>(), default))
             .ReturnsAsync(null as EncounterResponseModel);

            // Act
            await _controller.GetEncounterById(encounterId);

            // Assert
            _mediatorMock.Verify(m => m.Send(It.Is<GetEncounterByIdQuery>(q => q.Id == encounterId), default), Times.Once);
        }
    }
} 