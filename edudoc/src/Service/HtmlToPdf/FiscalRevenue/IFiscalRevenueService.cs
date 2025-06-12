using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Custom;

namespace Service.HtmlToPdf
{
    public interface IFiscalRevenueService
    {
        FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp);
        FiscalRevenueData GetTableData(Model.Core.CRUDSearchParams csp);
    }
}
