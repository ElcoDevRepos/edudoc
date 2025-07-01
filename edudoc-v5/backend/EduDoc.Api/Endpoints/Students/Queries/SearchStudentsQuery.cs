using Azure.Core;
using EduDoc.Api.Endpoints.Students.Mappers;
using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.Endpoints.Students.Repositories;
using EduDoc.Api.Endpoints.Students.Validators;
using EduDoc.Api.Infrastructure.Models;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using Parlot.Fluent;
using System.Threading;
using System.Threading.Tasks;

namespace EduDoc.Api.Endpoints.Students.Queries;

public class SearchStudentsQuery : IRequest<GetMultipleResponse<StudentResponseModel>>
{
    public StudentSearchRequestModel Model { get; set; }
    public AuthModel Auth { get; set; }
}

public class SearchStudentsQueryHandler : IRequestHandler<SearchStudentsQuery, GetMultipleResponse<StudentResponseModel>>
{
    private readonly IStudentRepository studentRepository;
    private readonly StudentSearchRequestValidator validator;
    private readonly IStudentMapper mapper;

    public SearchStudentsQueryHandler(StudentSearchRequestValidator validator, IStudentRepository studentRepository, IStudentMapper mapper)
    {
        this.validator = validator;
        this.studentRepository = studentRepository;
        this.mapper = mapper;
    }

    public async Task<GetMultipleResponse<StudentResponseModel>> Handle(SearchStudentsQuery query, CancellationToken cancellationToken)
    {

        var validationResult = await this.validator.ValidateAsync(query.Model);

        if(!validationResult.IsValid)
        {
            return new GetMultipleResponse<StudentResponseModel>(validationResult);
        }
        else
        {
            var students = await this.studentRepository.SearchAsync(
              query.Model.SearchText,
              query.Model.DistrictId,
              query.Auth.UserRoleTypeId,
              query.Auth.UserId);
            return new GetMultipleResponse<StudentResponseModel>(this.mapper.Map(students));
        } 
    }
} 