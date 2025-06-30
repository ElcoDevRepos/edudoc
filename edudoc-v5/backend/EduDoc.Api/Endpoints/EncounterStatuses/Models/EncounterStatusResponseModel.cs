namespace EduDoc.Api.Endpoints.EncounterStatuses.Models;

public class EncounterStatusResponseModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public bool IsAuditable { get; set; }
    public bool IsBillable { get; set; }
    public bool ForReview { get; set; }
    public bool HpcadminOnly { get; set; }
} 