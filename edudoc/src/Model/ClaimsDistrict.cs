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

    // ClaimsDistricts
    [Table("ClaimsDistricts", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ClaimsDistrict: IEntity
    {
        // ClaimsDistrict
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(@"Id", Order = 1, TypeName = "int")]
        [Index(@"PK_ClaimsDistricts", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Id")]
        public int Id { get; set; } // Id (Primary key)

        [Column(@"IdentificationCode", Order = 2, TypeName = "varchar")]
        [MaxLength(80)]
        [StringLength(80)]
        [Display(Name = "Identification code")]
        public string IdentificationCode { get; set; } // IdentificationCode (length: 80)

        [Column(@"DistrictOrganizationName", Order = 3, TypeName = "varchar")]
        [MaxLength(60)]
        [StringLength(60)]
        [Display(Name = "District organization name")]
        public string DistrictOrganizationName { get; set; } // DistrictOrganizationName (length: 60)

        [Column(@"Address", Order = 4, TypeName = "varchar")]
        [MaxLength(55)]
        [StringLength(55)]
        [Display(Name = "Address")]
        public string Address { get; set; } // Address (length: 55)

        [Column(@"City", Order = 5, TypeName = "varchar")]
        [MaxLength(30)]
        [StringLength(30)]
        [Display(Name = "City")]
        public string City { get; set; } // City (length: 30)

        [Column(@"State", Order = 6, TypeName = "varchar")]
        [MaxLength(2)]
        [StringLength(2)]
        [Display(Name = "State")]
        public string State { get; set; } // State (length: 2)

        [Column(@"PostalCode", Order = 7, TypeName = "varchar")]
        [MaxLength(15)]
        [StringLength(15)]
        [Display(Name = "Postal code")]
        public string PostalCode { get; set; } // PostalCode (length: 15)

        [Column(@"EmployerId", Order = 8, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Employer ID")]
        public string EmployerId { get; set; } // EmployerId (length: 50)

        [Column(@"Index", Order = 9, TypeName = "int")]
        [Display(Name = "Index")]
        public int? Index { get; set; } // Index

        [Column(@"HealthCareClaimsId", Order = 10, TypeName = "int")]
        [Display(Name = "Health care claims ID")]
        public int HealthCareClaimsId { get; set; } // HealthCareClaimsId

        [Column(@"SchoolDistrictId", Order = 11, TypeName = "int")]
        [Display(Name = "School district ID")]
        public int SchoolDistrictId { get; set; } // SchoolDistrictId

        // Reverse navigation

        /// <summary>
        /// Child ClaimsStudents where [ClaimsStudents].[ClaimsDistrictId] point to this entity (FK_ClaimsStudents_ClaimsDistrict)
        /// </summary>
        public System.Collections.Generic.ICollection<ClaimsStudent> ClaimsStudents { get; set; } // ClaimsStudents.FK_ClaimsStudents_ClaimsDistrict

        // Foreign keys

        /// <summary>
        /// Parent HealthCareClaim pointed by [ClaimsDistricts].([HealthCareClaimsId]) (FK_ClaimsDistricts_HealthCareClaims)
        /// </summary>
        [InverseProperty("ClaimsDistricts")]
        [ForeignKey("HealthCareClaimsId")] public HealthCareClaim HealthCareClaim { get; set; } // FK_ClaimsDistricts_HealthCareClaims

        /// <summary>
        /// Parent SchoolDistrict pointed by [ClaimsDistricts].([SchoolDistrictId]) (FK_ClaimsDistricts_SchoolDistrict)
        /// </summary>
        [InverseProperty("ClaimsDistricts")]
        [ForeignKey("SchoolDistrictId")] public SchoolDistrict SchoolDistrict { get; set; } // FK_ClaimsDistricts_SchoolDistrict

        public ClaimsDistrict()
        {
            ClaimsStudents = new System.Collections.Generic.List<ClaimsStudent>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
