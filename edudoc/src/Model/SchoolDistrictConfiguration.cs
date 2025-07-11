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

    // SchoolDistricts
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class SchoolDistrictConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SchoolDistrict>
    {
        public SchoolDistrictConfiguration()
            : this("dbo")
        {
        }

        public SchoolDistrictConfiguration(string schema)
        {
            Property(x => x.Name).IsUnicode(false);
            Property(x => x.Code).IsUnicode(false);
            Property(x => x.EinNumber).IsUnicode(false);
            Property(x => x.IrnNumber).IsUnicode(false);
            Property(x => x.NpiNumber).IsUnicode(false);
            Property(x => x.ProviderNumber).IsUnicode(false);
            Property(x => x.BecameTradingPartnerDate).IsOptional();
            Property(x => x.BecameClientDate).IsOptional();
            Property(x => x.RevalidationDate).IsOptional();
            Property(x => x.ValidationExpirationDate).IsOptional();
            Property(x => x.ProgressReportsSent).IsOptional();
            Property(x => x.NotesRequiredDate).IsOptional();
            Property(x => x.Notes).IsOptional().IsUnicode(false);
            Property(x => x.ModifiedById).IsOptional();
            Property(x => x.DateCreated).IsOptional();
            Property(x => x.DateModified).IsOptional();
            Property(x => x.AddressId).IsOptional();
            Property(x => x.AccountManagerId).IsOptional();
            Property(x => x.AccountAssistantId).IsOptional();
            Property(x => x.TreasurerId).IsOptional();
            Property(x => x.SpecialEducationDirectorId).IsOptional();
            Property(x => x.MerId).IsOptional();

            HasMany(t => t.Users_DistrictAdminId).WithMany(t => t.SchoolDistricts_DistrictId).Map(m =>
            {
                m.ToTable("SchoolDistrictAdmins", "dbo");
                m.MapLeftKey("DistrictId");
                m.MapRightKey("DistrictAdminId");
            });
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
