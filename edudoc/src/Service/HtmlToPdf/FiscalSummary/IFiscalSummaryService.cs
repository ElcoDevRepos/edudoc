using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Custom;

namespace Service.HtmlToPdf
{
    public interface IFiscalSummaryService
    {
        FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp);
        FiscalSummaryData GetTableData(Model.Core.CRUDSearchParams csp);
    }
}
