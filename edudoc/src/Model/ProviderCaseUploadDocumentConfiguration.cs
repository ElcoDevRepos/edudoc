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

    // ProviderCaseUploadDocuments
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ProviderCaseUploadDocumentConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ProviderCaseUploadDocument>
    {
        public ProviderCaseUploadDocumentConfiguration()
            : this("dbo")
        {
        }

        public ProviderCaseUploadDocumentConfiguration(string schema)
        {
            Property(x => x.Name).IsUnicode(false);
            Property(x => x.UploadedBy).IsOptional();
            Property(x => x.FilePath).IsUnicode(false);
            Property(x => x.DateProcessed).IsOptional();
            Property(x => x.DateError).IsOptional();

            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
