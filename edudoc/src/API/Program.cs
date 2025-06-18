using Autofac.Extensions.DependencyInjection;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // ASP.NET Core 3.0+:
            // The UseServiceProviderFactory call attaches the
            // Autofac provider to the generic hosting mechanism.
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    var builtConfig = config.Build();
                    var keyVaultUri = builtConfig["KeyVaultUri"];
                    if (!string.IsNullOrEmpty(keyVaultUri))
                    {
                        config.AddAzureKeyVault(new Uri(keyVaultUri), new DefaultAzureCredential());
                    }
                })
                .UseServiceProviderFactory(new AutofacServiceProviderFactory())
                .ConfigureWebHostDefaults(webHostBuilder =>
                {
                    var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    if (environment == Environments.Development)
                    {
                        webHostBuilder.UseKestrel().UseUrls("http://0.0.0.0:9000/");
                    }
                    
                    webHostBuilder.UseStartup<Startup>();
                }).Build().Run();

        }

    }
}
