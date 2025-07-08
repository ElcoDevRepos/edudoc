using EduDoc.Api.Endpoints.Encounters.Mappers;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.EF.Models;
using Xunit;

namespace EduDoc.Api.UnitTests.Features.Encounters.Mappers
{
    public class EncounterMapperTests
    {
        private readonly EncounterMapper _mapper;

        public EncounterMapperTests()
        {
            _mapper = new EncounterMapper();
        }

        [Fact]
        public void Map_Should_MapAllProperties_When_EntityHasAllValues()
        {
            // Arrange
            var entity = new Encounter
            {
                Id = 1,
                ProviderId = 2,
                ServiceTypeId = 3,
                EncounterDate = new DateTime(2023, 1, 15),
                EncounterStartTime = new TimeOnly(9, 30),
                EncounterEndTime = new TimeOnly(10, 30),
                IsGroup = true,
                AdditionalStudents = 2,
                FromSchedule = false,
                Archived = false
            };

            // Act
            var result = _mapper.Map(entity);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(entity.Id, result.Id);
            Assert.Equal(entity.ProviderId, result.ProviderId);
            Assert.Equal((Constants.ServiceTypeId)entity.ServiceTypeId, result.ServiceTypeId);
            Assert.Equal(entity.EncounterDate, result.EncounterDate);
            Assert.Equal(entity.EncounterStartTime, result.EncounterStartTime);
            Assert.Equal(entity.EncounterEndTime, result.EncounterEndTime);
            Assert.Equal(entity.IsGroup, result.IsGroup);
            Assert.Equal(entity.AdditionalStudents, result.AdditionalStudents);
            Assert.Equal(entity.FromSchedule, result.FromSchedule);
            Assert.Equal(entity.Archived, result.Archived);
        }

        [Fact]
        public void Map_Should_ReturnNull_When_EntityIsNull()
        {
            // Arrange
            Encounter? entity = null;

            // Act
            var result = _mapper.Map(entity);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void Map_Should_HandleNullableProperties_When_EntityHasNullValues()
        {
            // Arrange
            var entity = new Encounter
            {
                Id = 1,
                ProviderId = 2,
                ServiceTypeId = 1,
                EncounterDate = null,
                EncounterStartTime = null,
                EncounterEndTime = null,
                IsGroup = false,
                AdditionalStudents = 0,
                FromSchedule = true,
                Archived = false
            };

            // Act
            var result = _mapper.Map(entity);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(entity.Id, result.Id);
            Assert.Equal(entity.ProviderId, result.ProviderId);
            Assert.Equal((Constants.ServiceTypeId)entity.ServiceTypeId, result.ServiceTypeId);
            Assert.Null(result.EncounterDate);
            Assert.Null(result.EncounterStartTime);
            Assert.Null(result.EncounterEndTime);
            Assert.Equal(entity.IsGroup, result.IsGroup);
            Assert.Equal(entity.AdditionalStudents, result.AdditionalStudents);
            Assert.Equal(entity.FromSchedule, result.FromSchedule);
            Assert.Equal(entity.Archived, result.Archived);
        }

        [Fact]
        public void Map_Should_ConvertServiceTypeId_When_EntityHasValidServiceType()
        {
            // Arrange
            var entity = new Encounter
            {
                Id = 1,
                ProviderId = 2,
                ServiceTypeId = 3, // TreatmentTherapy
                IsGroup = false,
                AdditionalStudents = 0,
                FromSchedule = true,
                Archived = false
            };

            // Act
            var result = _mapper.Map(entity);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Constants.ServiceTypeId.TreatmentTherapy, result.ServiceTypeId);
        }
    }
} 