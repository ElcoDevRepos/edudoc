using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;

namespace EduDoc.Api.Endpoints.Encounters.Repositories;

public interface IEncounterRepository
{
    Task<Encounter?> GetByIdAsync(int id);
}
public class EncounterRepository : IEncounterRepository
{
    private readonly EdudocSqlContext context;

    public EncounterRepository(EdudocSqlContext context)
    {
        this.context = context;
    }

    public async Task<Encounter?> GetByIdAsync(int id)
    {
        return await this.context.Encounters.FindAsync(id);
    }
} 