using System.Collections.Generic;
using System.Threading.Tasks;
using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace EduDoc.Api.Endpoints.DeviationReasons.Repositories;

public interface IDeviationReasonRepository
{
    Task<List<StudentDeviationReason>> GetAllAsync();
}

public class DeviationReasonRepository : IDeviationReasonRepository
{
    private readonly EdudocSqlContext context;

    public DeviationReasonRepository(EdudocSqlContext context)
    {
        this.context = context;
    }

    public async Task<List<StudentDeviationReason>> GetAllAsync()
    {
        return await context.StudentDeviationReasons.ToListAsync();
    }
} 