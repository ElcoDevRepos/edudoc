using Microsoft.Extensions.DependencyInjection;
using EduDoc.Api.Endpoints.DeviationReasons.Repositories;
using EduDoc.Api.Endpoints.DeviationReasons.Mappers;

namespace EduDoc.Api.Endpoints.DeviationReasons;

public static class DIRegisterDeviationReasonsExtensions
{
    public static IServiceCollection DIRegisterDeviationReasons(this IServiceCollection services)
    {
        services.AddScoped<IDeviationReasonRepository, DeviationReasonRepository>();
        services.AddTransient<IDeviationReasonMapper, DeviationReasonMapper>();
        return services;
    }
} 