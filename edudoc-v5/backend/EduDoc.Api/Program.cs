using Azure.Identity;
using EduDoc.Api.Configuration;
using EduDoc.Core.Authentication;
using EduDoc.Infrastructure.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

try
{

    var builder = WebApplication.CreateBuilder(args);

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

    // Add health checks
    builder.Services.AddHealthChecks();

    var logger = loggerFactory.CreateLogger("Startup");

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("jwtSettings").Get<JwtSettings>() 
            ?? throw new InvalidOperationException("JWT settings are not configured");

        // --- START DEBUG: Log JWT settings to verify Key Vault connection ---
        if (!string.IsNullOrEmpty(jwtSettings.JWTKey))
        {
            logger.LogWarning("JWTKey loaded with length: {KeyLength}", jwtSettings.JWTKey.Length);
            logger.LogWarning("JWTIssuer loaded with value: {Issuer}", jwtSettings.JWTIssuer);
        }
        else
        {
            logger.LogWarning("JWTKey or JWTIssuer is NOT loaded correctly from configuration.");
        }
        // --- END DEBUG ---
        
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.JWTKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.JWTIssuer,
            ValidateAudience = false, // Legacy app uses "self" which doesn't match tokens
            ClockSkew = TimeSpan.Zero,
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 }
        };
    });

    builder.Services.AddAuthorization();
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

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Test"))
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

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