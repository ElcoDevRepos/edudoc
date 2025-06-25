using System;

namespace EduDoc.Api.Endpoints.Students.Models;

public class StudentResponseModel
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public required string LastName { get; set; }
    public string? StudentCode { get; set; }
    public string? MedicaidNo { get; set; }
    public required string Grade { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int SchoolId { get; set; }
    public int? DistrictId { get; set; }
    public string? SchoolName { get; set; }
    public string? DistrictName { get; set; }
} 