using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.Endpoints.Students.Validators;
using EduDoc.Api.Infrastructure.Responses;
using FluentAssertions;

namespace EduDoc.Api.UnitTests.Features.Students.Validators;

public class StudentSearchRequestValidatorTests
{
    private readonly StudentSearchRequestValidator _validator;

    public StudentSearchRequestValidatorTests()
    {
        _validator = new StudentSearchRequestValidator();
    }

    [Fact]
    public void Validate_Should_ReturnValid_WhenAllFieldsAreValid()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "John Doe",
            DistrictId = 123
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void Validate_Should_ReturnValid_WhenSearchTextIsValidAndDistrictIdIsNull()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "Jane",
            DistrictId = null
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void Validate_Should_ReturnValid_WhenSearchTextIsMinimumLength()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "Jo",
            DistrictId = null
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void Validate_Should_ReturnInvalid_WhenSearchTextIsEmpty()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "",
            DistrictId = 123
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors.Should().Contain(e => e.PropertyName == "SearchText" && e.ErrorMessage == "Search text is required and must be at least 2 characters long" && e.ErrorCode == ValidationError.EnumErrorCode.MinimumLengthNotMet.ToString());
    }
    [Fact]
    public void Validate_Should_ReturnInvalid_WhenSearchTextIsNull()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = null!,
            DistrictId = 123
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors.Should().Contain(e => e.PropertyName == "SearchText" && e.ErrorMessage == "Search text is required and must be at least 2 characters long" && e.ErrorCode == ValidationError.EnumErrorCode.MinimumLengthNotMet.ToString());
    }

    [Fact]
    public void Validate_Should_ReturnInvalid_WhenSearchTextIsOnlyWhitespace()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "   ",
            DistrictId = 123
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors.Should().Contain(e => e.PropertyName == "SearchText" && e.ErrorMessage == "Search text is required and must be at least 2 characters long" && e.ErrorCode == ValidationError.EnumErrorCode.MinimumLengthNotMet.ToString());
    }

    [Fact]
    public void Validate_Should_ReturnInvalid_WhenSearchTextIsTooShort()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "A",
            DistrictId = 123
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors.Should().Contain(e => e.PropertyName == "SearchText" && e.ErrorMessage == "Search text is required and must be at least 2 characters long" && e.ErrorCode == ValidationError.EnumErrorCode.MinimumLengthNotMet.ToString());
    }

    [Fact]
    public void Validate_Should_ReturnInvalid_WhenSearchTextHasWhitespaceButTrimmedIsTooShort()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = " A ",
            DistrictId = 123
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors.Should().Contain(e => e.PropertyName == "SearchText" && e.ErrorMessage == "Search text is required and must be at least 2 characters long" && e.ErrorCode == ValidationError.EnumErrorCode.MinimumLengthNotMet.ToString());
    }

    [Fact]
    public void Validate_Should_ReturnValid_WhenSearchTextHasWhitespaceButTrimmedIsValid()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "  John  ",
            DistrictId = 123
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void Validate_Should_ReturnInvalid_WhenDistrictIdIsZero()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "John Doe",
            DistrictId = 0
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors.Should().Contain(e => e.PropertyName == "DistrictId" && e.ErrorMessage == "District ID must be greater than 0 when provided" && e.ErrorCode == ValidationError.EnumErrorCode.PositiveIntegerRequired.ToString());
    }

    [Fact]
    public void Validate_Should_ReturnInvalid_WhenDistrictIdIsNegative()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "John Doe",
            DistrictId = -1
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(1);
        result.Errors.Should().Contain(e => e.PropertyName == "DistrictId" && e.ErrorMessage == "District ID must be greater than 0 when provided" && e.ErrorCode == ValidationError.EnumErrorCode.PositiveIntegerRequired.ToString());
    }

    [Fact]
    public void Validate_Should_ReturnValid_WhenDistrictIdIsPositive()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "John Doe",
            DistrictId = 1
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void Validate_Should_ReturnInvalid_WhenBothSearchTextAndDistrictIdAreInvalid()
    {
        // Arrange
        var request = new StudentSearchRequestModel
        {
            SearchText = "",
            DistrictId = -5
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCount(2);
        result.Errors.Should().Contain(e => e.PropertyName == "SearchText" && e.ErrorMessage == "Search text is required and must be at least 2 characters long" && e.ErrorCode == ValidationError.EnumErrorCode.MinimumLengthNotMet.ToString());
        result.Errors.Should().Contain(e => e.PropertyName == "DistrictId" && e.ErrorMessage == "District ID must be greater than 0 when provided" && e.ErrorCode == ValidationError.EnumErrorCode.PositiveIntegerRequired.ToString());
    }
} 