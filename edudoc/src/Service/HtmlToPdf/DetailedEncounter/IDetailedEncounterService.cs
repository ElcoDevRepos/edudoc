using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Custom;

namespace Service.HtmlToPdf
{
    public interface IDetailedEncounterService
    {
        FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes, int userId);
        List<EncounterDistrictData<DetailedEncounterLineData>> GetTableData(Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes, int userId);
    }
}
