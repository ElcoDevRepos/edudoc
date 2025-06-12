using System;
using Model;
using Service.ActivitySummaries;
using Service.Base;

namespace ActivitySummaryJob
{
    public class Application
    {
        private readonly IActivitySummaryService _activitySummaryService;
        private readonly IPrimaryContext _context;


        // inject your services here as you would any other class
        public Application(IActivitySummaryService activitySummaryService, IPrimaryContext context)
        {
            _activitySummaryService = activitySummaryService;
            _context = context;
        }

        public void Run()
        {
            // add your job's logic here
            _activitySummaryService.UpdateActivitySummaryTables();
            Console.WriteLine("The job ran!");
        }
    }
}