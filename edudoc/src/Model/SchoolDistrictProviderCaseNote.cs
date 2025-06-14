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

    // SchoolDistrictProviderCaseNotes
    [Table("SchoolDistrictProviderCaseNotes", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class SchoolDistrictProviderCaseNote: IEntity
    {
        // SchoolDistrictProviderCaseNote
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(@"Id", Order = 1, TypeName = "int")]
        [Index(@"PK_SchoolDistrictProviderCaseNotes", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Id")]
        public int Id { get; set; } // Id (Primary key)

        [Column(@"SchoolDistrictId", Order = 2, TypeName = "int")]
        [Display(Name = "School district ID")]
        public int SchoolDistrictId { get; set; } // SchoolDistrictId

        [Column(@"ProviderTitleId", Order = 3, TypeName = "int")]
        [Display(Name = "Provider title ID")]
        public int ProviderTitleId { get; set; } // ProviderTitleId

        // Foreign keys

        /// <summary>
        /// Parent ProviderTitle pointed by [SchoolDistrictProviderCaseNotes].([ProviderTitleId]) (FK_SchoolDistrictProviderCaseNotes_Providers)
        /// </summary>
        [InverseProperty("SchoolDistrictProviderCaseNotes")]
        [ForeignKey("ProviderTitleId")] public ProviderTitle ProviderTitle { get; set; } // FK_SchoolDistrictProviderCaseNotes_Providers

        /// <summary>
        /// Parent SchoolDistrict pointed by [SchoolDistrictProviderCaseNotes].([SchoolDistrictId]) (FK_SchoolDistrictProviderCaseNotes_SchoolDistricts)
        /// </summary>
        [InverseProperty("SchoolDistrictProviderCaseNotes")]
        [ForeignKey("SchoolDistrictId")] public SchoolDistrict SchoolDistrict { get; set; } // FK_SchoolDistrictProviderCaseNotes_SchoolDistricts

        public SchoolDistrictProviderCaseNote()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
