using System;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using BreckAPIBase.Startup;
using Microsoft.Extensions.Configuration;
using Service.PendingReferrals;
using Model;
using Service.ReferralReports;

namespace PendingReferralsJob
{
    public class Program
    {
        public static void Main(string[] args)
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

            services.AddTransient<Application>();

            var serviceProvider = services.BuildServiceProvider();
            serviceProvider.GetService<Application>().Run();
        }
    }
}
