using EduDoc.Api.EF;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EduDoc.Api.IntegrationTests;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    private readonly string _databaseName = $"InMemoryDbForTesting-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("IntegrationTest");

        builder.ConfigureAppConfiguration((context, conf) =>
        {
            conf.AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "JwtSettings:JWTKey", "ThisIsAReallyLongAndSuperSecretKeyForTestingThatIsAtLeast512Bits" },
                { "JwtSettings:JWTIssuer", "TestIssuer" }
            });
        });

        builder.ConfigureServices(services =>
        {
            services.AddDbContext<EdudocSqlContext>(options =>
            {
                options.UseInMemoryDatabase(_databaseName);
            });
        });
    }
} 