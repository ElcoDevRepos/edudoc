using EduDoc.Api.Endpoints.EvaluationTypes.Mappers;
using EduDoc.Api.Endpoints.EvaluationTypes.Repositories;

namespace EduDoc.Api.Endpoints.EvaluationTypes
{
    public static class DIRegisterEvaluationTypesExtensions
    {
        public static IServiceCollection DIRegisterEvaluationTypes(this IServiceCollection services)
        {
            services.AddTransient<IEvaluationTypeMapper, EvaluationTypeMapper>();
            services.AddScoped<IEvaluationTypeRepository, EvaluationTypeRepository>();

            return services;
        }
    }
} 