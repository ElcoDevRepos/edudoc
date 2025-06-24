using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.EF.Models;

namespace EduDoc.Api.Endpoints.Encounters.Mappers
{
    public interface IEncounterMapper
    {
        EncounterResponseModel Map(Encounter entity);
    }

    public class EncounterMapper : IEncounterMapper
    {
        public EncounterResponseModel Map(Encounter entity)
        {
            return new EncounterResponseModel
            {
                Id = entity.Id,
                ServiceTypeId = (Constants.ServiceTypeId)entity.ServiceTypeId,
                EncounterDate = entity.EncounterDate ?? default,
                EncounterStartTime = entity.EncounterStartTime.HasValue ? TimeOnly.FromTimeSpan(entity.EncounterStartTime.Value.ToTimeSpan()) : default,
                EncounterEndTime = entity.EncounterEndTime.HasValue ? TimeOnly.FromTimeSpan(entity.EncounterEndTime.Value.ToTimeSpan()) : default,
                AdditionalStudents = entity.AdditionalStudents
            };
        }
    }
}
