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

    // ProviderCaseUploads
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ProviderCaseUploadConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ProviderCaseUpload>
    {
        public ProviderCaseUploadConfiguration()
            : this("dbo")
        {
        }

        public ProviderCaseUploadConfiguration(string schema)
        {
            Property(x => x.ProviderId).IsOptional();
            Property(x => x.FirstName).IsOptional().IsUnicode(false);
            Property(x => x.MiddleName).IsOptional().IsUnicode(false);
            Property(x => x.LastName).IsOptional().IsUnicode(false);
            Property(x => x.Grade).IsOptional().IsUnicode(false);
            Property(x => x.DateOfBirth).IsOptional().IsUnicode(false);
            Property(x => x.School).IsOptional().IsUnicode(false);
            Property(x => x.ModifiedById).IsOptional();
            Property(x => x.DateModified).IsOptional();
            Property(x => x.HasDuplicates).IsOptional();
            Property(x => x.HasDataIssues).IsOptional();
            Property(x => x.StudentId).IsOptional();

            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
