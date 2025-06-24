namespace EduDoc.Api.Infrastructure.Configuration;

public class CorsSettings
{
    public string[]? AllowedOrigins { get; set; }
    public string[]? ExposedHeaders { get; set; }
} 