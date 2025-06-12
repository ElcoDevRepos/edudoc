
using Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.RosterValidations
{
    public interface IRosterValidationService
    {
        Task<bool> GenerateRosterValidation(int userId);
        (IEnumerable<RosterValidationStudent> student, int count, DateTime? latestUploadDate) Get271UploadedStudents(Model.Core.CRUDSearchParams csp);
    }
}
