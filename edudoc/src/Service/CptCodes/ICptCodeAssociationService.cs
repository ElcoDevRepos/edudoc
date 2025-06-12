using Model;
using System.Collections.Generic;

namespace Service.CptCodes
{
    public interface ICptCodeAssociationService
    {
        bool UpdateAssociations(IEnumerable<CptCodeAssocation> cptCodeAssociations, int userId);
    }
}
