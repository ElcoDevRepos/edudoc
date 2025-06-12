using BreckServiceBase.Utilities.Interfaces;
using FluentValidation;
using Model;
using Model.Partials.Interfaces;
using Service.Admin.Impersonation;
using Service.AnnualEntries;
using Service.Base.Validation;
using Service.BillingFailures;
using Service.BillingSchedules;
using Service.CaseLoads;
using Service.CaseLoads.CaseLoadOptions;
using Service.ClaimsEncounters;
using Service.CptCodes;
using Service.DiagnosisCodes;
using Service.EdiErrorCodes;
using Service.Encounters;
using Service.Encounters.ProviderStudentSupervisors;
using Service.Encounters.Referrals;
using Service.Encounters.ServiceOutcomes;
using Service.Encounters.StudentTherapies;
using Service.EvaluationTypes;
using Service.Goals;
using Service.Messages;
using Service.Messages.Documents;
using Service.Messages.Links;
using Service.ProgressReports;
using Service.ProviderInactivityDates;
using Service.Providers;
using Service.ProviderTrainings;
using Service.RevokeAccesses;
using Service.SchoolDistricts;
using Service.SchoolDistricts.AccountAssistants;
using Service.SchoolDistricts.FinancialReps;
using Service.SchoolDistricts.ProviderCaseUploads;
using Service.SchoolDistricts.Rosters;
using Service.ServiceUnitRules;
using Service.StudentParentalConsents;
using Service.Students;
using Service.Users;
using Service.Vouchers;
using System;

namespace Service.Base
{
    internal class ValidationService : IValidationService
    {

        //List of Validation Services
        private readonly UserValidator _userValidator;
        private readonly SchoolDistrictValidator _schoolDistrictValidator;
        private readonly SchoolValidator _schoolValidator;
        private readonly SchoolDistrictSchoolValidator _schoolDistrictsSchoolValidator;
        private readonly EscValidator _escValidator;
        private readonly EscSchoolDistrictValidator _escSchoolDistrictValidator;
        private readonly AdminSchoolDistrictValidator _adminSchoolDistrictValidator;
        private readonly ProviderValidator _providerValidator;
        private readonly ProviderEscValidator _providerEscValidator;
        private readonly StudentValidator _studentValidator;
        private readonly SchoolDistrictRosterValidator _schoolDistrictRosterValidator;
        private readonly ImpersonationLogValidator _impersonationLogValidator;
        private readonly DiagnosisCodeValidator _diagnosisCodeValidator;
        private readonly DiagnosisCodeAssociationValidator _diagnosisCodeAssociationValidator;
        private readonly EvaluationTypesDiagnosisCodeValidator _evaluationTypesDiagnosisCodeValidator;
        private readonly CptCodeValidator _cptCodeValidator;
        private readonly CptCodeAssociationValidator _cptCodeAssociationValidator;
        private readonly GoalValidator _goalValidator;
        private readonly MessageDocumentValidator _messageDocumentValidator;
        private readonly MessageLinkValidator _messageLinkValidator;
        private readonly ProviderTrainingValidator _providerTrainingValidator;
        private readonly MessageValidator _messageValidator;
        private readonly ReadMessageValidator _readMessageValidator;
        private readonly CaseLoadValidator _caseLoadValidator;
        private readonly ProviderStudentValidator _providerStudentValidator;
        private readonly EncounterValidator _encounterValidator;
        private readonly CaseLoadCptCodeValidator _caseLoadCptCodeValidator;
        private readonly CaseLoadGoalValidator _caseLoadGoalValidator;
        private readonly CaseLoadMethodValidator _caseLoadMethodValidator;
        private readonly CaseLoadScriptValidator _caseLoadScriptValidator;
        private readonly CaseLoadScriptGoalValidator _caseLoadScriptGoalValidator;
        private readonly EncounterStudentCptCodeValidator _encounterStudentCptCodeValidator;
        private readonly EncounterStudentMethodValidator _encounterStudentMethodValidator;
        private readonly EncounterStudentGoalValidator _encounterStudentGoalValidator;
        private readonly EncounterStudentValidator _encounterStudentValidator;
        private readonly StudentTherapyValidator _studentTherapyValidator;
        private readonly StudentTherapyScheduleValidator _studentTherapyScheduleValidator;
        private readonly TherapyCaseNoteValidator _therapyCaseNoteValidator;
        private readonly StudentParentalConsentValidator _studentParentalConsentValidator;
        private readonly BillingScheduleValidator _billingScheduleValidator;
        private readonly BillingFailureValidator _billingFailureValidator;
        private readonly SchoolDistrictInclusionValidator _schoolDistrictInclusionValidator;
        private readonly CptCodeExclusionValidator _cptCodeExclusionValidator;
        private readonly ProviderExclusionValidator _providerExclusionValidator;
        private readonly ServiceCodeExclusionValidator _serviceCodeExclusionValidator;
        private readonly ServiceUnitRuleValidator _serviceUnitRuleValidator;
        private readonly ServiceUnitTimeSegmentValidator _serviceUnitTimeSegmentValidator;
        private readonly ServiceOutcomeValidator _serviceOutcomeValidator;
        private readonly EdiErrorCodeValidator _ediErrorCodeValidator;
        private readonly ProgressReportValidator _progressReportValidator;
        private readonly RevokeAccessValidator _revokeAccessValidator;
        private readonly ProviderInactivityDateValidator _providerInactivityDateValidator;
        private readonly StudentIEPServicesValidator _studentIEPServicesValidator;
        private readonly VoucherValidator _voucherValidator;
        private readonly ClaimsEncounterValidator _claimsEncounterValidator;
        private readonly AdminNotificationInclusionValidator _adminNotificationInclusionValidator;
        private readonly AnnualEntryValidator _annualEntryValidator;
        private readonly EdiErrorCodeAdminNotificationValidator _ediErrorCodeAdminNotificationValidator;
        private readonly ProviderCaseUploadValidator _providerCaseUploadValidator;
        private readonly SchoolDistrictAccountAssistantsValidator _schoolDistrictAccountAssistantValidator;
        private readonly SchoolDistrictsFinancialRepsValidator _schoolDistrictFinancialRepsValidator;
        private readonly SupervisorProviderStudentReferalSignOffValidator _supervisorProviderStudentReferalSignOffValidator;
        private readonly ProviderStudentSupervisorValidator _providerStudentSupervisorValidator;
        private readonly DistrictProgressReportDateValidator _districtProgressReportDateValidator;
        protected IPrimaryContext Context;

