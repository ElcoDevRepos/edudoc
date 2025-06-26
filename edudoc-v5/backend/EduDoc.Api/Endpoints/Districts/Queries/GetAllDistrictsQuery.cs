using EduDoc.Api.Endpoints.Districts.Mappers;
using EduDoc.Api.Endpoints.Districts.Models;
using EduDoc.Api.Endpoints.Districts.Repositories;
using EduDoc.Api.Infrastructure.Responses;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace EduDoc.Api.Endpoints.Districts.Queries;

public class GetAllDistrictsQuery : IRequest<GetMultipleResponse<DistrictResponseModel>>
{
    public int CurrentUserRoleType { get; set; }
    public int CurrentUserId { get; set; }
}

public class GetAllDistrictsQueryHandler : IRequestHandler<GetAllDistrictsQuery, GetMultipleResponse<DistrictResponseModel>>
{
    private readonly IDistrictRepository districtRepository;
    private readonly IDistrictMapper mapper;

    public GetAllDistrictsQueryHandler(IDistrictRepository districtRepository, IDistrictMapper mapper)
    {
        this.districtRepository = districtRepository;
        this.mapper = mapper;
    }

    public async Task<GetMultipleResponse<DistrictResponseModel>> Handle(GetAllDistrictsQuery request, CancellationToken cancellationToken)
    {
        var districts = await this.districtRepository.GetAllAsync(request.CurrentUserRoleType, request.CurrentUserId);
        var results = this.mapper.Map(districts);
        return new GetMultipleResponse<DistrictResponseModel>(results);
    }
} 