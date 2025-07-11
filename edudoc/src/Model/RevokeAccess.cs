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

    // RevokeAccess
    [Table("RevokeAccess", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class RevokeAccess: IEntity
    {
        // RevokeAccess

        ///<summary>
        /// Module
        ///</summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(@"Id", Order = 1, TypeName = "int")]
        [Index(@"PK_RevokeAccess", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Id")]
        public int Id { get; set; } // Id (Primary key)

        [Column(@"ProviderId", Order = 2, TypeName = "int")]
        [Display(Name = "Provider ID")]
        public int ProviderId { get; set; } // ProviderId

        [Column(@"Date", Order = 3, TypeName = "datetime")]
        [Display(Name = "Date")]
        public System.DateTime Date { get; set; } // Date

        [Column(@"RevocationReasonId", Order = 4, TypeName = "int")]
        [Display(Name = "Revocation reason ID")]
        public int? RevocationReasonId { get; set; } // RevocationReasonId

        [Column(@"OtherReason", Order = 5, TypeName = "varchar")]
        [MaxLength(250)]
        [StringLength(250)]
        [Display(Name = "Other reason")]
        public string OtherReason { get; set; } // OtherReason (length: 250)

        [Column(@"AccessGranted", Order = 6, TypeName = "bit")]
        [Display(Name = "Access granted")]
        public bool? AccessGranted { get; set; } // AccessGranted

        // Foreign keys

        /// <summary>
        /// Parent Provider pointed by [RevokeAccess].([ProviderId]) (FK_RevokeAccess_Providers)
        /// </summary>
        [InverseProperty("RevokeAccesses")]
        [ForeignKey("ProviderId")] public Provider Provider { get; set; } // FK_RevokeAccess_Providers

        /// <summary>
        /// Parent ProviderDoNotBillReason pointed by [RevokeAccess].([RevocationReasonId]) (FK_RevokeAccess_ProviderDoNotBillReasons)
        /// </summary>
        [InverseProperty("RevokeAccesses")]
        [ForeignKey("RevocationReasonId")] public ProviderDoNotBillReason ProviderDoNotBillReason { get; set; } // FK_RevokeAccess_ProviderDoNotBillReasons

        public RevokeAccess()
        {
            Date = System.DateTime.UtcNow;
            AccessGranted = false;
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
