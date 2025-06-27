using System.Collections.Generic;
using EduDoc.Api.Endpoints.EncounterLocations.Mappers;
using EduDoc.Api.Endpoints.EncounterLocations.Models;
using EduDoc.Api.EF.Models;
using FluentAssertions;
using Xunit;

namespace EduDoc.Api.UnitTests.Features.EncounterLocations.Mappers;

public class EncounterLocationMapperTests
{
    private readonly EncounterLocationMapper _mapper;

    public EncounterLocationMapperTests()
    {
        _mapper = new EncounterLocationMapper();
    }

    [Fact]
    public void Map_Should_MapEntityToResponseModel_When_ValidEntityProvided()
    {
        // Arrange
        var entity = new EncounterLocation { Id = 1, Name = "Test Location" };

        // Act
        var result = _mapper.Map(entity);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(entity.Id);
        result.Name.Should().Be(entity.Name);
    }

    [Fact]
    public void Map_Should_MapEntityList_When_ValidEntityListProvided()
    {
        // Arrange
        var entities = new List<EncounterLocation>
        {
            new EncounterLocation { Id = 1, Name = "Location 1" },
            new EncounterLocation { Id = 2, Name = "Location 2" }
        };

        // Act
        var results = _mapper.Map(entities);

        // Assert
        results.Should().NotBeNull();
        results.Should().HaveCount(2);
        results[0].Name.Should().Be("Location 1");
        results[1].Name.Should().Be("Location 2");
    }

    [Fact]
    public void Map_Should_ReturnEmptyList_When_EntityListIsEmpty()
    {
        // Arrange
        var entities = new List<EncounterLocation>();

        // Act
        var results = _mapper.Map(entities);

        // Assert
        results.Should().NotBeNull();
        results.Should().BeEmpty();
    }

    [Fact]
    public void Map_Should_ThrowArgumentNullException_When_EntityIsNull()
    {
        // Act
        var act = () => _mapper.Map((EncounterLocation)null!);

        // Assert
        act.Should().Throw<System.ArgumentNullException>();
    }

    [Fact]
    public void Map_Should_ThrowArgumentNullException_When_EntityListIsNull()
    {
        // Act
        var act = () => _mapper.Map((List<EncounterLocation>)null!);

        // Assert
        act.Should().Throw<System.ArgumentNullException>();
    }
} 