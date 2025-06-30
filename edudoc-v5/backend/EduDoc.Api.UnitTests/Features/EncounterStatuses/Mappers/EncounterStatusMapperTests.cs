using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.EncounterStatuses.Mappers;
using EduDoc.Api.Endpoints.EncounterStatuses.Models;
using System.Collections.Generic;
using Xunit;
using FluentAssertions;

namespace EduDoc.Api.UnitTests.Features.EncounterStatuses.Mappers
{
    public class EncounterStatusMapperTests
    {
        private readonly EncounterStatusMapper _mapper;

        public EncounterStatusMapperTests()
        {
            _mapper = new EncounterStatusMapper();
        }

        [Fact]
        public void Map_Should_MapEntityToResponseModel_When_ValidEntityProvided()
        {
            // Arrange
            var entity = new EncounterStatus
            {
                Id = 1,
                Name = "Draft",
                IsAuditable = true,
                IsBillable = false,
                ForReview = false,
                HpcadminOnly = true
            };

            // Act
            var result = _mapper.Map(entity);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(entity.Id);
            result.Name.Should().Be(entity.Name);
            result.IsAuditable.Should().Be(entity.IsAuditable);
            result.IsBillable.Should().Be(entity.IsBillable);
            result.ForReview.Should().Be(entity.ForReview);
            result.HpcadminOnly.Should().Be(entity.HpcadminOnly);
        }

        [Fact]
        public void Map_Should_MapEntityList_When_ValidEntityListProvided()
        {
            // Arrange
            var entities = new List<EncounterStatus>
            {
                new EncounterStatus { Id = 1, Name = "Draft", IsAuditable = true, IsBillable = false, ForReview = false, HpcadminOnly = false },
                new EncounterStatus { Id = 2, Name = "Submitted", IsAuditable = true, IsBillable = true, ForReview = true, HpcadminOnly = false }
            };

            // Act
            var results = _mapper.Map(entities);

            // Assert
            results.Should().NotBeNull();
            results.Should().HaveCount(2);
            results[0].Name.Should().Be("Draft");
            results[1].Name.Should().Be("Submitted");
        }

        [Fact]
        public void Map_Should_ReturnEmptyList_When_EntityListIsEmpty()
        {
            // Arrange
            var entities = new List<EncounterStatus>();

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
            var act = () => _mapper.Map((EncounterStatus)null!);

            // Assert
            act.Should().Throw<ArgumentNullException>();
        }

        [Fact]
        public void Map_Should_ThrowArgumentNullException_When_EntityListIsNull()
        {
            // Act
            var act = () => _mapper.Map((List<EncounterStatus>)null!);

            // Assert
            act.Should().Throw<ArgumentNullException>();
        }
    }
} 