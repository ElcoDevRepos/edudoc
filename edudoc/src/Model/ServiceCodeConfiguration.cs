// <auto-generated>
// ReSharper disable ConvertPropertyToExpressionBody
// ReSharper disable DoNotCallOverridableMethodsInConstructor
// ReSharper disable EmptyNamespace
// ReSharper disable InconsistentNaming
// ReSharper disable PartialMethodWithSinglePart
// ReSharper disable PartialTypeWithSinglePart
// ReSharper disable RedundantNameQualifier
// ReSharper disable RedundantOverridenMember
// ReSharper disable UseNameofExpression
#pragma warning disable 1591    //  Ignore "Missing XML Comment" warning

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Model
{
    using Newtonsoft.Json;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Data.SqlClient;
    using TrackerEnabledDbContext;

    // ServiceCodes
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ServiceCodeConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ServiceCode>
    {
        public ServiceCodeConfiguration()
            : this("dbo")
        {
        }

        public ServiceCodeConfiguration(string schema)
        {
            Property(x => x.Name).IsUnicode(false);
            Property(x => x.Code).IsUnicode(false);
            Property(x => x.Area).IsOptional().IsUnicode(false);
            HasMany(t => t.Goals).WithMany(t => t.ServiceCodes).Map(m =>
            {
                m.ToTable("GoalServiceCodes", "dbo");
                m.MapLeftKey("ServiceCodeId");
                m.MapRightKey("GoalId");
            });
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
