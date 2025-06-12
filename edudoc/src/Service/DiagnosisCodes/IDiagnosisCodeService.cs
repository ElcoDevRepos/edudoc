
using Model;
using System.Collections.Generic;

namespace Service.DiagnosisCodes
{
    public interface IDiagnosisCodeService
    {
        IEnumerable<DiagnosisCode> GetReasonForServiceOptions(int providerId);
    }
}
