using BreckAPIBase.Startup;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Model;
using Service.PendingReferrals;
using Service.ReferralReports;
using System;

namespace PendingReferralsJob
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

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

                services.AddScoped<IPendingReferralService, PendingReferralService>();
                services.AddScoped<IReferralReportsService, ReferralReportsService>();
                services.AddScoped<IPrimaryContext, PrimaryContext>();
                services.AddScoped<IPrimaryContext, PrimaryContext>();
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

                services.AddTransient<Application>();

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

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception:{ex.ToString()}");
                throw;
            }
        }
    }
}
