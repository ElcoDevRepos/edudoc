using Azure.Identity;
using EduDoc.Api.EF;
using EduDoc.Api.Endpoints.DeviationReasons;
using EduDoc.Api.Endpoints.Encounters;
using EduDoc.Api.Endpoints.Encounters.Queries;
using EduDoc.Api.Endpoints.Encounters.Repositories;
using EduDoc.Api.Endpoints.EvaluationTypes;
using EduDoc.Api.Endpoints.Students;
using EduDoc.Api.Infrastructure;
using EduDoc.Api.Infrastructure.ApplicationInsights;
using EduDoc.Api.Infrastructure.Authentication;
using EduDoc.Api.Infrastructure.Authorization;
using EduDoc.Api.Infrastructure.Authorization.Handlers;
using EduDoc.Api.Infrastructure.Configuration;
using EduDoc.Api.Infrastructure.Formatters;
using EduDoc.Api.Infrastructure.Middleware;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

public class Startup
{
    public IConfiguration Configuration { get; private set; }
    public IWebHostEnvironment Environment { get; }

    public Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
        Configuration = configuration;
        Environment = environment;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<ITelemetryInitializer, TraceIdTelemetryInitializer>();

        services.AddLogging(logging =>
        {
            logging.ClearProviders();
            logging.AddConsole();
            logging.SetMinimumLevel(LogLevel.Debug);
            logging.AddApplicationInsights(
                configureTelemetryConfiguration: config =>
                    config.ConnectionString = Configuration["ApplicationInsights:ConnectionString"],
                configureApplicationInsightsLoggerOptions: options => { });
        });

        if (!string.IsNullOrEmpty(Configuration["KeyVaultUri"]))
        {
           this.Configuration = new ConfigurationBuilder()
                .AddConfiguration(Configuration)
                .AddAzureKeyVault(new Uri(this.Configuration["KeyVaultUri"]), new DefaultAzureCredential())
                .Build();
        }

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetEncounterByIdQuery).Assembly));
        services.AddHealthChecks();

        if (Environment.EnvironmentName != "IntegrationTest")
        {
            services.AddDbContext<EdudocSqlContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
        }

        this.AddAuth(services);

        // register endpoints here
        services.DIAddInfrastructure();
        services.DIRegisterEncounters();
        services.DIRegisterEvaluationTypes();
        services.DIRegisterStudents();
        services.DIRegisterDeviationReasons();

        services.AddControllers();

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                var corsSettings = Configuration.GetSection("CorsSettings").Get<CorsSettings>();

                policy
                    .WithOrigins(corsSettings?.AllowedOrigins?.ToArray() ?? Array.Empty<string>())
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithExposedHeaders(corsSettings?.ExposedHeaders?.ToArray() ?? Array.Empty<string>());

                if (Environment.IsDevelopment())
                {
                    policy.SetIsOriginAllowed(origin => true);
                }
            });
        });

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "EduDoc API", Version = "v1" });

            if (!Environment.IsDevelopment())
            {
                options.AddServer(new OpenApiServer { Url = "/v5" });
            }

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "Enter your JWT token below:",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    new List<string>()
                }
            });
        });
    }

    private void AddAuth(IServiceCollection services)
    {
        services.Configure<JwtSettings>(Configuration.GetSection("JwtSettings"));
        services.AddScoped<IAuthenticationService, AuthenticationService>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            var jwtSettings = Configuration.GetSection("JwtSettings").Get<JwtSettings>() ??
                throw new InvalidOperationException("JWT settings are not configured");

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.JWTKey)),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.JWTIssuer,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero,
                ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 },
            };
        });
        services.AddSingleton<IAuthorizationHandler, UserRoleHandler>();
        services.AddAuthorization(AuthorizationPolicies.ConfigurePolicies);
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        app.UseMiddleware<RequestResponseLoggingMiddleware>();
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseCors();
        app.UseAuthentication();
        app.UseRouting();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers().RequireAuthorization();
            endpoints.MapHealthChecks("/api/health");
        });
    }
}