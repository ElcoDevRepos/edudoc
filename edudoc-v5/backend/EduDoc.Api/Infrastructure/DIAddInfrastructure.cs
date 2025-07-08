using EduDoc.Api.Endpoints.Encounters.Mappers;
using EduDoc.Api.Endpoints.Encounters.Repositories;
using EduDoc.Api.Infrastructure.Formatters;

namespace EduDoc.Api.Infrastructure
{
    public static class DIAddInfrastructureExtensions
    {
        public static IServiceCollection DIAddInfrastructure(this IServiceCollection services)
        {
            services.AddTransient<ISearchFormatter, SearchFormatter>();

            return services;
        }
    }
}
