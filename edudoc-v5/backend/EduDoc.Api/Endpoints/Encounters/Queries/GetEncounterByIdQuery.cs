using EduDoc.Api.Endpoints.Encounters.Mappers;
using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.Endpoints.Encounters.Repositories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace EduDoc.Api.Endpoints.Encounters.Queries;

public class GetEncounterByIdQuery : IRequest<EncounterResponseModel?>
{
    public int Id { get; set; }
}

public class GetEncounterByIdQueryHandler : IRequestHandler<GetEncounterByIdQuery, EncounterResponseModel?>
{
    private readonly IEncounterRepository encounterRepository;
    private readonly IEncounterMapper mapper;

    public GetEncounterByIdQueryHandler(IEncounterRepository encounterRepository, IEncounterMapper mapper)
    {
        this.encounterRepository = encounterRepository;
        this.mapper = mapper;
    }

    public async Task<EncounterResponseModel?> Handle(GetEncounterByIdQuery request, CancellationToken cancellationToken)
    {
        var encounter = await this.encounterRepository.GetByIdAsync(request.Id);

        if (encounter == null)
        {
            return null;
        }

        return this.mapper.Map(encounter);
    }
}