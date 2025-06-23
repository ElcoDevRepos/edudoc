using BreckServiceBase.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using BreckServiceBase.Utilities.Models;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Model;
using Service.Core.Utilities;
using Service.Core.Utilities;
using Service.Encounters;
using Service.Messages;
using Service.ProviderTrainings;
using Service.Students;
using Service.Utilities;
using System;


namespace AnnualTrainingsJob
{
    class Program
    {
        public static int Main(string[] args)
        {
            try
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
                services.AddScoped<IPrimaryContext, PrimaryContext>();
                services.AddScoped<IStudentService, StudentService>();
                services.AddLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                    logging.AddApplicationInsightsWebJobs(telemetryConfiguration =>
                    {
                        telemetryConfiguration.ConnectionString = configuration["ApplicationInsights:JobsConnectionString"];
                    });
                    logging.SetMinimumLevel(LogLevel.Information);
                });

                var serviceProvider = services.BuildServiceProvider();
                var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
                try
                {
                    logger.LogInformation("Starting job");
                    serviceProvider.GetService<Application>().Run();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Exception");
                    throw;
                }

                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception:{ex.ToString()}");
                throw;
            }
        }
    }
}

