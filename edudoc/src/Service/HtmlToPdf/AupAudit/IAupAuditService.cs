using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Custom;
using Model.DTOs;

namespace Service.HtmlToPdf
{
    public interface IAupAuditService
    {
        FileStreamResult GeneratePdf(List<EncounterResponseDto> data);
    }
}
