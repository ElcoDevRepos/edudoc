using Model;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;

namespace Service.CaseLoads.CaseLoadOptions
{
    public class CaseLoadCptCodeService : BaseService, ICaseLoadCptCodeService

    {
        public CaseLoadCptCodeService(IPrimaryContext context)
            : base(context)
        {
        }

        public IEnumerable<CptCode> GetCPTCodes(int providerUserId)
        {
            return Context.CptCodes.Include(x => x.CptCodeAssocations).Where(x => !x.Archived && x.CptCodeAssocations.Any
                                    (y => !y.Archived && !y.IsGroup && y.ProviderTitle.Providers.Any(z => z.ProviderUser.Id == providerUserId)));
        }

    }
}
