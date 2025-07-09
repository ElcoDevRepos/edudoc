using FluentValidation;
using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Infrastructure.Responses;
using EduDoc.Api.Infrastructure.Extensions;

namespace EduDoc.Api.Endpoints.Students.Validators;

public class StudentSearchRequestValidator : AbstractValidator<StudentSearchRequestModel>
{
    public StudentSearchRequestValidator()
    {

        RuleFor(x => x.SearchText)
<<<<<<< HEAD
            .Must(searchText => !string.IsNullOrWhiteSpace(searchText) && searchText.Trim().Length >= 2)
            .WithErrorCode(ValidationError.EnumErrorCode.MinimumLengthNotMet)
            .WithMessage("Search text is required and must be at least 2 characters long");
=======
          .Must(searchText => !string.IsNullOrWhiteSpace(searchText) && searchText.Trim().Length >= 2)
          .WithErrorCode(ValidationError.EnumErrorCode.MinimumLengthNotMet)
          .WithMessage("Search text is required and must be at least 2 characters long");
>>>>>>> origin/main

        RuleFor(x => x.DistrictId)
        .GreaterThan(0)
        .When(x => x.DistrictId.HasValue)
        .WithErrorCode(ValidationError.EnumErrorCode.PositiveIntegerRequired)
        .WithMessage("District ID must be greater than 0 when provided");
    }
} 