using API.Common.ApplicationInsights;
using API.Middleware;
using API.RoleManager;
using Autofac;
using Autofac.Core;
using BreckAPIBase.Startup;
using BreckAzureBase.Startup;
using breckhtmltopdf;
using BreckServiceBase.Utilities;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Microsoft.OpenApi.Models;
using PdfSharp.Charting;
using Service;
using Service.Core.Utilities;
using System.IO;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public ILifetimeScope AutofacContainer { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var breck = services
                .AddBreckenridgeInstance(Configuration, options =>
                    {
                        options.IgnoreCsrfActionNames.Add(nameof(API.Messages.MessagesController.GetLoginMessages));
                    })
                .AddBreckenridgeAzure(Configuration)
                .AddBreckHtmlToPdf(Configuration);

            services.AddSingleton<ITelemetryInitializer, TraceIdTelemetryInitializer>();

            services.AddLogging(logging =>
            {
                logging.ClearProviders();
                logging.Configure(options =>
                {
                    options.ActivityTrackingOptions = ActivityTrackingOptions.TraceId | ActivityTrackingOptions.SpanId;

                });
                logging.SetMinimumLevel(LogLevel.Debug);
                if (!string.IsNullOrEmpty(Configuration["ApplicationInsights:ConnectionString"])) {
                    logging.AddApplicationInsights(
                    configureTelemetryConfiguration: config =>
                        config.ConnectionString = Configuration["ApplicationInsights:ConnectionString"],
                        configureApplicationInsightsLoggerOptions: options => { });
                }
            });

          

            services.Configure<LoggerFilterOptions>(options =>
            {
                options.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Debug);
            });

            breck.Services.AddHealthChecks();

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
               // options.SwaggerDoc("v4", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "EduDoc API", Version = "v4" });
               // options.AddServer(new OpenApiServer { Url = "/v4" });
            });

            services.AddApplicationInsightsTelemetry();
        }

        // ConfigureContainer is where you can register things directly
        // with Autofac. This runs after ConfigureServices so the things
        // here will override registrations made in ConfigureServices.
        // Don't build the container; that gets done for you by the factory.
        public void ConfigureContainer(ContainerBuilder builder)
        {
            //// Register your own things directly with Autofac, like:
            builder.RegisterModule(new ServiceModule());
            builder.RegisterModule(new EfModule());
            builder.RegisterModule(new ValidatorModule());
            builder.RegisterModule(new DtoValidationModule());
            builder.RegisterType<InMemoryRoleManager>().As<IRoleManager>().SingleInstance();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseMiddleware<RequestResponseLoggingMiddleware>();
            if (env.IsDevelopment())
            {
               // app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                // inject this .net resource to add interceptors to swagger for managing auth 
                c.InjectJavascript("/Swagger/SwaggerFrontendCustomization.js");
                // c.SwaggerEndpoint("/swagger/v4/swagger.json", "EduDoc API v4");
            });

            string[] mobileOrigins = Configuration["MobileOrigins"].Split(',');
            string[] adminSite = [Configuration["AdminSite"]];
            string[] corsSites = [.. adminSite, .. mobileOrigins];
            app.UseCors(builder =>
                        builder.WithOrigins(corsSites)
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials()
                              .WithExposedHeaders(new string[] { "X-List-Count", "X-Update-Roles" })
                        );

            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/api/breck-health-check");

                // map a js request to an embedded resource
                endpoints.MapGet("/Swagger/SwaggerFrontendCustomization.js", async context =>
                {
                    var assembly = typeof(Program).Assembly;
                    var stream = assembly.GetManifestResourceStream("API.Swagger.SwaggerFrontendCustomization.js");
                    context.Response.ContentType = "application/javascript";
                    if (stream != null)
                    {
                        await stream.CopyToAsync(context.Response.Body);
                    }
                });
            });

            app.UseResponseCompression();

            // Sets up document serving (local files for now, can add Azure blob later)
            app.UseStaticFiles(GetStaticFileOpts(Configuration));


        }

        /// <summary>
        ///     Creates static file options for serving docs.
        /// </summary>
        private static StaticFileOptions GetStaticFileOpts(IConfiguration configuration)
        {
            var options = new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), configuration.GetDocsRootDirectory())),
                RequestPath = "/docs"
            };
            return options;
        }
    }
}
