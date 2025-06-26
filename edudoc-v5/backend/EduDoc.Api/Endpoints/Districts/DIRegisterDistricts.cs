using EduDoc.Api.Endpoints.Districts.Mappers;
using EduDoc.Api.Endpoints.Districts.Repositories;

namespace EduDoc.Api.Endpoints.Districts
{
    public static class DIRegisterDistrictsExtensions
    {
        public static IServiceCollection DIRegisterDistricts(this IServiceCollection services)
        {
            services.AddTransient<IDistrictMapper, DistrictMapper>();
            services.AddScoped<IDistrictRepository, DistrictRepository>();

            return services;
        }
    }
} 