using EduDoc.Api.Endpoints.Encounters.Mappers;
using EduDoc.Api.Endpoints.Encounters.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System.Reflection.Metadata;

namespace EduDoc.Api.Endpoints.Encounters
{
    public static class DIRegisterEncountersExtensions
    {
        public static IServiceCollection DIRegisterEncounters(this IServiceCollection services)
        {
            services.AddTransient<IEncounterMapper, EncounterMapper>();
            services.AddScoped<IEncounterRepository, EncounterRepository>();

            return services;
        }
    }
}
