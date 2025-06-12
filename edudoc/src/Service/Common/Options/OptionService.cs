using Model;
using System.Collections.Generic;
using System.Linq;

namespace Service.Common.Options
{
    /// <summary>
    ///     This service returns static lists to populate
    ///     dropdowns and other option pickers.
    ///     Should return things like States, Countries, etc.
    /// </summary>
    public interface IOptionService
    {
        IEnumerable<PhoneType> GetPhoneTypes();
        IEnumerable<State> GetStates();
        IEnumerable<Country> GetCountries();
        IEnumerable<ContactStatus> GetContactStatuses();
        IEnumerable<ServiceCode> GetServiceCodes();
        IEnumerable<ServiceType> GetServiceTypes();
        IEnumerable<MessageFilterType> GetMessageFilterTypes();
        IEnumerable<StudentType> GetStudentTypes();
        IEnumerable<Method> GetMethods();
        IEnumerable<StudentDeviationReason> GetStudentDeviationReasons();
        IEnumerable<EncounterStatus> GetEncounterStatuses();
        IEnumerable<EvaluationType> GetEvaluationTypes();
        IEnumerable<Goal> GetGoals();
        IEnumerable<EdiFileType> GetEdiResponseTypes();
        IEnumerable<SchoolDistrict> GetSchoolDistricts();
        IEnumerable<TrainingType> GetTrainingTypes();
    }

    public class OptionService : IOptionService
    {
        protected IPrimaryContext Context;

        public OptionService(IPrimaryContext context)
        {
            Context = context;
        }

        public IEnumerable<PhoneType> GetPhoneTypes()
        {
            return GetAll<PhoneType>();
        }

        public IEnumerable<State> GetStates()
        {
            return GetAll<State>();
        }

        public IEnumerable<Country> GetCountries()
        {
            return GetAll<Country>();
        }


        private IEnumerable<T> GetAll<T>() where T : class
        {
            return Context.Set<T>().AsEnumerable();
        }

        public IEnumerable<ContactStatus> GetContactStatuses()
        {
            return GetAll<ContactStatus>();
        }
        public IEnumerable<ServiceCode> GetServiceCodes()
        {
            return GetAll<ServiceCode>();
        }

        public IEnumerable<ServiceType> GetServiceTypes()
        {
            return GetAll<ServiceType>();
        }

        public IEnumerable<MessageFilterType> GetMessageFilterTypes()
        {
            return GetAll<MessageFilterType>();
        }

        public IEnumerable<StudentType> GetStudentTypes()
        {
            return GetAll<StudentType>();
        }

        public IEnumerable<Method> GetMethods()
        {
            return GetAll<Method>();
        }

        public IEnumerable<StudentDeviationReason> GetStudentDeviationReasons()
        {
            return GetAll<StudentDeviationReason>();
        }

        public IEnumerable<EncounterStatus> GetEncounterStatuses()
        {
            return GetAll<EncounterStatus>();
        }

        public IEnumerable<EvaluationType> GetEvaluationTypes()
        {
            return GetAll<EvaluationType>();
        }

        public IEnumerable<Goal> GetGoals()
        {
            return GetAll<Goal>();
        }

        public IEnumerable<EdiFileType> GetEdiResponseTypes()
        {
            return GetAll<EdiFileType>().Where(fileType => fileType.IsResponse);
        }
        
        public IEnumerable<SchoolDistrict> GetSchoolDistricts()
        {
            return GetAll<SchoolDistrict>().Where(district => !district.Archived);

        }

        public IEnumerable<TrainingType> GetTrainingTypes()
        {
            return GetAll<TrainingType>();

        }
    }
}
