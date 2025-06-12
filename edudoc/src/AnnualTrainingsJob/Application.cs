using Model;
using Service.ProviderTrainings;
using Service.Students;

namespace AnnualTrainingsJob
{
    public interface IApplication
    {
        void Run();
    }

    class Application : IApplication
    {
        private readonly IProviderTrainingService _trainingService;
        private readonly IStudentService _studentService;

        public Application(
            IProviderTrainingService trainingService,
            IStudentService studentService
            )
        {
            _trainingService = trainingService;
            _studentService = studentService;
        }
        public void Run()
        {
            _trainingService.CreateAnnualTrainings();
            _studentService.PruneStudents21AndOver();
        }
    }
}
