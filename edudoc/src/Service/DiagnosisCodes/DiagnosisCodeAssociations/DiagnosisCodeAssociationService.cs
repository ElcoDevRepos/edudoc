using Model;

namespace Service.DiagnosisCodes
{
    public class DiagnosisCodeAssociationService : BaseService, IDiagnosisCodeAssociationService
    {
        public DiagnosisCodeAssociationService(IPrimaryContext context)
            : base(context)
        {
        }

    }
}
