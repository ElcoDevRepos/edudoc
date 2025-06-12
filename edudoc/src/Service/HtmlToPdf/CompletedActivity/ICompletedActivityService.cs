using Microsoft.AspNetCore.Mvc;
using Model;

namespace Service.HtmlToPdf
{
    public interface ICompletedActivityService
    {
        FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp);
    }
}
