using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Common.Options;
using System.Collections.Generic;

namespace API.Options
{
    [Route("api/v1/options")]
    public class OptionsController : ApiControllerBase
    {
        private readonly IOptionService _optService;

        public OptionsController(IOptionService service)
        {
            _optService = service;
        }

        [HttpGet]
        [Route("states")]
        public IEnumerable<State> GetStates()
        {
            return _optService.GetStates();
        }

        [HttpGet]
        [Route("countries")]
        public IEnumerable<Country> GetCountries()
        {
            return _optService.GetCountries();
        }


        [HttpGet]
        [Route("phoneTypes")]
        public IEnumerable<PhoneType> GetPhoneTypes()
        {
            return _optService.GetPhoneTypes();
        }

        [HttpGet]
        [Route("contactStatuses")]
        public IEnumerable<ContactStatus> GetContactStatuses()
        {
            return _optService.GetContactStatuses();
        }

        [HttpGet]
        [Route("serviceCodes")]
        public IEnumerable<ServiceCode> GetServiceCodes()
        {
            return _optService.GetServiceCodes();
        }

        [HttpGet]
        [Route("serviceTypes")]
        public IEnumerable<ServiceType> GetServiceTypes()
        {
            return _optService.GetServiceTypes();
        }

        [HttpGet]
        [Route("evaluationTypes")]
        public IEnumerable<EvaluationType> GetEvaluationTypes()
        {
            return _optService.GetEvaluationTypes();
        }

        [HttpGet]
        [Route("messagefilterTypes")]
        public IEnumerable<MessageFilterType> GetMessageFilterTypes()
        {
            return _optService.GetMessageFilterTypes();
        }

        [HttpGet]
        [Route("studentTypes")]
        public IEnumerable<StudentType> GetStudentTypes()
        {
            return _optService.GetStudentTypes();
        }

        [HttpGet]
        [Route("methods")]
        public IEnumerable<Method> GetMethods()
        {
            return _optService.GetMethods();
        }

        [HttpGet]
        [Route("goals")]
        public IEnumerable<Goal> GetGoals()
        {
            return _optService.GetGoals();
        }

        [HttpGet]
        [Route("studentDeviationReasons")]
        public IEnumerable<StudentDeviationReason> GetStudentDeviationReasons()
        {
            return _optService.GetStudentDeviationReasons();
        }

        [HttpGet]
        [Route("encounterStatuses")]
        public IEnumerable<EncounterStatus> GetEncounterStatuses()
        {
            return _optService.GetEncounterStatuses();
        }

        [HttpGet]
        [Route("ediResponseTypes")]
        public IEnumerable<EdiFileType> GetEdiResponseTypes()
        {
            return _optService.GetEdiResponseTypes();
        }

        [HttpGet]
        [Route("schoolDistricts")]
        public IEnumerable<SchoolDistrict> GetSchoolDistricts()
        {
            return _optService.GetSchoolDistricts();
        }

        [HttpGet]
        [Route("trainingTypes")]
        public IEnumerable<TrainingType> GetTrainingTypes()
        {
            return _optService.GetTrainingTypes();
        }

    }
}
