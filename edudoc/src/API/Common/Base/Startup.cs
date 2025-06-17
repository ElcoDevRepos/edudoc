using API.RoleManager;
using Autofac;
using BreckAPIBase.Startup;
using BreckAzureBase.Startup;

using BreckServiceBase.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Service;
using System.IO;
using breckhtmltopdf;
using Service.Core.Utilities;

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
                .AddBreckHtmlToPdf(Configuration)
                ;

            breck.Services.AddHealthChecks();
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
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            var adminSite = Configuration["AdminSite"];
            app.UseCors(builder =>
                        builder.WithOrigins(adminSite)
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
