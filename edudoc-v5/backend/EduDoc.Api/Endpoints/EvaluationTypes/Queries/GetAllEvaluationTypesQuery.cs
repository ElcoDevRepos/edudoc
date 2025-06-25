using EduDoc.Api.Endpoints.EvaluationTypes.Mappers;
using EduDoc.Api.Endpoints.EvaluationTypes.Models;
using EduDoc.Api.Endpoints.EvaluationTypes.Repositories;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace EduDoc.Api.Endpoints.EvaluationTypes.Queries;

public class GetAllEvaluationTypesQuery : IRequest<GetMultipleResponse<EvaluationTypeResponseModel>>
{
}

public class GetAllEvaluationTypesQueryHandler : IRequestHandler<GetAllEvaluationTypesQuery, GetMultipleResponse<EvaluationTypeResponseModel>>
{
    private readonly IEvaluationTypeRepository evaluationTypeRepository;
    private readonly IEvaluationTypeMapper mapper;

    public GetAllEvaluationTypesQueryHandler(IEvaluationTypeRepository evaluationTypeRepository, IEvaluationTypeMapper mapper)
    {
        this.evaluationTypeRepository = evaluationTypeRepository;
        this.mapper = mapper;
    }

    public async Task<GetMultipleResponse<EvaluationTypeResponseModel>> Handle(GetAllEvaluationTypesQuery request, CancellationToken cancellationToken)
    {
        var evaluationTypes = await this.evaluationTypeRepository.GetAllAsync();
        var results = this.mapper.Map(evaluationTypes);
        return new GetMultipleResponse<EvaluationTypeResponseModel>(results);
    }
} 