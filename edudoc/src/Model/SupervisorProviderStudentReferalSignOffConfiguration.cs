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

    // SupervisorProviderStudentReferalSignOffs
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class SupervisorProviderStudentReferalSignOffConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SupervisorProviderStudentReferalSignOff>
    {
        public SupervisorProviderStudentReferalSignOffConfiguration()
            : this("dbo")
        {
        }

        public SupervisorProviderStudentReferalSignOffConfiguration(string schema)
        {
            Property(x => x.SignOffText).IsOptional().IsUnicode(false);
            Property(x => x.SignOffDate).IsOptional();
            Property(x => x.SignedOffById).IsOptional();
            Property(x => x.ServiceCodeId).IsOptional();
            Property(x => x.EffectiveDateFrom).IsOptional();
            Property(x => x.EffectiveDateTo).IsOptional();
            Property(x => x.ModifiedById).IsOptional();
            Property(x => x.DateCreated).IsOptional();
            Property(x => x.DateModified).IsOptional();

            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
