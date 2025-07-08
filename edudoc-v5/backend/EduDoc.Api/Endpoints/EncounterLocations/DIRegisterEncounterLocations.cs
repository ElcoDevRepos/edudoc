using EduDoc.Api.Endpoints.EncounterLocations.Mappers;
using EduDoc.Api.Endpoints.EncounterLocations.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace EduDoc.Api.Endpoints.EncounterLocations
{
    public static class DIRegisterEncounterLocationsExtensions
    {
        public static IServiceCollection DIRegisterEncounterLocations(this IServiceCollection services)
        {
            services.AddTransient<IEncounterLocationMapper, EncounterLocationMapper>();
            services.AddScoped<IEncounterLocationRepository, EncounterLocationRepository>();
            return services;
        }
    }
} 