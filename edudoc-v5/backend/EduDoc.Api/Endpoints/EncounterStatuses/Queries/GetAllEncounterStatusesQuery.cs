using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EduDoc.Api.Endpoints.EncounterStatuses.Models;
using EduDoc.Api.Endpoints.EncounterStatuses.Repositories;
using EduDoc.Api.Endpoints.EncounterStatuses.Mappers;
using EduDoc.Api.Infrastructure.Responses;

namespace EduDoc.Api.Endpoints.EncounterStatuses.Queries;

public class GetAllEncounterStatusesQuery : IRequest<GetMultipleResponse<EncounterStatusResponseModel>>
{
}

public class GetAllEncounterStatusesQueryHandler : IRequestHandler<GetAllEncounterStatusesQuery, GetMultipleResponse<EncounterStatusResponseModel>>
{
    private readonly IEncounterStatusRepository repository;
    private readonly IEncounterStatusMapper mapper;

    public GetAllEncounterStatusesQueryHandler(IEncounterStatusRepository repository, IEncounterStatusMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<GetMultipleResponse<EncounterStatusResponseModel>> Handle(GetAllEncounterStatusesQuery request, CancellationToken cancellationToken)
    {
        var entities = await repository.GetAllAsync();
        var models = mapper.Map(entities);
        return new GetMultipleResponse<EncounterStatusResponseModel>(models);
    }
} 