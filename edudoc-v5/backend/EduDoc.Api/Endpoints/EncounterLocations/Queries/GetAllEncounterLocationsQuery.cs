using EduDoc.Api.Endpoints.EncounterLocations.Mappers;
using EduDoc.Api.Endpoints.EncounterLocations.Models;
using EduDoc.Api.Endpoints.EncounterLocations.Repositories;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace EduDoc.Api.Endpoints.EncounterLocations.Queries;

public class GetAllEncounterLocationsQuery : IRequest<GetMultipleResponse<EncounterLocationResponseModel>>
{
}

public class GetAllEncounterLocationsQueryHandler : IRequestHandler<GetAllEncounterLocationsQuery, GetMultipleResponse<EncounterLocationResponseModel>>
{
    private readonly IEncounterLocationRepository repository;
    private readonly IEncounterLocationMapper mapper;

    public GetAllEncounterLocationsQueryHandler(IEncounterLocationRepository repository, IEncounterLocationMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<GetMultipleResponse<EncounterLocationResponseModel>> Handle(GetAllEncounterLocationsQuery request, CancellationToken cancellationToken)
    {
        var locations = await this.repository.GetAllAsync();
        var results = this.mapper.Map(locations);
        return new GetMultipleResponse<EncounterLocationResponseModel>(results);
    }
} 