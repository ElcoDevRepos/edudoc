using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace EduDoc.Api.Endpoints.EvaluationTypes.Repositories;

public interface IEvaluationTypeRepository
{
    Task<List<EvaluationType>> GetAllAsync();
}

public class EvaluationTypeRepository : IEvaluationTypeRepository
{
    private readonly EdudocSqlContext context;

    public EvaluationTypeRepository(EdudocSqlContext context)
    {
        this.context = context;
    }

    public async Task<List<EvaluationType>> GetAllAsync()
    {
        return await this.context.EvaluationTypes.ToListAsync();
    }
} 