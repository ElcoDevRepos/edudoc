using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using BreckServiceBase.Utilities.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Model;
using Service.SchoolDistricts.Rosters;
using Service.SchoolDistricts.Rosters.RosterUploads;
using Service.Utilities;
using System;
using Service.SchoolDistricts.ProviderCaseUploads;
using Service.Students.Merge;

namespace RosterUploadJob
{

    class Program
    {
        public static int Main(string[] args)
        {

            var env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (string.IsNullOrWhiteSpace(env))
            {
                env = "Development";
            }

            Console.WriteLine(env);

            var config = new ConfigurationBuilder();
            config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                  .AddJsonFile($"appsettings.{env}.json", optional: true, reloadOnChange: true);

            config.AddEnvironmentVariables();
            if (args != null)
            {
                config.AddCommandLine(args);
            }
            IConfiguration configuration = config.Build();

            var services = new ServiceCollection();
            services.AddSingleton(configuration);
            services.AddTransient<Application>();
            services.AddTransient<IDocumentUtilityService, DocumentUtilityService>();
            services.AddTransient<IDocumentHelper, DocumentHelper>();
            services.AddTransient<IConfigurationSettings, ConfigurationSettings>();
            services.AddTransient<Service.Core.Utilities.IEmailConfiguration, EmailConfiguration>();
            services.AddTransient<IEmailHelper, EmailHelper>();
            services.AddTransient<IFileStorageHandler, OnServerFileStorageHandler>();
            services.AddScoped<IPrimaryContext, PrimaryContext>();
            services.AddScoped<ISchoolDistrictRosterService, SchoolDistrictRosterService>();
            services.AddScoped<ISchoolDistrictRosterDocumentService, SchoolDistrictRosterDocumentService>();
            services.AddScoped<IRosterUploadService, RosterUploadService>();
            services.AddScoped<IProviderCaseUploadService, ProviderCaseUploadService>();
            services.AddScoped<IProviderCaseUploadDocumentService, ProviderCaseUploadDocumentService>();
            services.AddScoped<IMergeStudentsService, MergeStudentsService>();

            var serviceProvider = services.BuildServiceProvider();
            serviceProvider.GetService<Application>().Run();

            return 0;

        }
    }
}
