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
    [Table("ProviderCaseUploadDocuments", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ProviderCaseUploadDocument: IEntity, IBasicNameEntity
    {
        // ProviderCaseUploadDocument
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(@"Id", Order = 1, TypeName = "int")]
        [Index(@"PK_ProviderCaseUploadDocuments", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Id")]
        public int Id { get; set; } // Id (Primary key)

        [Column(@"Name", Order = 2, TypeName = "varchar")]
        [MaxLength(200)]
        [StringLength(200)]
        [Display(Name = "Name")]
        public string Name { get; set; } // Name (length: 200)

        [Column(@"DistrictId", Order = 3, TypeName = "int")]
        [Display(Name = "District ID")]
        public int DistrictId { get; set; } // DistrictId

        [Column(@"DateUpload", Order = 4, TypeName = "datetime")]
        [Display(Name = "Date upload")]
        public System.DateTime DateUpload { get; set; } // DateUpload

        [Column(@"UploadedBy", Order = 5, TypeName = "int")]
        [Display(Name = "Uploaded by")]
        public int? UploadedBy { get; set; } // UploadedBy

        [Column(@"FilePath", Order = 6, TypeName = "varchar")]
        [MaxLength(200)]
        [StringLength(200)]
        [Display(Name = "File path")]
        public string FilePath { get; set; } // FilePath (length: 200)

        [Column(@"DateProcessed", Order = 7, TypeName = "datetime")]
        [Display(Name = "Date processed")]
        public System.DateTime? DateProcessed { get; set; } // DateProcessed

        [Column(@"DateError", Order = 8, TypeName = "datetime")]
        [Display(Name = "Date error")]
        public System.DateTime? DateError { get; set; } // DateError

        // Reverse navigation

        /// <summary>
        /// Child ProviderCaseUploads where [ProviderCaseUploads].[ProviderCaseUploadDocumentId] point to this entity (FK_ProviderCaseUploads_ProviderCaseUploadDocuments)
        /// </summary>
        public System.Collections.Generic.ICollection<ProviderCaseUpload> ProviderCaseUploads { get; set; } // ProviderCaseUploads.FK_ProviderCaseUploads_ProviderCaseUploadDocuments

        // Foreign keys

        /// <summary>
        /// Parent SchoolDistrict pointed by [ProviderCaseUploadDocuments].([DistrictId]) (FK_ProviderCaseUploadDocuments_SchoolDistricts)
        /// </summary>
        [InverseProperty("ProviderCaseUploadDocuments")]
        [ForeignKey("DistrictId")] public SchoolDistrict SchoolDistrict { get; set; } // FK_ProviderCaseUploadDocuments_SchoolDistricts

        /// <summary>
        /// Parent User pointed by [ProviderCaseUploadDocuments].([UploadedBy]) (FK_ProviderCaseUploadDocuments_Users)
        /// </summary>
        [InverseProperty("ProviderCaseUploadDocuments")]
        [ForeignKey("UploadedBy")] public User User { get; set; } // FK_ProviderCaseUploadDocuments_Users

        public ProviderCaseUploadDocument()
        {
            DateUpload = System.DateTime.Now;
            ProviderCaseUploads = new System.Collections.Generic.List<ProviderCaseUpload>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
