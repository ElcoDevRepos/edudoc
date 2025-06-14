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

    // RosterValidations
    [Table("RosterValidations", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class RosterValidation: IEntity
    {
        // RosterValidation
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(@"Id", Order = 1, TypeName = "int")]
        [Index(@"PK_RosterValidations", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Id")]
        public int Id { get; set; } // Id (Primary key)

        [Column(@"DateCreated", Order = 2, TypeName = "datetime")]
        [Display(Name = "Date created")]
        public System.DateTime DateCreated { get; set; } // DateCreated

        [Column(@"PageCount", Order = 3, TypeName = "int")]
        [Display(Name = "Page count")]
        public int PageCount { get; set; } // PageCount

        // Reverse navigation

        /// <summary>
        /// Child RosterValidationDistricts where [RosterValidationDistricts].[RosterValidationId] point to this entity (FK_RosterValidationDistricts_RosterValidations)
        /// </summary>
        public System.Collections.Generic.ICollection<RosterValidationDistrict> RosterValidationDistricts { get; set; } // RosterValidationDistricts.FK_RosterValidationDistricts_RosterValidations
        /// <summary>
        /// Child RosterValidationFiles where [RosterValidationFiles].[RosterValidationId] point to this entity (FK_RosterValidationFiles_RosterValidation)
        /// </summary>
        public System.Collections.Generic.ICollection<RosterValidationFile> RosterValidationFiles { get; set; } // RosterValidationFiles.FK_RosterValidationFiles_RosterValidation

        public RosterValidation()
        {
            DateCreated = System.DateTime.Now;
            PageCount = 1;
            RosterValidationDistricts = new System.Collections.Generic.List<RosterValidationDistrict>();
            RosterValidationFiles = new System.Collections.Generic.List<RosterValidationFile>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
