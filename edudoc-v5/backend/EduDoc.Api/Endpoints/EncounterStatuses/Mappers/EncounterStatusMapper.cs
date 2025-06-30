using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.EncounterStatuses.Models;

namespace EduDoc.Api.Endpoints.EncounterStatuses.Mappers;

public interface IEncounterStatusMapper
{
    EncounterStatusResponseModel Map(EncounterStatus entity);
    List<EncounterStatusResponseModel> Map(List<EncounterStatus> entities);
}

public class EncounterStatusMapper : IEncounterStatusMapper
{
    public EncounterStatusResponseModel Map(EncounterStatus entity)
    {
        if (entity == null) throw new ArgumentNullException(nameof(entity));
        return new EncounterStatusResponseModel
        {
            Id = entity.Id,
            Name = entity.Name,
            IsAuditable = entity.IsAuditable,
            IsBillable = entity.IsBillable,
            ForReview = entity.ForReview,
            HpcadminOnly = entity.HpcadminOnly
        };
    }

    public List<EncounterStatusResponseModel> Map(List<EncounterStatus> entities)
    {
        if (entities == null) throw new ArgumentNullException(nameof(entities));
        return entities.Select(Map).ToList();
    }
} 