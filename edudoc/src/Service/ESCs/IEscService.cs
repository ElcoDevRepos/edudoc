using Model;
using Model.DTOs;
using System.Collections.Generic;

namespace Service.SchoolDistricts
{
    public interface IEscService
    {
        Esc Reload(int escId);

        IEnumerable<SelectOptions> GetAllSelectOptions();

        IEnumerable<SelectOptions> GetProviderSelectOptions(int providerId);

        EscSchoolDistrict ArchiveEscSchoolDistrict(int escId, int districtId);
        
    }
}
