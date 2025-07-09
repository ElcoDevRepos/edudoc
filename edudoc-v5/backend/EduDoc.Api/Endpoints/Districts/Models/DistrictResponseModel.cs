namespace EduDoc.Api.Endpoints.Districts.Models;

public class DistrictResponseModel
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
    public required string Einnumber { get; set; }
    public required string Irnnumber { get; set; }
    public required string Npinumber { get; set; }
    public required string ProviderNumber { get; set; }
    public bool ActiveStatus { get; set; }
    public bool Archived { get; set; }
} 