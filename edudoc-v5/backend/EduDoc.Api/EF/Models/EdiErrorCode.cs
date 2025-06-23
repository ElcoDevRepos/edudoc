using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EdiErrorCode
{
    public int Id { get; set; }

    public string ErrorCode { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int EdiFileTypeId { get; set; }

    public bool Archived { get; set; }

    public int CreatedById { get; set; }

    public int? ModifiedById { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateModified { get; set; }

    public virtual ICollection<ClaimsEncounter> ClaimsEncounters { get; set; } = new List<ClaimsEncounter>();

    public virtual User CreatedBy { get; set; } = null!;

    public virtual EdiFileType EdiFileType { get; set; } = null!;

    public virtual User? ModifiedBy { get; set; }

    public virtual ICollection<UnmatchedClaimResponse> UnmatchedClaimResponses { get; set; } = new List<UnmatchedClaimResponse>();
}
