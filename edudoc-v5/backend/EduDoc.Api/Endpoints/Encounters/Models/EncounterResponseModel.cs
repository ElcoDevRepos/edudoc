using System;

namespace EduDoc.Api.Endpoints.Encounters.Models;

public class EncounterResponseModel
{
    public int Id { get; set; }
    public int ProviderId { get; set; }
    public Constants.ServiceTypeId ServiceTypeId { get; set; }
    public DateTime? EncounterDate { get; set; }
    public TimeOnly? EncounterStartTime { get; set; }
    public TimeOnly? EncounterEndTime { get; set; }
    public bool IsGroup { get; set; }
    public int AdditionalStudents { get; set; }
    public bool FromSchedule { get; set; }
    public bool Archived { get; set; }
} 