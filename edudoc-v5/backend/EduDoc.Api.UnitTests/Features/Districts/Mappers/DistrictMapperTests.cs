using EduDoc.Api.Endpoints.Districts.Mappers;
using EduDoc.Api.Endpoints.Districts.Models;
using EduDoc.Api.EF.Models;
using FluentAssertions;

namespace EduDoc.Api.UnitTests.Features.Districts.Mappers;

public class DistrictMapperTests
{
    private readonly DistrictMapper _mapper;

    public DistrictMapperTests()
    {
        _mapper = new DistrictMapper();
    }

    [Fact]
    public void Map_Should_MapEntityToResponseModel_When_ValidEntityProvided()
    {
        // Arrange
        var district = new SchoolDistrict
        {
            Id = 1,
            Name = "Test District",
            Code = "TD001",
            Einnumber = "123456789",
            Irnnumber = "IRN001",
            Npinumber = "NPI001",
            ProviderNumber = "PROV001",
            ActiveStatus = true,
            Archived = false
        };

        // Act
        var result = _mapper.Map(district);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.Name.Should().Be("Test District");
        result.Code.Should().Be("TD001");
        result.Einnumber.Should().Be("123456789");
        result.Irnnumber.Should().Be("IRN001");
        result.Npinumber.Should().Be("NPI001");
        result.ProviderNumber.Should().Be("PROV001");
        result.ActiveStatus.Should().BeTrue();
        result.Archived.Should().BeFalse();
    }

    [Fact]
    public void Map_Should_MapEntityList_When_ValidEntityListProvided()
    {
        // Arrange
        var districts = new List<SchoolDistrict>
        {
            new SchoolDistrict 
            { 
                Id = 1, 
                Name = "Test District 1", 
                Code = "TD1",
                Einnumber = "123456789",
                Irnnumber = "IRN001",
                Npinumber = "NPI001",
                ProviderNumber = "PROV001",
                ActiveStatus = true,
                Archived = false
            },
            new SchoolDistrict 
            { 
                Id = 2, 
                Name = "Test District 2", 
                Code = "TD2",
                Einnumber = "987654321",
                Irnnumber = "IRN002",
                Npinumber = "NPI002",
                ProviderNumber = "PROV002",
                ActiveStatus = false,
                Archived = true
            },
            new SchoolDistrict 
            { 
                Id = 3, 
                Name = "Test District 3", 
                Code = "TD3",
                Einnumber = "555666777",
                Irnnumber = "IRN003",
                Npinumber = "NPI003",
                ProviderNumber = "PROV003",
                ActiveStatus = true,
                Archived = false
            }
        };

        // Act
        var result = _mapper.Map(districts);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        result[0].Id.Should().Be(1);
        result[0].Name.Should().Be("Test District 1");
        result[0].Code.Should().Be("TD1");
        result[0].ActiveStatus.Should().BeTrue();
        result[0].Archived.Should().BeFalse();
        
        result[1].Id.Should().Be(2);
        result[1].Name.Should().Be("Test District 2");
        result[1].Code.Should().Be("TD2");
        result[1].ActiveStatus.Should().BeFalse();
        result[1].Archived.Should().BeTrue();
        
        result[2].Id.Should().Be(3);
        result[2].Name.Should().Be("Test District 3");
        result[2].Code.Should().Be("TD3");
        result[2].ActiveStatus.Should().BeTrue();
        result[2].Archived.Should().BeFalse();
    }

    [Fact]
    public void Map_Should_ReturnEmptyList_When_EntityListIsEmpty()
    {
        // Arrange
        var districts = new List<SchoolDistrict>();

        // Act
        var result = _mapper.Map(districts);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Fact]
    public void Map_Should_ThrowArgumentNullException_When_EntityIsNull()
    {
        // Arrange
        SchoolDistrict district = null!;

        // Act & Assert
        var action = () => _mapper.Map(district);
        action.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void Map_Should_ThrowArgumentNullException_When_EntityListIsNull()
    {
        // Arrange
        List<SchoolDistrict> districts = null!;

        // Act & Assert
        var action = () => _mapper.Map(districts);
        action.Should().Throw<ArgumentNullException>();
    }
} 