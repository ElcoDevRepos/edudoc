using Model;
using System.Linq;

namespace Service.Providers
{
    public class ProviderSchoolDistrictService : BaseService, IProviderSchoolDistrictService
    {

        public ProviderSchoolDistrictService(
            IPrimaryContext context
            )
            : base(context)
        {
        }

        public int DeleteEscAssignment(int escAssignmentId)
        {
            var escAssignment = Context.ProviderEscAssignments.FirstOrDefault(esc => esc.Id == escAssignmentId);
            var assignments = Context.ProviderEscSchoolDistricts.Where(assignments => assignments.ProviderEscAssignmentId == escAssignmentId);
            Context.ProviderEscSchoolDistricts.RemoveRange(assignments);
            Context.ProviderEscAssignments.Remove(escAssignment);
            return Context.SaveChanges();
        }

    }
}
