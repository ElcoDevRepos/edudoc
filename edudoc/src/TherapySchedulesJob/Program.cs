using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using BreckServiceBase.Utilities.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Model;
using Service.CaseLoads.CaseLoadOptions;
using Service.Encounters;
using Service.Utilities;
using System;

namespace TherapySchedulesJob
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
            services.AddTransient<IConfigurationSettings, ConfigurationSettings>();
            services.AddTransient<IEmailHelper, EmailHelper>();
            services.AddTransient<Service.Core.Utilities.IEmailConfiguration, EmailConfiguration>();
            services.AddTransient<IConfigurationSettings, ConfigurationSettings>();
            services.AddScoped<IEncounterService, EncounterService>();
            services.AddScoped<IEncounterStudentService, EncounterStudentService>();
            services.AddScoped<IEncounterStudentStatusService, EncounterStudentStatusService>();
            services.AddScoped<IEncounterStudentCptCodeService, EncounterStudentCptCodeService>();
            services.AddScoped<ICaseLoadGoalService, CaseLoadGoalService>();
            services.AddScoped<IPrimaryContext, PrimaryContext>();

             var serviceProvider = services.BuildServiceProvider();
            serviceProvider.GetService<IEncounterService>().BuildTodayFromStudentTherapySchedules();

            return 0;

        }
    }
}