        public ValidationService(IPrimaryContext context, IEmailHelper emailHelper)
        {
            Context = context;
            _userValidator = new UserValidator(context, emailHelper);
            _schoolDistrictValidator = new SchoolDistrictValidator(context);
            _schoolValidator = new SchoolValidator(context);
            _schoolDistrictsSchoolValidator = new SchoolDistrictSchoolValidator();
            _escValidator = new EscValidator(context);
            _escSchoolDistrictValidator = new EscSchoolDistrictValidator();
            _adminSchoolDistrictValidator = new AdminSchoolDistrictValidator();
            _providerValidator = new ProviderValidator();
            _providerEscValidator = new ProviderEscValidator(context);
            _studentValidator = new StudentValidator(context);
            _schoolDistrictRosterValidator = new SchoolDistrictRosterValidator();
            _impersonationLogValidator = new ImpersonationLogValidator();
            _diagnosisCodeValidator = new DiagnosisCodeValidator(context);
            _diagnosisCodeAssociationValidator = new DiagnosisCodeAssociationValidator();
            _evaluationTypesDiagnosisCodeValidator = new EvaluationTypesDiagnosisCodeValidator();
            _cptCodeValidator = new CptCodeValidator(context);
            _cptCodeAssociationValidator = new CptCodeAssociationValidator();
            _goalValidator = new GoalValidator();
            _messageDocumentValidator = new MessageDocumentValidator();
            _messageLinkValidator = new MessageLinkValidator();
            _providerTrainingValidator = new ProviderTrainingValidator();
            _messageValidator = new MessageValidator();
            _readMessageValidator = new ReadMessageValidator();
            _caseLoadValidator = new CaseLoadValidator(context);
            _providerStudentValidator = new ProviderStudentValidator(context);
            _encounterValidator = new EncounterValidator();
            _caseLoadCptCodeValidator = new CaseLoadCptCodeValidator();
            _caseLoadGoalValidator = new CaseLoadGoalValidator();
            _caseLoadMethodValidator = new CaseLoadMethodValidator();
            _caseLoadScriptValidator = new CaseLoadScriptValidator();
            _caseLoadScriptGoalValidator = new CaseLoadScriptGoalValidator();
            _encounterStudentCptCodeValidator = new EncounterStudentCptCodeValidator();
            _encounterStudentMethodValidator = new EncounterStudentMethodValidator();
            _encounterStudentGoalValidator = new EncounterStudentGoalValidator();
            _encounterStudentValidator = new EncounterStudentValidator();
            _studentTherapyValidator = new StudentTherapyValidator();
            _studentTherapyScheduleValidator = new StudentTherapyScheduleValidator();
            _therapyCaseNoteValidator = new TherapyCaseNoteValidator();
            _studentParentalConsentValidator = new StudentParentalConsentValidator();
            _billingScheduleValidator = new BillingScheduleValidator(context);
            _billingFailureValidator = new BillingFailureValidator();
            _schoolDistrictInclusionValidator = new SchoolDistrictInclusionValidator();
            _cptCodeExclusionValidator = new CptCodeExclusionValidator();
            _providerExclusionValidator = new ProviderExclusionValidator();
            _serviceCodeExclusionValidator = new ServiceCodeExclusionValidator();
            _serviceUnitRuleValidator = new ServiceUnitRuleValidator();
            _serviceUnitTimeSegmentValidator = new ServiceUnitTimeSegmentValidator();
            _serviceOutcomeValidator = new ServiceOutcomeValidator(context);
            _ediErrorCodeValidator = new EdiErrorCodeValidator(context);
            _progressReportValidator = new ProgressReportValidator();
            _revokeAccessValidator = new RevokeAccessValidator();
            _providerInactivityDateValidator = new ProviderInactivityDateValidator();
            _studentIEPServicesValidator = new StudentIEPServicesValidator();
            _voucherValidator = new VoucherValidator();
            _claimsEncounterValidator = new ClaimsEncounterValidator();
            _adminNotificationInclusionValidator = new AdminNotificationInclusionValidator();
            _annualEntryValidator = new AnnualEntryValidator();
            _ediErrorCodeAdminNotificationValidator = new EdiErrorCodeAdminNotificationValidator();
            _providerCaseUploadValidator = new ProviderCaseUploadValidator();
            _schoolDistrictAccountAssistantValidator = new SchoolDistrictAccountAssistantsValidator();
            _schoolDistrictFinancialRepsValidator = new SchoolDistrictsFinancialRepsValidator();
            _supervisorProviderStudentReferalSignOffValidator = new SupervisorProviderStudentReferalSignOffValidator(context);
            _providerStudentSupervisorValidator = new ProviderStudentSupervisorValidator(context);
            _districtProgressReportDateValidator = new DistrictProgressReportDateValidator();
        }

