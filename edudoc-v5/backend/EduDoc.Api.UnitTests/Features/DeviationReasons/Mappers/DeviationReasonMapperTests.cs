using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.DeviationReasons.Mappers;
using EduDoc.Api.Endpoints.DeviationReasons.Models;
using System.Collections.Generic;
using Xunit;
using FluentAssertions;

namespace EduDoc.Api.UnitTests.Features.DeviationReasons.Mappers
{
    public class DeviationReasonMapperTests
    {
        private readonly DeviationReasonMapper _mapper;

        public DeviationReasonMapperTests()
        {
            _mapper = new DeviationReasonMapper();
        }

        [Fact]
        public void Map_Should_MapEntityToResponseModel_When_ValidEntityProvided()
        {
            // Arrange
            var entity = new StudentDeviationReason
            {
                Id = 1,
                Name = "Reason 1"
            };

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
            var entities = new List<StudentDeviationReason>
            {
                new StudentDeviationReason { Id = 1, Name = "Reason 1" },
                new StudentDeviationReason { Id = 2, Name = "Reason 2" }
            };

            // Act
            var results = _mapper.Map(entities);

            // Assert
            results.Should().HaveCount(2);
            results[0].Name.Should().Be("Reason 1");
            results[1].Name.Should().Be("Reason 2");
        }

        [Fact]
        public void Map_Should_ReturnEmptyList_When_EntityListIsEmpty()
        {
            // Arrange
            var entities = new List<StudentDeviationReason>();

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
            var act = () => _mapper.Map((StudentDeviationReason)null!);

            // Assert
            act.Should().Throw<ArgumentNullException>();
        }

        [Fact]
        public void Map_Should_ThrowArgumentNullException_When_EntityListIsNull()
        {
            // Act
            var act = () => _mapper.Map((List<StudentDeviationReason>)null!);

            // Assert
            act.Should().Throw<ArgumentNullException>();
        }
    }
} 