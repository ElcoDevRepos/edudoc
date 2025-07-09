using EduDoc.Api.Endpoints.Encounters.Models;
using EduDoc.Api.EF.Models;

namespace EduDoc.Api.Endpoints.Encounters.Mappers
{
    public interface IEncounterMapper
    {
        EncounterResponseModel? Map(Encounter? entity);
    }

    public class EncounterMapper : IEncounterMapper
    {
        public EncounterResponseModel? Map(Encounter? entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new EncounterResponseModel
            {
                Id = entity.Id,
                ProviderId = entity.ProviderId,
                ServiceTypeId = (Constants.ServiceTypeId)entity.ServiceTypeId,
                EncounterDate = entity.EncounterDate,
                EncounterStartTime = entity.EncounterStartTime,
                EncounterEndTime = entity.EncounterEndTime,
                IsGroup = entity.IsGroup,
                AdditionalStudents = entity.AdditionalStudents,
                FromSchedule = entity.FromSchedule,
                Archived = entity.Archived
            };
        }
    }
}
