using Model;
using System.Collections.Generic;
using System.Linq;

namespace Service.DiagnosisCodes
{
    public class DiagnosisCodeService : BaseService, IDiagnosisCodeService
    {
        public DiagnosisCodeService(IPrimaryContext context)
            : base(context)
        {
        }

        public IEnumerable<DiagnosisCode> GetReasonForServiceOptions(int providerId)
        {
            return Context.DiagnosisCodes.Where(dc => dc.DiagnosisCodeAssociations.Any
                                                        (dca => dca.ServiceCode.ProviderTitles.Any
                                                        (pt => pt.Providers.Any
                                                        (p => p.Id == providerId)))
                                                    && !dc.Archived);

        }

    }
}
