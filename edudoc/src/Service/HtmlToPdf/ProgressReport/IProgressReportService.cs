using Microsoft.AspNetCore.Mvc;

namespace Service.HtmlToPdf
{
    public interface IProgressReportService
    {
        FileStreamResult GeneratePdf(int progressReportId);
    }
}
