using Model;
using Model.Enums;
using Service.Encounters;
using System.Collections.Generic;
using System.Linq;

namespace Service.ProviderInactivityDates
{
    public interface IProviderInactivityDateService
    {
        public void UpdateEncounterStudentStatus(int providerId, int userId);
    }
    public class ProviderInactivityDateService : BaseService, IProviderInactivityDateService
    {
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;
        public ProviderInactivityDateService(IPrimaryContext context, IEncounterStudentStatusService encounterStudentStatusService)
            : base(context)
        {
            _encounterStudentStatusService = encounterStudentStatusService;
        }

        public void UpdateEncounterStudentStatus(int providerId, int userId)
        {
            var encounterStudents = Context.EncounterStudents
                .Where(es => !es.Archived && es.Encounter.ProviderId == providerId &&
                    (es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_BILLING ||
                        es.EncounterStatusId == (int)EncounterStatuses.Do_Not_Bill)
                ).ToList();
            foreach (var encStudent in encounterStudents)
            {
                _encounterStudentStatusService.CheckEncounterStudentStatus(encStudent.Id, userId);
            }
            Context.SaveChanges();
        }
    }
}
