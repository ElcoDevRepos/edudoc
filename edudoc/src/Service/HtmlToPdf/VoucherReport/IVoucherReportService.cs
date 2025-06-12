using Microsoft.AspNetCore.Mvc;
using Model;

namespace Service.HtmlToPdf
{
    public interface IVoucherReportService
    {
        FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp);
    }
}
