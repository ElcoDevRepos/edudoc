using EduDoc.Api.Endpoints.Encounters.Mappers;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Endpoints.Encounters.Queries;
using EduDoc.Api.Endpoints.Encounters.Repositories;
using EduDoc.Api.EF.Models;
using FluentAssertions;
using Moq;

namespace EduDoc.Api.UnitTests.Features.Encounters.Queries;

public class GetEncounterByIdQueryHandlerTests
{
    private readonly Mock<IEncounterRepository> _mockEncounterRepository;
    private readonly Mock<IEncounterMapper> _mockMapper;
    private readonly GetEncounterByIdQueryHandler _handler;

    public GetEncounterByIdQueryHandlerTests()
    {
        _mockEncounterRepository = new Mock<IEncounterRepository>();
        _mockMapper = new Mock<IEncounterMapper>();
        _handler = new GetEncounterByIdQueryHandler(_mockEncounterRepository.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task Handle_Should_ReturnEncounterResponseModel_WhenEncounterExists()
    {
        // Arrange
        var encounterId = 1;
        var encounter = new Encounter
        {
            Id = encounterId,
            ServiceTypeId = 3,
            EncounterDate = new DateTime(2023, 10, 28),
            EncounterStartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
            EncounterEndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
            AdditionalStudents = 2
        };

        var expectedResponse = new EncounterResponseModel
        {
            Id = encounterId,
            ServiceTypeId = Constants.ServiceTypeId.TreatmentTherapy,
            EncounterDate = new DateTime(2023, 10, 28),
            EncounterStartTime = TimeOnly.FromTimeSpan(new TimeSpan(9, 0, 0)),
            EncounterEndTime = TimeOnly.FromTimeSpan(new TimeSpan(10, 0, 0)),
            AdditionalStudents = 2
        };

        _mockEncounterRepository
            .Setup(repo => repo.GetByIdAsync(encounterId))
            .ReturnsAsync(encounter);

        _mockMapper
            .Setup(mapper => mapper.Map(encounter))
            .Returns(expectedResponse);

        var query = new GetEncounterByIdQuery { Id = encounterId };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<EncounterResponseModel>();
        result!.Id.Should().Be(encounterId);
        result.ServiceTypeId.Should().Be(Constants.ServiceTypeId.TreatmentTherapy);
        result.AdditionalStudents.Should().Be(2);
    }

    [Fact]
    public async Task Handle_Should_ReturnNull_WhenEncounterDoesNotExist()
    {
        // Arrange
        var encounterId = 999;
        _mockEncounterRepository
            .Setup(repo => repo.GetByIdAsync(encounterId))
            .ReturnsAsync((Encounter?)null);

        var query = new GetEncounterByIdQuery { Id = encounterId };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().BeNull();
    }
} 