using Azure.Core;
using EduDoc.Api.Endpoints.Students.Mappers;
using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.Endpoints.Students.Repositories;
using EduDoc.Api.Endpoints.Students.Validators;
using EduDoc.Api.Infrastructure.Formatters;
using EduDoc.Api.Infrastructure.Models;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using Parlot.Fluent;
using System.Threading;
using System.Threading.Tasks;

namespace EduDoc.Api.Endpoints.Students.Queries;

public class SearchStudentsQuery : IRequest<GetMultipleResponse<StudentResponseModel>>
{
    public required StudentSearchRequestModel Model { get; set; }
    public required AuthModel Auth { get; set; }
}

public class SearchStudentsQueryHandler : IRequestHandler<SearchStudentsQuery, GetMultipleResponse<StudentResponseModel>>
{
    private readonly ISearchFormatter searchFormatter;
    private readonly IStudentRepository studentRepository;
    private readonly StudentSearchRequestValidator validator;
    private readonly IStudentMapper mapper;

    public SearchStudentsQueryHandler(StudentSearchRequestValidator validator, 
        IStudentRepository studentRepository, 
        IStudentMapper mapper,
        ISearchFormatter searchFormatter)
    {
        this.validator = validator;
        this.studentRepository = studentRepository;
        this.mapper = mapper;
        this.searchFormatter = searchFormatter;
    }

    public async Task<GetMultipleResponse<StudentResponseModel>> Handle(SearchStudentsQuery query, CancellationToken cancellationToken)
    {

        query.Model.SearchText = this.searchFormatter.Format(query.Model.SearchText);

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