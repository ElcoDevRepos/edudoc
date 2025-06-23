using System;
using System.Collections.Generic;

namespace EduDoc.Api.EF.Models;

public partial class EdiMetaData
{
    public int Id { get; set; }

    public int SenderId { get; set; }

    public string ReceiverId { get; set; } = null!;

    public string ClaimImplementationReference { get; set; } = null!;

    public string RosterValidationImplementationReference { get; set; } = null!;

    public string SubmitterOrganizationName { get; set; } = null!;

    public string SubmitterQlfrId { get; set; } = null!;

    public string SubmitterName { get; set; } = null!;

    public string SubmitterPhone { get; set; } = null!;

    public string SubmitterPhoneAlt { get; set; } = null!;

    public string SubmitterEmail { get; set; } = null!;

    public string ReceiverOrganizationName { get; set; } = null!;

    public string ProviderCode { get; set; } = null!;

    public string ReferenceQlfrId { get; set; } = null!;

    public string ProviderOrganizationName { get; set; } = null!;

    public string ServiceLocationCode { get; set; } = null!;

    public string ClaimNoteDescription { get; set; } = null!;

    public string FacilityCode { get; set; } = null!;
}
