using Autofac;
using FluentValidation;
using System.Reflection;
using Module = Autofac.Module;

namespace Service
{
    public class ValidatorModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("Service"))
                .Where(t => t.Name.EndsWith("Validator"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            // also load the ValidatorFactory
            builder.RegisterType<AutofacValidatorFactory>().As<IValidatorFactory>();
        }
    }
}