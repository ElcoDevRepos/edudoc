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

    // BillingScheduleDistricts
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class BillingScheduleDistrictConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<BillingScheduleDistrict>
    {
        public BillingScheduleDistrictConfiguration()
            : this("dbo")
        {
        }

        public BillingScheduleDistrictConfiguration(string schema)
        {
            Property(x => x.DateCreated).IsOptional();

            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
