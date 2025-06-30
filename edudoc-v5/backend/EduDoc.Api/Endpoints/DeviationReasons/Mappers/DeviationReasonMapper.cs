using EduDoc.Api.EF.Models;
using EduDoc.Api.Endpoints.DeviationReasons.Models;

namespace EduDoc.Api.Endpoints.DeviationReasons.Mappers;

public interface IDeviationReasonMapper
{
    DeviationReasonResponseModel Map(StudentDeviationReason entity);
    List<DeviationReasonResponseModel> Map(List<StudentDeviationReason> entities);
}

public class DeviationReasonMapper : IDeviationReasonMapper
{
    public DeviationReasonResponseModel Map(StudentDeviationReason entity)
    {
        if (entity == null) throw new ArgumentNullException(nameof(entity));
        return new DeviationReasonResponseModel
        {
            Id = entity.Id,
            Name = entity.Name
        };
    }

    public List<DeviationReasonResponseModel> Map(List<StudentDeviationReason> entities)
    {
        if (entities == null) throw new ArgumentNullException(nameof(entities));
        return entities.Select(Map).ToList();
    }
} 