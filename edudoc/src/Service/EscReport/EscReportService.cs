using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using MimeKit;
using Model;
using Model.DTOs;
using Service.Utilities.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Service.Utilities.Excel;
using Service.Utilities.Excel.Model;
using Service.Utilities;
using Service.Base;
using Microsoft.Extensions.Logging;

namespace Service.EscReport
{
    public class EscReportService : CRUDBaseService, IEscReportService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfiguration _config;
        private readonly IExcelBuilder _excelBuilder;
        private readonly IDocumentHelper _documentHelper;
        private readonly ILogger<EscReportService> _logger;
        public EscReportService(
            IPrimaryContext context,
            IEmailHelper emailHelper,
            IConfiguration config,
            IExcelBuilder excelBuilder,
            IDocumentHelper documentHelper,
            ILogger<EscReportService> logger
        ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _emailHelper = emailHelper;
            _config = config;
            _excelBuilder = excelBuilder;
            _documentHelper = documentHelper;
            _logger = logger;
        }

        public void GenerateEscReports()
        {
            var escs = _context.Escs.Where(e => !e.Archived).ToList();
            var today = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1).ToUniversalTime();
            var oneMonthAgo = today.AddMonths(-1);
            var twoMonthsAgo = today.AddMonths(-2);

            foreach (var esc in escs)
            {
                try
                {
                    var fileName = $"ESC_Report_{string.Join("_", esc.Name.Split(" "))}_{oneMonthAgo.ToString("yyyyMMdd")}";
                    var data = GetEscReportData(esc.Id, today, oneMonthAgo);
                    var prevMonthData = GetEscReportData(esc.Id, oneMonthAgo, twoMonthsAgo);

                    var documentData = new ExcelDocumentConfiguration<EscReportDataDto>(esc.Name, data, prevMonthData);

                    // Column Definitions
                    documentData.ColumnsConfig = new List<ColumnDefinition>
                    {
                        new ColumnDefinition() { Width = 40, Header = "School District", PropertyName = "SchoolDistrict" },
                        new ColumnDefinition() { Width = 30, Header = "Provider First", PropertyName = "ProviderFirstName" },
                        new ColumnDefinition() { Width = 30, Header = "Provider Last", PropertyName = "ProviderLastName" },
                        new ColumnDefinition() { Width = 40, Header = "Title", PropertyName = "ProviderTitle" },
                        new ColumnDefinition() { Width = 25, Header = "Service Area", PropertyName = "ServiceArea" },
                        new ColumnDefinition() { Width = 25, Header = "Encounter Type", PropertyName = "EncounterType" },
                        new ColumnDefinition() { Width = 20, Header = "Encounter Date", PropertyName = "EncounterDate", CellValue = CellDataType.Date },
                        new ColumnDefinition() { Width = 15, Header = "Start Time", PropertyName = "EncounterStartTime", CellValue = CellDataType.TimeSpan },
                        new ColumnDefinition() { Width = 15, Header = "End Time", PropertyName = "EncounterEndTime", CellValue = CellDataType.TimeSpan },
                        new ColumnDefinition() { Width = 10, Header = "Total Minutes", PropertyName = "TotalMinutes", CellValue = CellDataType.Minutes },
                        new ColumnDefinition() { Width = 30, Header = "Student First", PropertyName = "StudentFirstName" },
                        new ColumnDefinition() { Width = 30, Header = "Student Last", PropertyName = "StudentLastName" },
                        new ColumnDefinition() { Width = 20, Header = "Student DOB", PropertyName = "StudentDateOfBirth", CellValue = CellDataType.Date },
                        new ColumnDefinition() { Width = 15, Header = "Student Id", PropertyName = "StudentId", CellValue = CellDataType.Numeric },
                    };
                    var documentBytes = _excelBuilder.CreateExcelDocument(documentData);

                    SendEmail(documentBytes, fileName, esc.Name);
                }
                catch (Exception ex)
                {
                    this._logger.LogError(ex, "Exception in GenerateEscReports");
                    SendErrorEmail(esc.Id, esc.Name, ex);
                }
            }
        }

        private List<EscReportDataDto> GetEscReportData(int escId, DateTime startDate, DateTime endDate) 
        {
            var result = new List<EscReportDataDto>();

            var groupData = _context.ProviderEscAssignments.Where(pea => !pea.Archived
                && (pea.EndDate == null || DbFunctions.TruncateTime(pea.EndDate) >= startDate)
                && pea.EscId == escId)
                .Select(pea => new
                {
                    providerId = pea.ProviderId,
                    providerFirstName = pea.Provider.ProviderUser.FirstName,
                    providerLastName = pea.Provider.ProviderUser.LastName,
                    providerTitle = pea.Provider.ProviderTitle.Name,
                    providerServiceArea = pea.Provider.ProviderTitle.ServiceCode.Name,
                    districtIds = pea.ProviderEscSchoolDistricts.Select(d => d.SchoolDistrictId)
                }).ToList();

            foreach(var data in groupData)
            {
                var encounters = _context.Providers.Where(p => p.Id == data.providerId)
                    .SelectMany(p => p.Encounters.SelectMany(e =>
                        e.EncounterStudents.Where(es => !es.Archived && data.districtIds.Contains((int)es.Student.DistrictId)
                        && DbFunctions.TruncateTime(es.EncounterDate) < DbFunctions.TruncateTime(startDate)
                        && DbFunctions.TruncateTime(es.EncounterDate) >= DbFunctions.TruncateTime(endDate))
                    ))
                    .Select(es => new EscReportDataDto
                    {
                        SchoolDistrict = es.Student.SchoolDistrict.Name,
                        ProviderFirstName = data.providerFirstName,
                        ProviderLastName = data.providerLastName,
                        ProviderTitle = data.providerTitle,
                        ServiceArea = data.providerServiceArea,
                        EncounterType = es.Encounter.ServiceType.Name,
                        EncounterDate = es.EncounterDate,
                        EncounterStartTime = es.EncounterStartTime,
                        EncounterEndTime = es.EncounterEndTime,
                        TotalMinutes = 0,
                        StudentFirstName = es.Student.FirstName,
                        StudentLastName = es.Student.LastName,
                        StudentDateOfBirth = es.Student.DateOfBirth,
                        StudentId = es.StudentId
                    });
                result.AddRange(encounters);
            }
            return result;
        }

        private void SendEmail(byte[] document, string fileName, string escName)
        {
            List<MimeEntity> attachmentsToSend = new List<MimeEntity> {
                new MimePart()
                {
                    Content = new MimeContent(new MemoryStream(document), ContentEncoding.Default),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = $"{fileName}.xlsx"
                },
            };

            _emailHelper.SendEmail(new EmailParams
            {
                From = _config.GetValue<string>("DefaultEmailFrom"),
                To = _config.GetValue<string>("EscReportEmailTo"),
                Subject = $"Test ESC Report for {escName}",
                Attachments = attachmentsToSend
            });
        }

        private void SendErrorEmail(int escId, string escName, Exception error)
        {
            _emailHelper.SendEmail(new EmailParams()
                {
                    From = _config.GetValue<string>("DefaultEmailFrom"),
                    To = _config.GetValue<string>("SystemErrorEmails"),
                    Subject = "ESC Report Error",
                    Body = "ESC Id: " + escId + Environment.NewLine +
                           "ESC Name: " + escName + Environment.NewLine +
                           "Message: " + error.Message + Environment.NewLine +
                           "Inner Exception: " + error.InnerException + Environment.NewLine +
                           "Stack Trace: " + error.StackTrace.ToString(),
                    IsHtml = false
                });
        }

    }
}
