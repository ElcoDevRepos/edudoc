using Model;
using Service.ProgressReports;
using System;

namespace ProgressReportJob
{
    public interface IApplication
    {
        void Run();
    }

    public class Application : IApplication
    {
        private readonly IProgressReportsService _progressReportsService;
        private readonly IPrimaryContext _context;



        public Application(
            IProgressReportsService progressReportsService,
            IPrimaryContext context)
        {
            _progressReportsService = progressReportsService;
            _context = context;

        }

        public void Run()
        {
            var today = DateTime.UtcNow;
            Console.WriteLine($"-----Generating Progress Reports For {today.Month}/{today.Year} -----");

            var quarter = today.Month == 8 ? 1 : (today.Month == 11 ? 2 : (today.Month == 2 ? 3 : 0));
            if(quarter == 0)
                throw new ArgumentOutOfRangeException("TriggerDate", "The current date does not align with any of the preset progress report trigger dates.");

            var progressReports = _progressReportsService.GenerateProgressReports(quarter, today.Year);

            Console.WriteLine($"-----Progress Reports Generated For {progressReports.Count} Case Loads-----");
        }


    }
}
