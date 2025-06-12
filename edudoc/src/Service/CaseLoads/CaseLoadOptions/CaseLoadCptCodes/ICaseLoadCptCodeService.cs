
using Model;
using System.Collections.Generic;

namespace Service.CaseLoads.CaseLoadOptions
{
    public interface ICaseLoadCptCodeService
    {
        IEnumerable<CptCode> GetCPTCodes(int providerUserId);
    }
}