        public IValidator<T> GetValidator<T>(T obj)
        {

            switch (typeof(T))
            {

                case Type ty when ty == typeof(User):
                    {
                        return (IValidator<T>)_userValidator;
                    }

                case Type ty when ty == typeof(Provider):
                    {
                        return (IValidator<T>)_providerValidator;
                    }
                case Type ty when ty == typeof(SchoolDistrict):
                    {
                        return (IValidator<T>)_schoolDistrictValidator;
                    }
                case Type ty when ty == typeof(School):
                    {
                        return (IValidator<T>)_schoolValidator;
                    }
                case Type ty when ty == typeof(SchoolDistrictsSchool):
                    {
                        return (IValidator<T>)_schoolDistrictsSchoolValidator;
                    }
                case Type ty when ty == typeof(Esc):
                    {
                        return (IValidator<T>)_escValidator;
                    }
                case Type ty when ty == typeof(EscSchoolDistrict):
                    {
                        return (IValidator<T>)_escSchoolDistrictValidator;
                    }
                case Type ty when ty == typeof(AdminSchoolDistrict):
                    {
                        return (IValidator<T>)_adminSchoolDistrictValidator;
                    }
                case Type ty when ty == typeof(ProviderEscAssignment):
                    {
                        return (IValidator<T>)_providerEscValidator;
                    }
                case Type ty when ty == typeof(Student):
                    {
                        return (IValidator<T>)_studentValidator;
                    }
                case Type ty when ty == typeof(SchoolDistrictRoster):
                    {
                        return (IValidator<T>)_schoolDistrictRosterValidator;
                    }
                case Type ty when ty == typeof(ImpersonationLog):
                    {
                        return (IValidator<T>)_impersonationLogValidator;
                    }
                case Type ty when ty == typeof(DiagnosisCode):
                    {
                        return (IValidator<T>)_diagnosisCodeValidator;
                    }
                case Type ty when ty == typeof(EvaluationTypesDiagnosisCode):
                    {
                        return (IValidator<T>)_evaluationTypesDiagnosisCodeValidator;
                    }
                case Type ty when ty == typeof(CptCode):
                    {
                        return (IValidator<T>)_cptCodeValidator;
                    }
                case Type ty when ty == typeof(CptCodeAssocation):
                    {
                        return (IValidator<T>)_cptCodeAssociationValidator;
                    }
                case Type ty when ty == typeof(DiagnosisCodeAssociation):
                    {
                        return (IValidator<T>)_diagnosisCodeAssociationValidator;
                    }
                case Type ty when ty == typeof(Goal):
                    {
                        return (IValidator<T>)_goalValidator;
                    }
                case Type ty when ty == typeof(Goal):
                    {
                        return (IValidator<T>)_goalValidator;
                    }
                case Type ty when ty == typeof(MessageDocument):
                    {
                        return (IValidator<T>)_messageDocumentValidator;
                    }
                case Type ty when ty == typeof(MessageLink):
                    {
                        return (IValidator<T>)_messageLinkValidator;
                    }
                case Type ty when ty == typeof(ProviderTraining):
                    {
                        return (IValidator<T>)_providerTrainingValidator;
                    }
                case Type ty when ty == typeof(Message):
                    {
                        return (IValidator<T>)_messageValidator;
                    }
                case Type ty when ty == typeof(ReadMessage):
                    {
                        return (IValidator<T>)_readMessageValidator;
                    }
                case Type ty when ty == typeof(CaseLoad):
                    {
                        return (IValidator<T>)_caseLoadValidator;
                    }
                case Type ty when ty == typeof(ProviderStudent):
                    {
                        return (IValidator<T>)_providerStudentValidator;
                    }
                case Type ty when ty == typeof(Encounter):
                    {
                        return (IValidator<T>)_encounterValidator;
                    }
                case Type ty when ty == typeof(CaseLoadCptCode):
                    {
                        return (IValidator<T>)_caseLoadCptCodeValidator;
                    }
                case Type ty when ty == typeof(CaseLoadGoal):
                    {
                        return (IValidator<T>)_caseLoadGoalValidator;
                    }
                case Type ty when ty == typeof(CaseLoadMethod):
                    {
                        return (IValidator<T>)_caseLoadMethodValidator;
                    }
                case Type ty when ty == typeof(CaseLoadScript):
                    {
                        return (IValidator<T>)_caseLoadScriptValidator;
                    }
                case Type ty when ty == typeof(CaseLoadScriptGoal):
                    {
                        return (IValidator<T>)_caseLoadScriptGoalValidator;
                    }
                case Type ty when ty == typeof(EncounterStudentCptCode):
                    {
                        return (IValidator<T>)_encounterStudentCptCodeValidator;
                    }
                case Type ty when ty == typeof(EncounterStudentMethod):
                    {
                        return (IValidator<T>)_encounterStudentMethodValidator;
                    }
                case Type ty when ty == typeof(EncounterStudentGoal):
                    {
                        return (IValidator<T>)_encounterStudentGoalValidator;
                    }
                case Type ty when ty == typeof(EncounterStudent):
                    {
                        return (IValidator<T>)_encounterStudentValidator;
                    }
                case Type ty when ty == typeof(StudentTherapy):
                    {
                        return (IValidator<T>)_studentTherapyValidator;
                    }
                case Type ty when ty == typeof(StudentTherapySchedule):
                    {
                        return (IValidator<T>)_studentTherapyScheduleValidator;
                    }
                case Type ty when ty == typeof(TherapyCaseNote):
                    {
                        return (IValidator<T>)_therapyCaseNoteValidator;
                    }
                case Type ty when ty == typeof(StudentParentalConsent):
                    {
                        return (IValidator<T>)_studentParentalConsentValidator;
                    }
                case Type ty when ty == typeof(BillingSchedule):
                    {
                        return (IValidator<T>)_billingScheduleValidator;
                    }
                case Type ty when ty == typeof(BillingFailure):
                    {
                        return (IValidator<T>)_billingFailureValidator;
                    }
                case Type ty when ty == typeof(BillingScheduleDistrict):
                    {
                        return (IValidator<T>)_schoolDistrictInclusionValidator;
                    }
                case Type ty when ty == typeof(BillingScheduleExcludedCptCode):
                    {
                        return (IValidator<T>)_cptCodeExclusionValidator;
                    }
                case Type ty when ty == typeof(BillingScheduleExcludedProvider):
                    {
                        return (IValidator<T>)_providerExclusionValidator;
                    }
                case Type ty when ty == typeof(BillingScheduleExcludedServiceCode):
                    {
                        return (IValidator<T>)_serviceCodeExclusionValidator;
                    }
                case Type ty when ty == typeof(ServiceUnitRule):
                    {
                        return (IValidator<T>)_serviceUnitRuleValidator;
                    }
                case Type ty when ty == typeof(ServiceUnitTimeSegment):
                    {
                        return (IValidator<T>)_serviceUnitTimeSegmentValidator;
                    }
                case Type ty when ty == typeof(EdiErrorCode):
                    {
                        return (IValidator<T>)_ediErrorCodeValidator;
                    }
                case Type ty when ty == typeof(ProgressReport):
                    {
                        return (IValidator<T>)_progressReportValidator;
                    }
                case Type ty when ty == typeof(ServiceOutcome):
                    {
                        return (IValidator<T>)_serviceOutcomeValidator;
                    }
                case Type ty when ty == typeof(RevokeAccess):
                    {
                        return (IValidator<T>)_revokeAccessValidator;
                    }
                case Type ty when ty == typeof(ProviderInactivityDate):
                    {
                        return (IValidator<T>)_providerInactivityDateValidator;
                    }
                case Type ty when ty == typeof(IepService):
                    {
                        return (IValidator<T>)_studentIEPServicesValidator;
                    }
                case Type ty when ty == typeof(Voucher):
                    {
                        return (IValidator<T>)_voucherValidator;
                    }
                case Type ty when ty == typeof(ClaimsEncounter):
                    {
                        return (IValidator<T>)_claimsEncounterValidator;
                    }
                case Type ty when ty == typeof(BillingScheduleAdminNotification):
                    {
                        return (IValidator<T>)_adminNotificationInclusionValidator;
                    }
                case Type ty when ty == typeof(AnnualEntry):
                    {
                        return (IValidator<T>)_annualEntryValidator;
                    }
                case Type ty when ty == typeof(EdiErrorCodeAdminNotification):
                    {
                        return (IValidator<T>)_ediErrorCodeAdminNotificationValidator;
                    }
                case Type ty when ty == typeof(ProviderCaseUpload):
                    {
                        return (IValidator<T>)_providerCaseUploadValidator;
                    }
                case Type ty when ty == typeof(SchoolDistrictsAccountAssistant):
                    {
                        return (IValidator<T>)_schoolDistrictAccountAssistantValidator;
                    }
                case Type ty when ty == typeof(SchoolDistrictsFinancialRep):
                    {
                        return (IValidator<T>)_schoolDistrictFinancialRepsValidator;
                    }
                case Type ty when ty == typeof(SupervisorProviderStudentReferalSignOff):
                    {
                        return (IValidator<T>)_supervisorProviderStudentReferalSignOffValidator;
                    }
                case Type ty when ty == typeof(ProviderStudentSupervisor):
                    {
                        return (IValidator<T>)_providerStudentSupervisorValidator;
                    }
                case Type ty when ty == typeof(DistrictProgressReportDate):
                    {
                        return (IValidator<T>)_districtProgressReportDateValidator;
                    }

                // TODO: basic name validator casts too wide a net - Keep these at the end
                case Type ty when typeof(IHasStartEndDate).IsAssignableFrom(ty):
                    {
                        return (IValidator<T>)((IHasStartEndDate)obj).GenerateStartEndDateValidator();
                    }
                case Type ty when typeof(IBasicNameEntity).IsAssignableFrom(ty) && ty != typeof(StudentTherapy):
                    {
                        return (IValidator<T>)((IBasicNameEntity)obj).GenerateBasicNameValidator();
                    }
            }

            throw new NotImplementedException();
        }

    }
}
