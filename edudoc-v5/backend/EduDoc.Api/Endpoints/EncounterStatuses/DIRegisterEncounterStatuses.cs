using Microsoft.Extensions.DependencyInjection;
using EduDoc.Api.Endpoints.EncounterStatuses.Repositories;
using EduDoc.Api.Endpoints.EncounterStatuses.Mappers;

namespace EduDoc.Api.Endpoints.EncounterStatuses;

public static class DIRegisterEncounterStatusesExtensions
{
    public static IServiceCollection DIRegisterEncounterStatuses(this IServiceCollection services)
    {
        services.AddScoped<IEncounterStatusRepository, EncounterStatusRepository>();
        services.AddTransient<IEncounterStatusMapper, EncounterStatusMapper>();
        return services;
    }
} 