namespace EduDoc.Api.Endpoints.Students.Models;

public class StudentSearchRequestModel
{
    public required string SearchText { get; set; }
    public int? DistrictId { get; set; }
} 