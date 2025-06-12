using Model;

namespace Service.ProviderTrainings
{
    public interface IProviderTrainingService
    { 
        void RemindProvider(int providerTrainingId);
        void RemindAllProviders();
        void CreateNewPersonTrainings(AuthUser user);
        void CreateAnnualTrainings();
    }
}
