using Autofac;
using System.Reflection;
using Module = Autofac.Module;

namespace API
{
    public class DtoValidationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("API"))
                .Where(t => t.Name.EndsWith("Validator"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();
        }
    }
}