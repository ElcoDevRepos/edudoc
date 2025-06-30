using EduDoc.Api.Endpoints.Districts.Models;
using EduDoc.Api.EF.Models;

namespace EduDoc.Api.Endpoints.Districts.Mappers
{
    public interface IDistrictMapper
    {
        DistrictResponseModel Map(SchoolDistrict entity);
        List<DistrictResponseModel> Map(List<SchoolDistrict> entities);
    }

    public class DistrictMapper : IDistrictMapper
    {
        public DistrictResponseModel Map(SchoolDistrict entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            return new DistrictResponseModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Code = entity.Code,
                Einnumber = entity.Einnumber,
                Irnnumber = entity.Irnnumber,
                Npinumber = entity.Npinumber,
                ProviderNumber = entity.ProviderNumber,
                ActiveStatus = entity.ActiveStatus,
                Archived = entity.Archived
            };
        }

        public List<DistrictResponseModel> Map(List<SchoolDistrict> entities)
        {
            if (entities == null)
                throw new ArgumentNullException(nameof(entities));

            return entities.Select(Map).ToList();
        }
    }
} 