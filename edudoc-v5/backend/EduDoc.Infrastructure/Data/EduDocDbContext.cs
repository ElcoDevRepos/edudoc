using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EduDoc.Infrastructure.Data;

public class EduDocDbContext : DbContext
{
    private readonly IConfiguration _configuration;

    public EduDocDbContext(DbContextOptions<EduDocDbContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
        }
    }
} 