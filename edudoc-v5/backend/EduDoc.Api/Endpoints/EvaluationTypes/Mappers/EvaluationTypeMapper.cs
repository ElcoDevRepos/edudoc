using EduDoc.Api.Endpoints.EvaluationTypes.Models;
using EduDoc.Api.EF.Models;

namespace EduDoc.Api.Endpoints.EvaluationTypes.Mappers
{
    public interface IEvaluationTypeMapper
    {
        EvaluationTypeResponseModel Map(EvaluationType entity);
        List<EvaluationTypeResponseModel> Map(List<EvaluationType> entities);
    }

    public class EvaluationTypeMapper : IEvaluationTypeMapper
    {
        public EvaluationTypeResponseModel Map(EvaluationType entity)
        {
            return new EvaluationTypeResponseModel
            {
                Id = entity.Id,
                Name = entity.Name
            };
        }

        public List<EvaluationTypeResponseModel> Map(List<EvaluationType> entities)
        {
            return entities.Select(Map).ToList();
        }
    }
} 