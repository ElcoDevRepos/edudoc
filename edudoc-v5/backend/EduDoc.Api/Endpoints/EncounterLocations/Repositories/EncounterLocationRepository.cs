using System.Collections.Generic;
using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace EduDoc.Api.Endpoints.EncounterLocations.Repositories;

public interface IEncounterLocationRepository
{
    Task<List<EncounterLocation>> GetAllAsync();
}

public class EncounterLocationRepository : IEncounterLocationRepository
{
    private readonly EdudocSqlContext context;

    public EncounterLocationRepository(EdudocSqlContext context)
    {
        this.context = context;
    }

    public async Task<List<EncounterLocation>> GetAllAsync()
    {
        return await this.context.EncounterLocations.ToListAsync();
    }
} 