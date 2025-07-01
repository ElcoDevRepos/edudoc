using EduDoc.Api.Endpoints.Students.Mappers;
using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.EF.Models;
using FluentAssertions;

namespace EduDoc.Api.UnitTests.Features.Students.Mappers;

public class StudentMapperTests
{
    private readonly StudentMapper _mapper;

    public StudentMapperTests()
    {
        _mapper = new StudentMapper();
    }

    [Fact]
    public void Map_Should_MapEntityToResponseModel_WhenValidEntityProvided()
    {
        // Arrange
        var student = new Student
        {
            Id = 1,
            FirstName = "John",
            MiddleName = "Michael",
            LastName = "Doe",
            StudentCode = "STU001",
            MedicaidNo = "MED123456",
            Grade = "5",
            DateOfBirth = new DateTime(2010, 3, 15),
            SchoolId = 10,
            DistrictId = 5,
            School = new School { Name = "Test Elementary" },
            District = new SchoolDistrict { Name = "Test District" }
        };

        // Act
        var result = _mapper.Map(student);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.FirstName.Should().Be("John");
        result.MiddleName.Should().Be("Michael");
        result.LastName.Should().Be("Doe");
        result.StudentCode.Should().Be("STU001");
        result.MedicaidNo.Should().Be("MED123456");
        result.Grade.Should().Be("5");
        result.DateOfBirth.Should().Be(new DateTime(2010, 3, 15));
        result.SchoolId.Should().Be(10);
        result.DistrictId.Should().Be(5);
        result.SchoolName.Should().Be("Test Elementary");
        result.DistrictName.Should().Be("Test District");
    }

    [Fact]
    public void Map_Should_MapEntityList_WhenValidEntityListProvided()
    {
        // Arrange
        var students = new List<Student>
        {
            new Student 
            { 
                Id = 1, 
                FirstName = "John", 
                LastName = "Doe", 
                Grade = "5", 
                DateOfBirth = new DateTime(2010, 1, 1),
                SchoolId = 1
            },
            new Student 
            { 
                Id = 2, 
                FirstName = "Jane", 
                LastName = "Smith", 
                Grade = "6", 
                DateOfBirth = new DateTime(2009, 5, 15),
                SchoolId = 2
            },
            new Student 
            { 
                Id = 3, 
                FirstName = "Bob", 
                LastName = "Johnson", 
                Grade = "4", 
                DateOfBirth = new DateTime(2011, 8, 20),
                SchoolId = 1
            }
        };

        // Act
        var result = _mapper.Map(students);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        result[0].Id.Should().Be(1);
        result[0].FirstName.Should().Be("John");
        result[0].LastName.Should().Be("Doe");
        result[1].Id.Should().Be(2);
        result[1].FirstName.Should().Be("Jane");
        result[1].LastName.Should().Be("Smith");
        result[2].Id.Should().Be(3);
        result[2].FirstName.Should().Be("Bob");
        result[2].LastName.Should().Be("Johnson");
    }

    [Fact]
    public void Map_Should_HandleNullableFields_WhenEntityHasNullValues()
    {
        // Arrange
        var student = new Student
        {
            Id = 1,
            FirstName = "John",
            MiddleName = null,
            LastName = "Doe",
            StudentCode = null,
            MedicaidNo = null,
            Grade = "5",
            DateOfBirth = new DateTime(2010, 3, 15),
            SchoolId = 10,
            DistrictId = null,
            District = null
        };

        // Act
        var result = _mapper.Map(student);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.FirstName.Should().Be("John");
        result.MiddleName.Should().BeNull();
        result.LastName.Should().Be("Doe");
        result.StudentCode.Should().BeNull();
        result.MedicaidNo.Should().BeNull();
        result.Grade.Should().Be("5");
        result.DateOfBirth.Should().Be(new DateTime(2010, 3, 15));
        result.SchoolId.Should().Be(10);
        result.DistrictId.Should().BeNull();
        result.SchoolName.Should().BeNull();
        result.DistrictName.Should().BeNull();
    }
} 