using System.Collections.Generic;
using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace EduDoc.Api.Endpoints.EncounterStatuses.Repositories;

public interface IEncounterStatusRepository
{
    Task<List<EncounterStatus>> GetAllAsync();
}

public class EncounterStatusRepository : IEncounterStatusRepository
{
    private readonly EdudocSqlContext context;

    public EncounterStatusRepository(EdudocSqlContext context)
    {
        this.context = context;
    }

    public async Task<List<EncounterStatus>> GetAllAsync()
    {
        return await context.EncounterStatuses.ToListAsync();
    }
} 