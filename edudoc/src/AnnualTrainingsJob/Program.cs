using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using BreckServiceBase.Utilities.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Model;
using Service.Encounters;
using Service.Messages;
using Service.ProviderTrainings;
using Service.Utilities;
using System;


namespace AnnualTrainingsJob
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
            services.AddTransient<IConfigurationSettings, ConfigurationSettings>();
            services.AddTransient<Service.Core.Utilities.IEmailConfiguration, EmailConfiguration>();
            services.AddTransient<IEmailHelper, EmailHelper>();
            services.AddScoped<IPrimaryContext, PrimaryContext>();
            services.AddScoped<IProviderTrainingService, ProviderTrainingService>();
            services.AddScoped<IMessageService, MessageService>();

            var serviceProvider = services.BuildServiceProvider();
            serviceProvider.GetService<Application>().Run();

            return 0;
        }
    }
}

