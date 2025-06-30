using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.DeviationReasons.Models;
using EduDoc.Api.Endpoints.DeviationReasons.Repositories;
using EduDoc.Api.Endpoints.DeviationReasons.Mappers;
using EduDoc.Api.Infrastructure.Responses;

namespace EduDoc.Api.Endpoints.DeviationReasons.Queries;

public class GetAllDeviationReasonsQuery : IRequest<GetMultipleResponse<DeviationReasonResponseModel>>
{
}

public class GetAllDeviationReasonsQueryHandler : IRequestHandler<GetAllDeviationReasonsQuery, GetMultipleResponse<DeviationReasonResponseModel>>
{
    private readonly IDeviationReasonRepository repository;
    private readonly IDeviationReasonMapper mapper;

    public GetAllDeviationReasonsQueryHandler(IDeviationReasonRepository repository, IDeviationReasonMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<GetMultipleResponse<DeviationReasonResponseModel>> Handle(GetAllDeviationReasonsQuery request, CancellationToken cancellationToken)
    {
        var entities = await repository.GetAllAsync();
        var models = mapper.Map(entities);
        return new GetMultipleResponse<DeviationReasonResponseModel>(models);
    }
} 