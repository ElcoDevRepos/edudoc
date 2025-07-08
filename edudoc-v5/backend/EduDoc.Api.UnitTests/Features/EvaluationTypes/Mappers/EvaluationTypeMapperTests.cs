using EduDoc.Api.Endpoints.EvaluationTypes.Mappers;
using EduDoc.Api.Endpoints.EvaluationTypes.Models;
using EduDoc.Api.EF.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;

namespace EduDoc.Api.UnitTests.Features.EvaluationTypes.Mappers;

public class EvaluationTypeMapperTests
{
    private readonly IEvaluationTypeMapper _mapper;

    public EvaluationTypeMapperTests()
    {
        _mapper = new EvaluationTypeMapper();
    }

    [Fact]
    public void Map_Should_MapSingleEvaluationType_Correctly()
    {
        // Arrange
        var evaluationType = new EvaluationType
        {
            Id = 1,
            Name = "Initial Evaluation"
        };

        // Act
        var result = _mapper.Map(evaluationType);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.Name.Should().Be("Initial Evaluation");
    }

    [Fact]
    public void Map_Should_MapListOfEvaluationTypes_Correctly()
    {
        // Arrange
        var evaluationTypes = new List<EvaluationType>
        {
            new EvaluationType { Id = 1, Name = "Initial Evaluation" },
            new EvaluationType { Id = 2, Name = "Re-Evaluation" },
            new EvaluationType { Id = 3, Name = "Annual Review" }
        };

        // Act
        var result = _mapper.Map(evaluationTypes);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);

        result[0].Id.Should().Be(1);
        result[0].Name.Should().Be("Initial Evaluation");

        result[1].Id.Should().Be(2);
        result[1].Name.Should().Be("Re-Evaluation");

        result[2].Id.Should().Be(3);
        result[2].Name.Should().Be("Annual Review");
    }

    [Fact]
    public void Map_Should_HandleEmptyList_Correctly()
    {
        // Arrange
        var emptyList = new List<EvaluationType>();

        // Act
        var result = _mapper.Map(emptyList);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }
} 