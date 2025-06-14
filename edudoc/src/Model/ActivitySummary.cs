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

    // ActivitySummaries
    [Table("ActivitySummaries", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ActivitySummary: IEntity
    {
        // ActivitySummary
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(@"Id", Order = 1, TypeName = "int")]
        [Index(@"PK_ActivitySummaries", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Id")]
        public int Id { get; set; } // Id (Primary key)

        [Column(@"ReferralsPending", Order = 2, TypeName = "int")]
        [Display(Name = "Referrals pending")]
        public int ReferralsPending { get; set; } // ReferralsPending

        [Column(@"EncountersReturned", Order = 3, TypeName = "int")]
        [Display(Name = "Encounters returned")]
        public int EncountersReturned { get; set; } // EncountersReturned

        [Column(@"PendingSupervisorCoSign", Order = 4, TypeName = "int")]
        [Display(Name = "Pending supervisor co sign")]
        public int PendingSupervisorCoSign { get; set; } // PendingSupervisorCoSign

        [Column(@"PendingEvaluations", Order = 5, TypeName = "int")]
        [Display(Name = "Pending evaluations")]
        public int PendingEvaluations { get; set; } // PendingEvaluations

        [Column(@"DateCreated", Order = 6, TypeName = "datetime")]
        [Display(Name = "Date created")]
        public System.DateTime DateCreated { get; set; } // DateCreated

        [Column(@"CreatedById", Order = 7, TypeName = "int")]
        [Display(Name = "Created by ID")]
        public int CreatedById { get; set; } // CreatedById

        // Reverse navigation

        /// <summary>
        /// Child ActivitySummaryDistricts where [ActivitySummaryDistricts].[ActivitySummaryId] point to this entity (FK_ActivitySummaryDistricts_ActivitySummaries)
        /// </summary>
        public System.Collections.Generic.ICollection<ActivitySummaryDistrict> ActivitySummaryDistricts { get; set; } // ActivitySummaryDistricts.FK_ActivitySummaryDistricts_ActivitySummaries

        // Foreign keys

        /// <summary>
        /// Parent User pointed by [ActivitySummaries].([CreatedById]) (FK_ActivitySummaries_Users)
        /// </summary>
        [InverseProperty("ActivitySummaries")]
        [ForeignKey("CreatedById")] public User User { get; set; } // FK_ActivitySummaries_Users

        public ActivitySummary()
        {
            ReferralsPending = 0;
            EncountersReturned = 0;
            PendingSupervisorCoSign = 0;
            PendingEvaluations = 0;
            DateCreated = System.DateTime.Now;
            CreatedById = 1;
            ActivitySummaryDistricts = new System.Collections.Generic.List<ActivitySummaryDistrict>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
