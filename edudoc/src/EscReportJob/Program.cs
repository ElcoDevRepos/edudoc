using Service.Core.Utilities;
using Service.Core.Utilities;
using System;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using BreckAPIBase.Startup;
using Service.EscReport;
using Model;
using BreckServiceBase.Utilities.Interfaces;
using Microsoft.Extensions.Configuration;
using Service.ActivitySummaries;
using Service.Utilities;
using BreckServiceBase.Utilities;
using Service.Utilities.Excel;
using Service.Base;

namespace EscReportJob
{
    public class Program
    {
        public static void Main(string[] args)
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
            services.AddTransient<IDocumentHelper, DocumentHelper>();
            services.AddTransient<IFileStorageHandler, OnServerFileStorageHandler>();
            services.AddTransient<IConfigurationSettings, ConfigurationSettings>();
            services.AddTransient<IEmailHelper, EmailHelper>();
            services.AddTransient<IExcelBuilder, ExcelBuilder>();
            services.AddScoped<IEscReportService, EscReportService>();
            services.AddScoped<IPrimaryContext, PrimaryContext>();

            services.AddTransient<Application>();

            var serviceProvider = services.BuildServiceProvider();
            serviceProvider.GetService<Application>().Run();
        }
    }
}
