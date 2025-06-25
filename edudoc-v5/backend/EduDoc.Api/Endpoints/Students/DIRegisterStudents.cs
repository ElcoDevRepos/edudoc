using EduDoc.Api.Endpoints.Students.Mappers;
using EduDoc.Api.Endpoints.Students.Repositories;
using EduDoc.Api.Endpoints.Students.Validators;

namespace EduDoc.Api.Endpoints.Students
{
    public static class DIRegisterStudentsExtensions
    {
        public static IServiceCollection DIRegisterStudents(this IServiceCollection services)
        {
            services.AddTransient<IStudentMapper, StudentMapper>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<StudentSearchRequestValidator>();

            return services;
        }
    }
} 