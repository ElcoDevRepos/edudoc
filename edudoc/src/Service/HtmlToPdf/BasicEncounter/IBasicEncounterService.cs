using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Custom;

namespace Service.HtmlToPdf
{
    public interface IBasicEncounterService
    {
        FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes, int userId);
        List<EncounterDistrictData<BasicEncounterLineData>> GetTableData(Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes, int userId);
    }
}
