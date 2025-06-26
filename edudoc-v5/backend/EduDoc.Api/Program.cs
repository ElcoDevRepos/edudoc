using Azure.Identity;
using EduDoc.Api.EF;
using EduDoc.Api.Endpoints.Encounters;
using EduDoc.Api.Endpoints.Encounters.Queries;
using EduDoc.Api.Endpoints.Encounters.Repositories;
using EduDoc.Api.Endpoints.EvaluationTypes;
using EduDoc.Api.Infrastructure.ApplicationInsights;
using EduDoc.Api.Infrastructure.Authentication;
using EduDoc.Api.Infrastructure.Authorization;
using EduDoc.Api.Infrastructure.Authorization.Handlers;
using EduDoc.Api.Infrastructure.Configuration;
using EduDoc.Api.Infrastructure.Middleware;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using EduDoc.Api.Endpoints.Students;
using EduDoc.Api.Endpoints.Districts;


try
{

    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddSingleton<ITelemetryInitializer, TraceIdTelemetryInitializer>();

    builder.Logging.AddApplicationInsights(
    configureTelemetryConfiguration: config =>
        config.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"],
    configureApplicationInsightsLoggerOptions: options => { });

    builder.Services.Configure<LoggerFilterOptions>(options =>
    {
        options.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Debug);
    });

    var loggerFactory = LoggerFactory.Create(logging =>
    {
        logging.Configure(options =>
        {
            options.ActivityTrackingOptions = ActivityTrackingOptions.TraceId | ActivityTrackingOptions.SpanId;
        });
        logging.AddConsole();
        logging.SetMinimumLevel(LogLevel.Debug);
        logging.AddApplicationInsights(
        configureTelemetryConfiguration: config =>
            config.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"],
        configureApplicationInsightsLoggerOptions: options => { }
    );});


    // Add Azure Key Vault configuration
    var keyVaultUri = builder.Configuration["KeyVaultUri"];
    if (!string.IsNullOrEmpty(keyVaultUri))
    {
        builder.Configuration.AddAzureKeyVault(new Uri(keyVaultUri), new DefaultAzureCredential());
    }

    // Add services to the container.
    builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
    builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

    // Register MediatR
    builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetEncounterByIdQuery).Assembly));

    // Add health checks
    builder.Services.AddHealthChecks();

    if (builder.Environment.EnvironmentName != "IntegrationTest")
    {
        builder.Services.AddDbContext<EdudocSqlContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
    }

    // Add application services
    builder.Services.AddScoped<IEncounterRepository, EncounterRepository>();

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("jwtSettings").Get<JwtSettings>() 
            ?? throw new InvalidOperationException("JWT settings are not configured");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.JWTKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.JWTIssuer,
            ValidateAudience = false, // Legacy app uses "self" which doesn't match tokens
            ClockSkew = TimeSpan.Zero,
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 },
        };
    });

    builder.Services.DIRegisterEncounters();
    builder.Services.DIRegisterEvaluationTypes();
    builder.Services.DIRegisterStudents();
    builder.Services.DIRegisterDistricts();
    
    // Register authorization handler
    builder.Services.AddSingleton<IAuthorizationHandler, UserRoleHandler>();
    
    builder.Services.AddAuthorization(AuthorizationPolicies.ConfigurePolicies);
    builder.Services.AddControllers();


    // Add CORS configuration
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            var corsSettings = builder.Configuration.GetSection("CorsSettings").Get<CorsSettings>();
            
            policy
                .WithOrigins(corsSettings?.AllowedOrigins?.ToArray() ?? Array.Empty<string>())
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders(corsSettings?.ExposedHeaders?.ToArray() ?? Array.Empty<string>());

            // Only allow dynamic origin checking in development
            if (builder.Environment.IsDevelopment())
            {
                policy.SetIsOriginAllowed(origin => true);
            }
        });
    });

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "EduDoc API", Version = "v1" });


        if (!builder.Environment.IsDevelopment())
        {
            options.AddServer(new OpenApiServer { Url = "/v5" });
        }

        options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Description = "Enter your JWT token below:",
            Name = "Authorization",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        });

        options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new List<string>()
            }
        });
    });

    var app = builder.Build();

    app.UseMiddleware<ExceptionMiddleware>();
    app.UseMiddleware<RequestResponseLoggingMiddleware>();

    app.UseSwagger();
    app.UseSwaggerUI();

    // Add CORS middleware before auth
    app.UseCors();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    // Add health check endpoint
    app.MapHealthChecks("/api/health");

    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Logger was null. {ex.ToString()}");
    throw;
}

// Make the Program class accessible to test projects
public partial class Program { }