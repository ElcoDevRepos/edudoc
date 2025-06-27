using EduDoc.Api.Endpoints.EncounterLocations.Models;
using EduDoc.Api.EF.Models;
using System;

namespace EduDoc.Api.Endpoints.EncounterLocations.Mappers
{
    public interface IEncounterLocationMapper
    {
        EncounterLocationResponseModel Map(EncounterLocation entity);
        List<EncounterLocationResponseModel> Map(List<EncounterLocation> entities);
    }

    public class EncounterLocationMapper : IEncounterLocationMapper
    {
        public EncounterLocationResponseModel Map(EncounterLocation entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));
            return new EncounterLocationResponseModel
            {
                Id = entity.Id,
                Name = entity.Name
            };
        }

        public List<EncounterLocationResponseModel> Map(List<EncounterLocation> entities)
        {
            if (entities == null) throw new ArgumentNullException(nameof(entities));
            return entities.ConvertAll(Map);
        }
    }
} 