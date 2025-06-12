using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Net;
using breckhtmltopdf;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Model;
using Model.Custom;
using Model.DTOs;
using Model.Enums;
using Service.Users;
using Service.Utilities;

namespace Service.HtmlToPdf
{
    public class AupAuditService : BaseService, IAupAuditService
    {
        private ITemplatePdfService _templatePdfService;
        private IConfiguration _configuration;
        private IUserService _userService;
        private IPrimaryContext _context;

        public AupAuditService(
            IPrimaryContext context,
            ITemplatePdfService templatePdfService,
            IConfiguration configuration,
            IUserService userService
        )
            : base(context)
        {
            _templatePdfService = templatePdfService;
            _configuration = configuration;
            _userService = userService;
            _context = context;
        }

        public FileStreamResult GeneratePdf(List<EncounterResponseDto> data)
        {

            var schoolDistrictName = data.FirstOrDefault()?.SchoolDistrict;
            var allDistrictsSame = data.All(d => d.SchoolDistrict == schoolDistrictName);

            if(!allDistrictsSame) {
                throw new ValidationException("All encounters must have the same district");
            }

            var aupAuditParams = new Templator.Models.AupAuditParams(_configuration);
            aupAuditParams.Encounters = data;
            aupAuditParams.HeaderText = schoolDistrictName;

            var timezone = CommonFunctions.GetTimeZone();
            foreach(var encounter in data) {
                var offset = timezone.GetUtcOffset(encounter.EncounterDate);
                // we have to apply the timezone offset to a timeonly as timespan won't properly handle rollover between days e.g. 10 pm to 1 am
                var startTime = TimeOnly.FromTimeSpan(encounter.StartTime).Add(offset);
                var endTime = TimeOnly.FromTimeSpan(encounter.EndTime).Add(offset);
                encounter.StartTime = startTime.ToTimeSpan();
                encounter.EndTime = endTime.ToTimeSpan();
            }

            var pdf = _templatePdfService.CreatePdfFromTemplate("AupAudit.cshtml", aupAuditParams);
            return new FileStreamResult(
                new System.IO.MemoryStream(pdf),
                new MediaTypeHeaderValue("application/octet-stream")
            )
            {
                FileDownloadName = "AupAudit",
            };
        }
    }
}
