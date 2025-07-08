using EduDoc.Api.EF;
using EduDoc.Api.Infrastructure.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Respawn;
using Respawn.Graph;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Xunit.Abstractions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

[assembly: CollectionBehavior(DisableTestParallelization = true)]
namespace EduDoc.Api.IntegrationTests.Infrastructure;


public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    public ITestOutputHelper? OutputHelper { get; set; }
    private ServiceProvider? _serviceProvider;
    private Respawner _respawner = default!;
    private string _connectionString = $"Server=(localdb)\\ProjectsV13;Database=edudoc.SQL_IT;Integrated Security=True;TrustServerCertificate=True;";
    
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("IntegrationTest");

        builder.ConfigureAppConfiguration((context, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "JwtSettings:JWTKey", "ThisIsAReallyLongAndSuperSecretKeyForTestingThatIsAtLeast512Bits" },
                    { "JwtSettings:JWTIssuer", "TestIssuer" },
                    { "JwtSettings:JWTAudience", "TestAudience" },
                    { "JwtSettings:JWTExpireMinutes", "60" }
                });
        });

        builder.ConfigureServices(services =>
        {
            // Remove existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<EdudocSqlContext>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Register SQL Server DbContext
            services.AddDbContext<EdudocSqlContext>(options =>
            {
                options.UseSqlServer(_connectionString);
            });

            // Optional: Ensure database is created
            _serviceProvider = services.BuildServiceProvider();
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
            context.Database.EnsureCreated();
        });

        _respawner = Respawner.CreateAsync(_connectionString, new RespawnerOptions
        {
            DbAdapter = DbAdapter.SqlServer,
            TablesToIgnore = new[] { new Table("__EFMigrationsHistory") }
        }).GetAwaiter().GetResult();
    }

    public async Task ResetDatabaseAsync()
    {
        using var scope = _serviceProvider!.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<EdudocSqlContext>();
        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync();
        await _respawner.ResetAsync(context.Database.GetDbConnection());
        await connection.CloseAsync();
    }

    public async Task SetupBaseData(EdudocSqlContext dbContext)
    {
        // Execute the actual post-deployment script to seed all base data
        var scriptPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "..", "..", "database", "SQL", "Script.PostDeployment.TableValues.sql");
        var scriptContent = await File.ReadAllTextAsync(scriptPath);

        // Execute the script (this handles all the MERGE statements for UserTypes, UserRoles, AuthUsers, Users, etc.)
        await dbContext.Database.ExecuteSqlRawAsync(scriptContent);
    }

    public async Task<TestResources> SetupTest()
    {
        var authenticatedClient = CreateClient();
        var unauthenticatedClient = CreateClient();
        var options = new DbContextOptionsBuilder<EdudocSqlContext>()
            .UseSqlServer(_connectionString);

        var dbContext = new EdudocSqlContext(options.Options);

        var _testResources = new TestResources()
        {
            AuthenticatedHttpClient = authenticatedClient,
            UnauthenticatedHttpClient = unauthenticatedClient,
            DbContext = dbContext,
            TestDatabaseRepository = new TestDatabaseRepository(dbContext),
        };

        await ResetDatabaseAsync();
        await SetupBaseData(dbContext);
        return _testResources;

    }
}