using System;
using Service.Base;
using Service.EscReport;

namespace EscReportJob
{
    public class Application
    {
        private readonly IEscReportService _escReportService;

        // inject your services here as you would any other class
        public Application(IEscReportService escReportService)
        {
            _escReportService = escReportService;
        }

        public void Run()
        {
            _escReportService.GenerateEscReports();
        }
    }
}
