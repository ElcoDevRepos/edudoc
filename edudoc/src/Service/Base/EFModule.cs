using Autofac;
using Model;

namespace Service
{
    public class EfModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType(typeof(PrimaryContext)).As(typeof(IPrimaryContext)).InstancePerLifetimeScope();
        }
    }
}
