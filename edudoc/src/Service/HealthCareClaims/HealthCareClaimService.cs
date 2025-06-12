using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Custom;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.Encounters;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

namespace Service.HealthCareClaims
{
    public class HealthCareClaimService : CRUDBaseService, IHealthCareClaimService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IConfiguration _configuration;
        private readonly Dictionary<int, string> _serviceCodePrefix;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;

        public HealthCareClaimService(IPrimaryContext context,
                                      IEmailHelper emailHelper,
                                      IConfigurationSettings configurationSettings,
                                      IConfiguration configuration,
                                      IEncounterStudentStatusService encounterStudentStatusService
                                      ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _emailHelper = emailHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
            _serviceCodePrefix = new Dictionary<int, string> {
                { (int)ServiceCodes.Counseling_Social_Work, "HCC" },
                { (int)ServiceCodes.Nursing, "HCN" },
                { (int)ServiceCodes.Occupational_Therapy, "HCO" },
                { (int)ServiceCodes.Physical_Therapy, "HCP" },
                { (int)ServiceCodes.Speech_Therapy, "HCS" },
                { (int)ServiceCodes.Psychology, "HCY" },
                { (int)ServiceCodes.Audiology, "HCA" }
            };
            _encounterStudentStatusService = encounterStudentStatusService;
        }

        public int GenerateHealthCareClaim(int billingScheduleId, int[] rebillingIds, int userId)
        {
            // Billing Schedule Inclusions
            var districtInclusionIds = _context.BillingScheduleDistricts.Where(inclusion => inclusion.BillingScheduleId == billingScheduleId && inclusion.SchoolDistrict.ActiveStatus)
                                                                .Select(inclusion => inclusion.SchoolDistrictId).ToList();

            // Gather all of the encounters(including: student.School.SchoolDistrictSchools.SchoolDistrictId, caseLoad)
            // in the districts that have unprocessed claims that don't match the exclusions
            IEnumerable<EncounterClaimsData> encounterClaimsData = GatherEncounterClaimsData(billingScheduleId, districtInclusionIds);

            // Remove any districts that do not have any encounters
            var districtIds = encounterClaimsData.Select(x => x.DistrictId).Distinct().ToList();

            // Gather all of the districts included in this claim file
            var districts = _context.SchoolDistricts.Include(x => x.Address).Where(district => districtIds.Any(id => id == district.Id) && district.ActiveStatus);
            var newClaim = NewHealthCareClaim(billingScheduleId);
            List<ClaimsDistrict> claimsDistricts = GenerateClaimsDistricts(newClaim, districts);
            List<EncounterClaimsData> encounterClaimsDataList = encounterClaimsData.ToList();
            List<ClaimsStudent> claimsStudents = GenerateClaimsStudents(claimsDistricts, encounterClaimsDataList);
            ClaimsEncountersDTO claimsEncountersDto = GenerateClaimsEncounters(claimsStudents, encounterClaimsDataList);

            if (!claimsEncountersDto.ClaimsEncountersToAdd.Any()) return 0;

            _context.Configuration.AutoDetectChangesEnabled = false;
            _context.Configuration.ValidateOnSaveEnabled = false;
            using (var dbContextTransaction = _context.Database.BeginTransaction())
            {
                try
                {

                    Console.WriteLine("-----Bulk Inserting Data-----");

                    _context.HealthCareClaims.Add(newClaim);
                    _context.SaveChanges();

                    var claimsDistrictsData = CommonFunctions.ToDataTable(claimsDistricts.Select((x, i) => new
                    {
                        IdentificationCode = x.IdentificationCode,
                        DistrictOrganizationName = x.DistrictOrganizationName,
                        Address = x.Address,
                        City = x.City,
                        State = x.State,
                        PostalCode = x.PostalCode,
                        EmployerId = x.EmployerId,
                        Index = x.Index,
                        HealthCareClaimsId = x.HealthCareClaim.Id,
                        SchoolDistrictId = x.SchoolDistrictId,
                        BulkIndex = i,
                    }).ToList());

                    var sqlParameter = new SqlParameter("@ClaimsDistrictsData", claimsDistrictsData);
                    sqlParameter.SqlDbType = SqlDbType.Structured;
                    sqlParameter.TypeName = "dbo.ClaimsDistrictData";
                    var execString = "EXEC dbo.SP_Bulk_Insert_ClaimsDistricts @ClaimsDistrictsData;";

                    var claimsDistrictsResults = _context.Database.SqlQuery<SpResults>(execString, sqlParameter).ToList();

                    claimsDistrictsResults = claimsDistrictsResults.OrderBy(x => x.InsertedId).ToList();

                    foreach (var (district, districtIndex) in claimsDistricts.WithIndex())
                    {
                        district.Id = claimsDistrictsResults[districtIndex].InsertedId;
                    }


                    foreach (var student in claimsStudents)
                    {
                        student.ClaimsDistrictId = student.ClaimsDistrict.Id;
                    }

                    var claimsStudentsData = CommonFunctions.ToDataTable(claimsStudents.Select((x, i) => new
                    {
                        IdentificationCode = x.IdentificationCode,
                        LastName = x.LastName,
                        FirstName = x.FirstName,
                        Address = x.Address,
                        City = x.City,
                        State = x.State,
                        PostalCode = x.PostalCode,
                        InsuredDateTimePeriod = x.InsuredDateTimePeriod,
                        ClaimsDistrictId = x.ClaimsDistrictId,
                        StudentId = x.StudentId,
                        BulkIndex = i
                    }).ToList());


                    sqlParameter = new SqlParameter("@ClaimsStudentsData", claimsStudentsData);
                    sqlParameter.SqlDbType = SqlDbType.Structured;
                    sqlParameter.TypeName = "dbo.ClaimsStudentData";
                    execString = "EXEC dbo.SP_Bulk_Insert_ClaimsStudents @ClaimsStudentsData;";

                    var claimsStudentsResults = _context.Database.SqlQuery<SpResults>(execString, sqlParameter).ToList();

                    claimsStudentsResults = claimsStudentsResults.OrderBy(x => x.InsertedId).ToList();

                    foreach (var (student, studentIndex) in claimsStudents.WithIndex())
                    {
                        student.Id = claimsStudentsResults[studentIndex].InsertedId;
                    }

                    foreach (var encounter in claimsEncountersDto.ClaimsEncountersToAdd)
                    {
                        encounter.ClaimsStudentId = encounter.ClaimsStudent.Id;
                    }

                    var claimsEncountersData = CommonFunctions.ToDataTable(claimsEncountersDto.ClaimsEncountersToAdd.Select((x, i) => new
                    {
                        ClaimAmount = x.ClaimAmount,
                        ProcedureIdentifier = x.ProcedureIdentifier,
                        BillingUnits = x.BillingUnits,
                        ServiceDate = x.ServiceDate,
                        PhysicianFirstName = x.PhysicianFirstName,
                        PhysicianLastName = x.PhysicianLastName,
                        PhysicianId = x.PhysicianId,
                        ReferringProviderFirstName = x.ReferringProviderFirstName,
                        ReferringProviderLastName = x.ReferringProviderLastName,
                        ReasonForServiceCode = x.ReasonForServiceCode,
                        ReferringProviderId = x.ReferringProviderId,
                        IsTelehealth = x.IsTelehealth,
                        ClaimsStudentId = x.ClaimsStudent.Id,
                        EncounterStudentId = x.EncounterStudentId,
                        EncounterStudentCptCodeId = x.EncounterStudentCptCodeId,
                        ControlNumberPrefix = x.ControlNumberPrefix,
                        BulkIndex = i
                    }).ToList());


                    sqlParameter = new SqlParameter("@ClaimsEncounterData", claimsEncountersData);
                    sqlParameter.SqlDbType = SqlDbType.Structured;
                    sqlParameter.TypeName = "dbo.ClaimsEncounterData";
                    execString = "EXEC dbo.SP_Bulk_Insert_ClaimsEncounters @ClaimsEncounterData;";

                    var claimsEncountersResults = _context.Database.SqlQuery<SpResults>(execString, sqlParameter).ToList();

                    claimsEncountersResults = claimsEncountersResults.OrderBy(x => x.InsertedId).ToList();

                    foreach (var (encounter, encounterIndex) in claimsEncountersDto.ClaimsEncountersToAdd.WithIndex())
                    {
                        encounter.Id = claimsEncountersResults[encounterIndex].InsertedId;
                    }

                    Console.WriteLine("-----Bulk Inserting Data (DONE) -----");

                    dbContextTransaction.Commit();

                    if (claimsEncountersDto.RedundantEncounters.Any())
                    {
                        _context.ClaimsEncounters.AddRange(claimsEncountersDto.RedundantEncounters);
                    }

                    dbContextTransaction.Dispose();

                    return newClaim.Id;
                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    Console.WriteLine($"Error occurred: {ex}");

                    _emailHelper.SendEmail(new Utilities.Models.EmailParams()
                    {
                        From = _configurationSettings.GetDefaultEmailFrom(),
                        To = _configuration["SystemErrorEmails"],
                        Subject = "HealthCareClaim Data Error",
                        Body = "Billing Schedule Id: " + billingScheduleId + Environment.NewLine +
                        "HealthCareClaimId: " + newClaim.Id + Environment.NewLine +
                        "Message: " + ex.Message + Environment.NewLine +
                        "Inner Exception: " + ex.InnerException + Environment.NewLine +
                        "Stack Trace: " + ex.StackTrace.ToString(),
                        IsHtml = false
                    });

                    dbContextTransaction.Dispose();
                    return 0;
                }
            }

        }

        public int GenerateReversalHealthCareClaim(int billingScheduleId, int userId)
        {
            var newClaim = NewHealthCareClaim(billingScheduleId);
            _context.HealthCareClaims.Add(newClaim);
            _context.SaveChanges();

            // Billing Schedule Inclusions
            var districtInclusionIds = _context.BillingScheduleDistricts
                .Where(inclusion => inclusion.BillingScheduleId == billingScheduleId && inclusion.SchoolDistrict.ActiveStatus)
                .Select(inclusion => inclusion.SchoolDistrictId).ToList();

            IEnumerable<ClaimsEncounter> claimsEncounters = GatherEncounterClaimsDataForReversal(billingScheduleId, districtInclusionIds);

            foreach (var encounter in claimsEncounters)
            {
                encounter.ReversedClaimId = newClaim.Id;
            }
            _context.SaveChanges();

            return newClaim.Id;
        }

        private IEnumerable<EncounterClaimsData> GatherEncounterClaimsData(int billingScheduleId, List<int> districtIds)
        {
            //var reBilledEncounterStudentCptCodeIds = _context.ClaimsEncounters.Where(x => rebillingIds.Contains(x.Id)).AsNoTracking().Select(x => x.EncounterStudentCptCodeId);
            var billingSchedule = _context.BillingSchedules.FirstOrDefault(bs => bs.Id == billingScheduleId);

            // Exclusions: CptCode, Provider, ServiceCode
            var cptCodeExclusionIds = new List<int>();
            var serviceCodeExclusionIds = new List<int>();
            var providerExclusionIds = new List<int>();

            if (billingScheduleId > 0)
                ApplyBillingScheduleProperties(cptCodeExclusionIds, serviceCodeExclusionIds, providerExclusionIds, billingScheduleId);

            return GatherEncounterClaimsDataForPayment(cptCodeExclusionIds, serviceCodeExclusionIds, providerExclusionIds, billingScheduleId, districtIds);
        }

        private IEnumerable<ClaimsEncounter> GatherEncounterClaimsDataForReversal(int billingScheduleId, List<int> districtIds)
        {
            var billingSchedule = _context.BillingSchedules.FirstOrDefault(bs => bs.Id == billingScheduleId);

            // Exclusions: CptCode, Provider, ServiceCode
            var cptCodeExclusionIds = new List<int>();
            var serviceCodeExclusionIds = new List<int>();
            var providerExclusionIds = new List<int>();

            if (billingScheduleId > 0)
                ApplyBillingScheduleProperties(cptCodeExclusionIds, serviceCodeExclusionIds, providerExclusionIds, billingScheduleId);

            List<ClaimsEncounter> _data = new List<ClaimsEncounter>();
            var studentCount = _context.Students.Count(s => districtIds.Contains(s.DistrictId ?? -1) && !s.Archived);
            var take = studentCount <= 2500 ? studentCount : 2500;
            var skip = 0;

            while (skip < studentCount)
            {
                var temp = _context.Students
                    .Where(s => districtIds.Contains(s.DistrictId ?? -1) && !s.Archived)
                    .OrderBy(s => s.Id)
                    .Skip(skip)
                    .Take(take)
                    .SelectMany(
                        s => s.EncounterStudents.Where(es => es.EncounterStatusId == (int)EncounterStatuses.SCHEDULED_FOR_REVERSAL
                        && !es.Archived
                        && !es.Encounter.Archived
                        && !es.EncounterStudentCptCodes.Any(z => cptCodeExclusionIds.Contains(z.CptCodeId))
                        && !serviceCodeExclusionIds.Contains(es.Encounter.Provider.ProviderTitle.ServiceCodeId)
                        && !providerExclusionIds.Contains(es.Encounter.ProviderId)
                        && es.ClaimsEncounters.Any(ce => ce.Response)
                    )).SelectMany(es => es.ClaimsEncounters.Where(ce => ce.Response)).ToList();

                _data.AddRange(temp);
                skip += take;
            }

            return _data;
        }

        private IEnumerable<EncounterClaimsData> GatherEncounterClaimsDataForPayment(List<int> cptCodeExclusionIds, List<int> serviceCodeExclusionIds, List<int> providerExclusionIds, int billingScheduleId, List<int> districtIds)
        {
            // TODO SD: Temporary until we determine how to handle these moving forward (Likely BilingFailure Reason)
            var serviceCodesRequireNPI = CommonFunctions.GetServiceCodesRequiringNPI();

            var serviceCodesRequireReferrals = CommonFunctions.GetServiceCodesWithReferrals();

            List<EncounterClaimsData> _data = new List<EncounterClaimsData>();

            var studentIds = _context.Students
                .Where(s =>
                    districtIds.Contains(s.DistrictId ?? -1) &&
                    s.EncounterStudents.Any(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_BILLING) &&
                    !s.Archived)
                .Select(s => s.Id)
                .OrderBy(s => s)
                .ToList();
            var studentCount = studentIds.Count();
            var take = studentCount <= 500 ? studentCount : 500;
            var skip = 0;

            var billableList = new List<int>
            {
                (int)ServiceTypes.Treatment_Therapy,
                (int)ServiceTypes.Evaluation_Assessment,
            };

            _context.Database.CommandTimeout = 600;

            var fortyEightHoursAgo = DateTime.Now.AddHours(-48);

            while (skip < studentCount)
            {
                var batchIds = studentIds.Skip(skip).Take(take).ToList();
                var temp = _context.Students
                    .Where(s => batchIds.Contains(s.Id))
                    .SelectMany(s => s.EncounterStudents.Where(es =>
                        billableList.Contains(es.Encounter.ServiceTypeId) &&
                        es.EncounterStatus.IsBillable &&
                        es.DateESigned < fortyEightHoursAgo && // Encounters that were signed at least 48 hours ago
                        !es.Archived &&
                        !es.Encounter.Archived &&
                        !es.BillingFailures.Any(bf => !bf.IssueResolved) &&
                        !es.EncounterStudentCptCodes.Any(z => cptCodeExclusionIds.Contains(z.CptCodeId)) &&
                        !serviceCodeExclusionIds.Contains(es.Encounter.Provider.ProviderTitle.ServiceCodeId) &&
                        !providerExclusionIds.Contains(es.Encounter.ProviderId) &&
                        (
                            !es.ClaimsEncounters.Any() ||
                            es.ClaimsEncounters.All(ce => ce.Rebilled)
                        )
                    ))
                    .Select(es => new EncounterClaimsDataDTO
                    {
                        EncounterStudentId = es.Id,
                        IsTreatment = es.Encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy,
                        IsTelehealth = es.IsTelehealth,
                        EncounterDate = es.EncounterDate,
                        ServiceCodeId = es.Encounter.Provider.ProviderTitle.ServiceCodeId,
                        ProviderId = es.Encounter.ProviderId,
                        ReferringProvider = serviceCodesRequireReferrals.Contains(es.Encounter.Provider.ProviderTitle.ServiceCodeId) ?
                            es.Student.SupervisorProviderStudentReferalSignOffs
                                .Any(r =>
                                    r.ServiceCodeId == es.Encounter.Provider.ProviderTitle.ServiceCodeId &&
                                    r.EffectiveDateFrom.HasValue && DbFunctions.TruncateTime(r.EffectiveDateFrom) <= DbFunctions.TruncateTime(es.EncounterDate) &&
                                    r.Supervisor.OrpApprovalDate != null &&
                                    r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1) &&
                                    (
                                        !r.EffectiveDateTo.HasValue ||
                                        DbFunctions.TruncateTime(r.EffectiveDateTo) > DbFunctions.TruncateTime(es.EncounterDate)
                                    )
                                 ) ? es.Student.SupervisorProviderStudentReferalSignOffs
                                .FirstOrDefault(r =>
                                    r.ServiceCodeId == es.Encounter.Provider.ProviderTitle.ServiceCodeId &&
                                    r.EffectiveDateFrom.HasValue && DbFunctions.TruncateTime(r.EffectiveDateFrom) <= DbFunctions.TruncateTime(es.EncounterDate) &&
                                    r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1) &&
                                    (
                                        !r.EffectiveDateTo.HasValue ||
                                        DbFunctions.TruncateTime(r.EffectiveDateTo) > DbFunctions.TruncateTime(es.EncounterDate)
                                    )
                                 ).Supervisor : null
                            :
                            es.Encounter.Provider,
                        ReferringProviderUser = serviceCodesRequireReferrals.Contains(es.Encounter.Provider.ProviderTitle.ServiceCodeId) ?
                            es.Student.SupervisorProviderStudentReferalSignOffs
                                .Any(r =>
                                    r.ServiceCodeId == es.Encounter.Provider.ProviderTitle.ServiceCodeId &&
                                    r.EffectiveDateFrom.HasValue && DbFunctions.TruncateTime(r.EffectiveDateFrom) <= DbFunctions.TruncateTime(es.EncounterDate) &&
                                    r.Supervisor.OrpApprovalDate != null &&
                                    r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1) &&
                                    (
                                        !r.EffectiveDateTo.HasValue ||
                                        DbFunctions.TruncateTime(r.EffectiveDateTo) > DbFunctions.TruncateTime(es.EncounterDate)
                                    )
                                 ) ? es.Student.SupervisorProviderStudentReferalSignOffs
                                .FirstOrDefault(r =>
                                    r.ServiceCodeId == es.Encounter.Provider.ProviderTitle.ServiceCodeId &&
                                    r.EffectiveDateFrom.HasValue && DbFunctions.TruncateTime(r.EffectiveDateFrom) <= DbFunctions.TruncateTime(es.EncounterDate) &&
                                    r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1) &&
                                    (
                                        !r.EffectiveDateTo.HasValue ||
                                        DbFunctions.TruncateTime(r.EffectiveDateTo) > DbFunctions.TruncateTime(es.EncounterDate)
                                    )
                                 ).Supervisor.ProviderUser : null
                            :
                            es.Encounter.Provider.ProviderUser,
                        StudentId = es.StudentId,
                        StudentFirstName = es.Student.FirstName,
                        StudentLastName = es.Student.LastName,
                        DateOfBirth = es.Student.DateOfBirth,
                        DistrictId = es.Student.DistrictId ?? 0,
                        ESignedById = es.ESignedById,
                        SupervisorESignedById = es.SupervisorESignedById,
                        SupervisorESignatureText = es.SupervisorESignatureText,

                        // TODO SD: Temporary fix until we determine how evals have caseloads and treatments have diagnosiscodeids
                        CaseLoadDiagnosisCode = (es.CaseLoad.ServiceCodeId == (int)ServiceCodes.Nursing ? es.CaseLoad.CaseLoadScripts.FirstOrDefault(cls => !cls.Archived && cls.InitiationDate <= es.EncounterDate).DiagnosisCode.Code : es.CaseLoad.DiagnosisCode.Code.Replace(".", "")) ?? es.DiagnosisCode.Code.Replace(".", "") ?? "",
                        EncounterDiagnosisCode = es.DiagnosisCode.Code.Replace(".", "") ?? es.CaseLoad.DiagnosisCode.Code.Replace(".", "") ?? "",

                        Address = es.Student.Address,
                        MedicaidNo = es.Student.MedicaidNo,
                        ParentalConsents = es.Student.StudentParentalConsents.ToList(),
                        HasReferral = es.Student.SupervisorProviderStudentReferalSignOffs.Any(r =>
                                    r.ServiceCodeId == es.Encounter.Provider.ProviderTitle.ServiceCodeId &&
                                    r.EffectiveDateFrom.HasValue && DbFunctions.TruncateTime(r.EffectiveDateFrom) <= DbFunctions.TruncateTime(es.EncounterDate) &&
                                    r.Supervisor.OrpApprovalDate != null &&
                                    r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1) &&
                                    (
                                        !r.EffectiveDateTo.HasValue ||
                                        DbFunctions.TruncateTime(r.EffectiveDateTo) > DbFunctions.TruncateTime(es.EncounterDate)
                                    )
                            ),
                        Claims = es.EncounterStudentCptCodes.Select(escpt => new ClaimsData
                        {
                            Id = escpt.Id,
                            Archived = escpt.Archived,
                            Minutes = escpt.Minutes ?? 0,
                            CptCode = escpt.CptCode,
                            CrossoverCptCode = escpt.CptCode.ServiceUnitRule.CptCode,
                            ServiceUnitRule = escpt.CptCode.ServiceUnitRule,
                            ServiceUnitTimeSegments = escpt.CptCode.ServiceUnitRule.ServiceUnitTimeSegments.ToList(),
                        }).ToList(), // TODO SD 20MAY2024 - Add Where clause for reversals and .Response on claims OR ! Reversal
                        Scripts = es.CaseLoad.CaseLoadScripts.Where(cs => !cs.Archived).Select(cs => new ClaimsScriptData {
                            ScriptId = cs.Id,
                            DiagnosisCode = cs.DiagnosisCode.Code,
                            DoctorFirstName = cs.DoctorFirstName,
                            DoctorLastName = cs.DoctorLastName,
                            Npi = cs.Npi
                        }).ToList(),
                    })
                    .Select(es => new EncounterClaimsData
                    {
                        EncounterStudentId = es.EncounterStudentId,
                        IsTreatment = es.IsTreatment,
                        IsTelehealth = es.IsTelehealth,
                        EncounterDate = es.EncounterDate,
                        ServiceCodeId = es.ServiceCodeId,
                        ProviderId = es.ProviderId,
                        ProviderFirstName = es.ReferringProviderUser != null ? es.ReferringProviderUser.FirstName : "",
                        ProviderLastName = es.ReferringProviderUser != null ? es.ReferringProviderUser.LastName : "",
                        StudentId = es.StudentId,
                        StudentFirstName = es.StudentFirstName,
                        StudentLastName = es.StudentLastName,
                        DateOfBirth = es.DateOfBirth,
                        ProviderNPI = es.ReferringProvider != null ? es.ReferringProvider.Npi : "",
                        VerifiedOrp = es.ReferringProvider != null ? es.ReferringProvider.VerifiedOrp : false,
                        OrpApprovalDate = es.ReferringProvider != null ? es.ReferringProvider.OrpApprovalDate : null,
                        DistrictId = es.DistrictId,
                        ESignedById = es.ESignedById,
                        SupervisorESignedById = es.SupervisorESignedById,
                        SupervisorESignatureText = es.SupervisorESignatureText,

                        // TODO SD: Temporary fix until we determine how evals have caseloads and treatments have diagnosiscodeids
                        CaseLoadDiagnosisCode = es.CaseLoadDiagnosisCode,
                        EncounterDiagnosisCode = es.EncounterDiagnosisCode,

                        Address = es.Address,
                        MedicaidNo = es.MedicaidNo,
                        ParentalConsents = es.ParentalConsents,
                        HasReferral = es.HasReferral,
                        Claims = es.Claims,
                        Scripts = es.Scripts,
                    }
                    )
                 // TODO SD: Temporary fix until we resolve all issues
                .Where(x =>
                    (
                        (serviceCodesRequireNPI.Contains(x.ServiceCodeId) && x.ProviderNPI.Length == 10) ||
                        !serviceCodesRequireNPI.Contains(x.ServiceCodeId)
                    ) &&
                    (
                        x.IsTreatment && x.CaseLoadDiagnosisCode.Length > 0) ||
                        (x.EncounterDiagnosisCode.Length > 0 && !x.IsTreatment)
                    )
                .AsNoTracking()
                .ToList();


                temp = FilterClaims(temp, billingScheduleId);

                _data.AddRange(temp);
                skip += take;
            }

            return _data.OrderByDescending(x => x.EncounterDate);
        }

        private List<EncounterClaimsData> FilterClaims(List<EncounterClaimsData> claims, int? billingScheduleId)
        {
            var addrMaxLength = 55;

            // Claim Requirement: Student must have a valid Address
            CreateBillingFailures(
                claims.Where(es =>
                        es.Address == null ||
                        es.Address.Address1.Trim().Length == 0 ||
                        es.Address.City.Trim().Length == 0 ||
                        es.Address.StateCode.Trim().Length == 0 ||
                        es.Address.Zip.Trim().Length == 0
                ).ToList()
                , (int)BillingFailureReasons.Address, billingScheduleId
            );

            claims = claims.Where(es =>
                  es.Address != null &&
                  es.Address.Address1.Trim().Length > 0 &&
                  es.Address.City.Trim().Length > 0 &&
                  es.Address.StateCode.Trim().Length > 0 &&
                  es.Address.Zip.Trim().Length > 0
            ).ToList();

            // Claim Requirement: Student address must not be over 55 characters long
            CreateBillingFailures(
                claims.Where(es =>
                    es.Address.Address1.Trim().Length > addrMaxLength).ToList()
                , (int)BillingFailureReasons.Address_Over_Max_Length, billingScheduleId
            );

            claims = claims.Where(es =>
                es.Address.Address1.Trim().Length <= addrMaxLength
            ).ToList();

            // Claim Requirement: Student must have valid MedicaidNo
            CreateBillingFailures(
                claims.Where(es =>
                        es.MedicaidNo == null ||
                        es.MedicaidNo.Length != 12
                ).ToList()
                , (int)BillingFailureReasons.MedicaidNo, billingScheduleId
            );

            claims = claims.Where(es => es.MedicaidNo != null && es.MedicaidNo.Length == 12).ToList();

            // Claim Requirement: Student must have valid Parental Consent
            CreateBillingFailures(
                claims.Where(es =>
                    !es.ParentalConsents.Any(pc =>
                        pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent
                        && pc.ParentalConsentEffectiveDate.HasValue
                        && pc.ParentalConsentEffectiveDate.Value.Date <= es.EncounterDate.Date
                    ) &&
                    es.IsTreatment).ToList()
                , (int)BillingFailureReasons.Parental_Consent, billingScheduleId
            );

            claims = claims.Where(es =>
                es.ParentalConsents.Any(pc =>
                    pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent
                    && pc.ParentalConsentEffectiveDate.HasValue
                    && pc.ParentalConsentEffectiveDate.Value.Date <= es.EncounterDate.Date
                ) ||
                !es.IsTreatment
            ).ToList();

            // Claim Requirement: All claims must be signed by provider
            CreateBillingFailures(
                claims.Where(es =>
                    es.ESignedById == null &&
                    es.IsTreatment).ToList()
                , (int)BillingFailureReasons.Provider_Signature, billingScheduleId
            );

            claims = claims.Where(es =>
                es.ESignedById > 0 ||
                !es.IsTreatment
            ).ToList();

            // Claim Requirement: All claims must be signed by Supervisor if applicable
            CreateBillingFailures(
                claims.Where(es =>
                    es.SupervisorESignedById > 0 &&
                    es.SupervisorESignatureText == null &&
                    es.IsTreatment).ToList()
                , (int)BillingFailureReasons.Supervisor_Signature, billingScheduleId
            );

            claims = claims.Where(es =>
                !es.IsTreatment ||
                es.SupervisorESignedById == null ||
                (es.SupervisorESignedById > 0 &&
                es.SupervisorESignatureText != null)
            ).ToList();

            // Claim Requirement: For Providers with (OT / PT / Speech / AUD) Service Codes - All students must have referral
            // OT / PT / Speech Referral - if there is no referral it cannot be included in the claim
            var referralServiceCodes = new List<int>
                {
                    (int)ServiceCodes.Occupational_Therapy,
                    (int)ServiceCodes.Physical_Therapy,
                    (int)ServiceCodes.Speech_Therapy,
                    (int)ServiceCodes.Audiology,
                };

            var today = DateTime.Now;
            CreateBillingFailures(
                claims.Where(es =>
                    es.IsTreatment &&
                    referralServiceCodes.Contains(es.ServiceCodeId) &&
                    (
                        !es.VerifiedOrp ||
                        es.OrpApprovalDate == null ||
                        !es.HasReferral
                    )
                ).ToList()
                , (int)BillingFailureReasons.Referral, billingScheduleId
            );

            claims = claims.Where(es =>
                !es.IsTreatment ||
                !referralServiceCodes.Contains(es.ServiceCodeId) ||
                (
                    referralServiceCodes.Contains(es.ServiceCodeId) &&
                    es.VerifiedOrp &&
                    es.OrpApprovalDate != null &&
                    es.HasReferral
                )
            ).ToList();

            DateTime date = DateTime.Today.AddYears(-1).AddDays(-1);
            // Claim Requirement: The encounter must have a CPT code
            CreateBillingFailures(
                claims.Where(es =>
                    es.EncounterDate > date &&
                    !es.Claims.Any()
                ).ToList()
                , (int)BillingFailureReasons.CPT_Code, billingScheduleId
            );

            claims = claims.Where(es =>
                    es.EncounterDate > date &&
                    es.Claims.Any()
            ).ToList();

            // Claim Requirement: The encounter must have either no service unit rules, or a matching service unit rule
            CreateBillingFailures(
                claims
                    .Where(es =>
                        es.Claims.Any(c =>
                            c.ServiceUnitRule != null
                            && c.ServiceUnitTimeSegments.All(ts =>
                                c.Minutes < ts.StartMinutes || c.Minutes > ts.EndMinutes
                            )
                        )
                    )
                    .ToList(),
                (int)BillingFailureReasons.Service_Unit_Rule_Violation,
                billingScheduleId
            );

            claims = claims
                .Where(es =>
                    es.Claims.All(c =>
                        c.ServiceUnitRule == null
                        || c.ServiceUnitTimeSegments.Count == 0
                        || c.ServiceUnitTimeSegments.Any(ts =>
                            c.Minutes >= ts.StartMinutes && c.Minutes <= ts.EndMinutes
                        )
                    )
                )
                .ToList();

            return claims;
        }

        private void ApplyBillingScheduleProperties(List<int> cptCodeExclusionIds, List<int> serviceCodeExclusionIds, List<int> providerExclusionIds, int billingScheduleId)
        {
            // Gather Billing Schedule Exclusions
            // Exclusions: CptCode, Provider, ServiceCode
            cptCodeExclusionIds = _context.BillingScheduleExcludedCptCodes.Where(codes => codes.BillingScheduleId == billingScheduleId).Select(code => code.CptCodeId).ToList();
            serviceCodeExclusionIds = _context.BillingScheduleExcludedServiceCodes.Where(codes => codes.BillingScheduleId == billingScheduleId).Select(code => code.ServiceCodeId).ToList();
            providerExclusionIds = _context.BillingScheduleExcludedProviders.Where(providers => providers.BillingScheduleId == billingScheduleId).Select(provider => provider.ProviderId).ToList();
        }

        private void CreateBillingFailures(List<EncounterClaimsData> failedClaims, int reasonId, int? billingScheduleId)
        {
            List<BillingFailure> newBillingFailures = new List<BillingFailure>();
            foreach (var claim in failedClaims)
            {
                newBillingFailures.Add(new BillingFailure()
                {
                    EncounterStudentId = claim.EncounterStudentId,
                    BillingFailureReasonId = reasonId,
                    BillingScheduleId = billingScheduleId,
                });
            }
            _context.BillingFailures.AddRange(newBillingFailures);
            _context.SaveChanges();

            if (failedClaims.Any())
            {
                _encounterStudentStatusService.EncounterStudentStatusUpdateFromBillingFailure(failedClaims, reasonId);
            }
        }

        private HealthCareClaim NewHealthCareClaim(int billingScheduleId)
        {
            var newClaim = new HealthCareClaim
            {
                DateCreated = DateTime.UtcNow,
            };

            if (billingScheduleId > 0)
                newClaim.BillingScheduleId = billingScheduleId;

            return newClaim;
        }

        private List<ClaimsDistrict> GenerateClaimsDistricts(HealthCareClaim newClaim, IQueryable<SchoolDistrict> districts)
        {
            var claimsDistrictsToAdd = new List<ClaimsDistrict>();

            foreach (var district in districts)
            {
                var claimsDistrictToAdd = new ClaimsDistrict
                {
                    IdentificationCode = CommonFunctions.TrimStringValue(80, CommonFunctions.PadStringValue(2, true, district.NpiNumber)),
                    DistrictOrganizationName = CommonFunctions.TrimStringValue(60, district.Name),
                    Address = district.Address != null ? CommonFunctions.TrimStringValue(55, district.Address.Address1) : " ",
                    City = district.Address != null ? CommonFunctions.TrimStringValue(30, CommonFunctions.PadStringValue(2, false, district.Address.City)) : "  ",
                    State = district.Address != null ? CommonFunctions.TrimStringValue(2, CommonFunctions.PadStringValue(2, false, district.Address.StateCode)) : "  ",
                    PostalCode = district.Address != null ? CommonFunctions.TrimStringValue(5, CommonFunctions.PadStringValue(5, true, district.Address.Zip)) : "00000",
                    EmployerId = CommonFunctions.TrimStringValue(50, district.EinNumber),
                    SchoolDistrictId = district.Id,
                    HealthCareClaim = newClaim,
                };

                claimsDistrictsToAdd.Add(claimsDistrictToAdd);
            }
            return claimsDistrictsToAdd;
        }

        private List<ClaimsStudent> GenerateClaimsStudents(List<ClaimsDistrict> claimsDistricts, List<EncounterClaimsData> encounterClaims)
        {
            var claimsStudentsToAdd = new List<ClaimsStudent>();
            foreach (var district in claimsDistricts)
            {
                var claimsStudents = encounterClaims
                                        .Where(x =>
                                            district.SchoolDistrictId == x.DistrictId
                                        ).Select(es => new
                                        {
                                            Id = es.StudentId,
                                            MedicaidNo = es.MedicaidNo,
                                            FirstName = es.StudentFirstName,
                                            LastName = es.StudentLastName,
                                            Address = es.Address,
                                            DateOfBirth = es.DateOfBirth,
                                        }).GroupBy(x => x.Id).Select(g => g.First());

                foreach (var student in claimsStudents)
                {
                    var claimsStudentToAdd = new ClaimsStudent
                    {
                        IdentificationCode = CommonFunctions.TrimStringValue(12, CommonFunctions.PadStringValue(12, true, student.MedicaidNo)),
                        FirstName = CommonFunctions.TrimStringValue(35, student.FirstName),
                        LastName = CommonFunctions.TrimStringValue(60, student.LastName),
                        Address = student.Address != null ? CommonFunctions.TrimStringValue(55, student.Address.Address1) : "",
                        City = student.Address != null ? CommonFunctions.TrimStringValue(30, CommonFunctions.PadStringValue(2, false, student.Address.City)) : "  ",
                        State = student.Address != null ? CommonFunctions.TrimStringValue(2, CommonFunctions.PadStringValue(2, false, student.Address.StateCode)) : "  ",
                        PostalCode = student.Address != null ? CommonFunctions.TrimStringValue(5, CommonFunctions.PadStringValue(5, true, student.Address.Zip)) : "00000",

                        InsuredDateTimePeriod = student.DateOfBirth.ToString("yyyyMMdd"),
                        ClaimsDistrict = district,
                        StudentId = student.Id,
                    };

                    claimsStudentsToAdd.Add(claimsStudentToAdd);
                }

            }

            return claimsStudentsToAdd;
        }

        public ClaimsEncountersDTO GenerateClaimsEncounters(List<ClaimsStudent> claimsStudents, List<EncounterClaimsData> encounterClaims)
        {
            var response = new ClaimsEncountersDTO();
            response.ClaimsEncountersToAdd = new List<ClaimsEncounter>();
            response.RedundantEncounters = new List<ClaimsEncounter>();

            foreach (var student in claimsStudents)
            {
                var treatments =
                    encounterClaims.Where(x =>
                        x.IsTreatment &&
                        x.StudentId == student.StudentId
                    )
                    .SelectMany(ce => ce.Claims.Where(c => !c.Archived && c.Minutes > 0), (ce, claim) => new ClaimsDataMaster
                    {
                        Claim = claim,
                        EncounterDate = ce.EncounterDate,
                        ProviderId = ce.ProviderId,
                        EncounterStudentId = ce.EncounterStudentId,
                        IsTreatment = ce.IsTreatment,
                        ServiceCodeId = ce.ServiceCodeId,
                        ProviderFirstName = ce.ProviderFirstName,
                        ProviderLastName = ce.ProviderLastName,
                        ProviderNPI = ce.ProviderNPI,
                        CaseLoadDiagnosisCode = ce.CaseLoadDiagnosisCode,
                        EncounterDiagnosisCode = ce.EncounterDiagnosisCode,
                        Scripts = ce.Scripts,
                    }).ToList();

                GenerateTreatmentClaimsEncounters(response, student, treatments);

                var evals =
                    encounterClaims.Where(x =>
                        !x.IsTreatment &&
                        x.StudentId == student.StudentId
                    ).ToList();
                GenerateEvalClaimsEncounters(response, student, evals);
            }

            return response;
        }

        private void GenerateTreatmentClaimsEncounters(ClaimsEncountersDTO claimsEncounters, ClaimsStudent student, List<ClaimsDataMaster> claims)
        {
            var cptCodeIds = claims.Select(c => c.Claim.CptCode.Id).Distinct();

            foreach (var cptCodeId in cptCodeIds)
            {
                // Grab all encounterStudentCPTCode records with a matching student and cptcodeId
                var cptMatchedEncounters = claims.Where(x => x.Claim.CptCode.Id == cptCodeId);
                var groupedList = HandleTreatmentGrouping(cptMatchedEncounters);

                foreach (var claimEncounter in groupedList)
                {
                    var minutes = claimEncounter.Claim.Minutes;
                    var redundantCodes = GetRedundantTreatmentCodes(claimEncounter, cptMatchedEncounters);

                    if (redundantCodes.Any())
                    {
                        minutes += AggregateCodes(redundantCodes) ?? 0;
                        foreach (var redundantEncounter in redundantCodes)
                        {
                            GenerateClaimsEncounterWithoutServiceUnitRule(redundantEncounter, student, claimsEncounters.RedundantEncounters, claimEncounter.Claim.Id);
                        }
                    }

                    if (claimEncounter.Claim.ServiceUnitRule != null && claimEncounter.Claim.ServiceUnitTimeSegments.Any())
                    {
                        GenerateClaimsEncounterWithServiceUnitRule(claimEncounter, student, claimsEncounters.ClaimsEncountersToAdd, (int)minutes);
                    }
                    else
                    {
                        GenerateClaimsEncounterWithoutServiceUnitRule(claimEncounter, student, claimsEncounters.ClaimsEncountersToAdd, null);
                    }
                }
            }
        }

        private void GenerateEvalClaimsEncounters(ClaimsEncountersDTO claimsEncounters, ClaimsStudent student, IEnumerable<EncounterClaimsData> encounters)
        {
            foreach (var encounter in encounters)
            {
                var claims =
                    encounter.Claims.Where(c => !c.Archived && c.Minutes > 0).Select(claim => new ClaimsDataMaster
                    {
                        Claim = claim,
                        EncounterDate = encounter.EncounterDate,
                        ProviderId = encounter.ProviderId,
                        EncounterStudentId = encounter.EncounterStudentId,
                        IsTreatment = encounter.IsTreatment,
                        ServiceCodeId = encounter.ServiceCodeId,
                        ProviderFirstName = encounter.ProviderFirstName,
                        ProviderLastName = encounter.ProviderLastName,
                        ProviderNPI = encounter.ProviderNPI,
                        CaseLoadDiagnosisCode = encounter.CaseLoadDiagnosisCode,
                        EncounterDiagnosisCode = encounter.EncounterDiagnosisCode,
                        Scripts = encounter.Scripts,
                    });
                var cptCodeIds = claims.Select(c => c.Claim.CptCode.Id).Distinct();

                foreach (var cptCodeId in cptCodeIds)
                {
                    // Grab all encounterStudentCPTCode records with a matching student and cptcodeId
                    var cptMatchedEncounters = claims.Where(x => x.Claim.CptCode.Id == cptCodeId);
                    var newestClaim = cptMatchedEncounters.FirstOrDefault();

                    if (newestClaim != null)
                    {
                        var minutes = newestClaim.Claim.Minutes;
                        var redundantCodes = GetRedundantEvalCodes(newestClaim.Claim, cptMatchedEncounters);

                        if (redundantCodes.Any())
                        {
                            minutes += AggregateCodes(redundantCodes) ?? 0;
                            foreach (var redundantEncounter in redundantCodes)
                            {
                                GenerateClaimsEncounterWithoutServiceUnitRule(redundantEncounter, student, claimsEncounters.RedundantEncounters, newestClaim.Claim.Id);
                            }
                        }

                        if (newestClaim.Claim.ServiceUnitRule != null && newestClaim.Claim.ServiceUnitTimeSegments.Any())
                        {
                            GenerateClaimsEncounterWithServiceUnitRule(newestClaim, student, claimsEncounters.ClaimsEncountersToAdd, (int)minutes);
                        }
                        else
                        {
                            GenerateClaimsEncounterWithoutServiceUnitRule(newestClaim, student, claimsEncounters.ClaimsEncountersToAdd, null);
                        }
                    }
                }
            }
        }

        private IEnumerable<ClaimsDataMaster> HandleTreatmentGrouping(IEnumerable<ClaimsDataMaster> cptMatchedEncounters)
        {
            return cptMatchedEncounters
                .GroupBy(ce => new { EncounterDate = ce.EncounterDate, ProviderId = ce.ProviderId })
                .Select(x => x.FirstOrDefault());
        }

        private IEnumerable<ClaimsDataMaster> GetRedundantTreatmentCodes(ClaimsDataMaster claimEncounter, IEnumerable<ClaimsDataMaster> cptMatchedEncounters)
        {
            // Aggregate same day encounters
            return cptMatchedEncounters.Where(x => x.EncounterDate == claimEncounter.EncounterDate
                    && x.ProviderId == claimEncounter.ProviderId
                    && x.Claim.Id != claimEncounter.Claim.Id);
        }

        private IQueryable<ClaimsDataMaster> GetRedundantEvalCodes(ClaimsData claimEncounter, IEnumerable<ClaimsDataMaster> cptMatchedEncounters)
        {
            // Aggregate same day encounters
            return cptMatchedEncounters.Where(x =>
                    x.Claim.CptCode.Id == claimEncounter.CptCode.Id
                    && x.Claim.Id != claimEncounter.Id).AsQueryable();
        }

        private int? AggregateCodes(IEnumerable<ClaimsDataMaster> redundantCodes)
        {
            return redundantCodes.Select(x => x.Claim.Minutes).Sum();
        }

        private void GenerateClaimsEncounterWithServiceUnitRule(ClaimsDataMaster claimDataMaster, ClaimsStudent student, List<ClaimsEncounter> claimsEncountersToAdd, int minutes)
        {
            var serviceUnitRule = claimDataMaster.Claim.ServiceUnitRule;
            var isReplacement = serviceUnitRule.HasReplacement && serviceUnitRule.CptCodeId.HasValue && !serviceUnitRule.Archived;
            var encounterSegments = claimDataMaster.Claim.ServiceUnitTimeSegments?
                                        .Where(timeSegment => minutes >= timeSegment.StartMinutes && !timeSegment.IsCrossover)
                                        .OrderByDescending(segment => segment.EndMinutes)
                                        .OrderBy(segment => segment.EndMinutes != null);

            var crossoverSegments = claimDataMaster.Claim.ServiceUnitTimeSegments?
                                        .Where(timeSegment => minutes >= timeSegment.StartMinutes && timeSegment.IsCrossover)
                                        .OrderByDescending(segment => segment.EndMinutes)
                                        .OrderBy(segment => segment.EndMinutes != null);

            if (crossoverSegments.Any())
            {
                // add a billing unit for every 30 minutes over the max time
                var lastSegment = crossoverSegments.FirstOrDefault();
                var extraBilling = 0;
                if (lastSegment.EndMinutes != null)
                {
                    var extraMins = minutes - lastSegment.EndMinutes;
                    var extraPerHalfHour = (double)extraMins / 30;
                    var billedUnits = Math.Ceiling(extraPerHalfHour);
                    extraBilling = billedUnits > 0 ? (int)billedUnits - 1 : 0;
                }
                var crossoverCPTCode = claimDataMaster.Claim.CrossoverCptCode;
                if (isReplacement)
                {
                    // replace cpt code encounter segments with crossover cpt code
                    var billingUnits = CommonFunctions.GetBillingUnits(crossoverSegments, minutes) + extraBilling;
                    var replacementClaim = new ClaimsEncounter
                    {
                        ClaimAmount = CommonFunctions.TrimStringValue(18, (crossoverCPTCode.BillAmount * billingUnits).ToString()),
                        ProcedureIdentifier = CommonFunctions.TrimStringValue(50, crossoverCPTCode.Code),
                        BillingUnits = CommonFunctions.TrimStringValue(15, billingUnits.ToString()),
                        ServiceDate = claimDataMaster.EncounterDate,
                        IsTelehealth = claimDataMaster.IsTelehealth,
                        ClaimsStudent = student,
                        EncounterStudentId = claimDataMaster.EncounterStudentId,
                        EncounterStudentCptCodeId = claimDataMaster.Claim.Id,
                    };
                    FillClaimInfoForCaseLoad(claimDataMaster, replacementClaim);
                    claimsEncountersToAdd.Add(replacementClaim);
                }
                else
                {
                    // Crossover CPT code is not replacement, add both CPT code and crossover CPT code to billing
                    var newClaim = new ClaimsEncounter
                    {
                        ClaimAmount = CommonFunctions.TrimStringValue(18, (claimDataMaster.Claim.CptCode.BillAmount * CommonFunctions.GetBillingUnits(encounterSegments, minutes)).ToString()),
                        ProcedureIdentifier = CommonFunctions.TrimStringValue(50, claimDataMaster.Claim.CptCode.Code),
                        BillingUnits = CommonFunctions.TrimStringValue(15, CommonFunctions.GetBillingUnits(encounterSegments, minutes).ToString()),
                        ServiceDate = claimDataMaster.EncounterDate,
                        IsTelehealth = claimDataMaster.IsTelehealth,
                        ClaimsStudent = student,
                        EncounterStudentId = claimDataMaster.EncounterStudentId,
                        EncounterStudentCptCodeId = claimDataMaster.Claim.Id,
                    };
                    FillClaimInfoForCaseLoad(claimDataMaster, newClaim);
                    claimsEncountersToAdd.Add(newClaim);

                    var crossoverBillingUnits = CommonFunctions.GetBillingUnits(crossoverSegments, minutes) + extraBilling;
                    var newCrossoverClaim = new ClaimsEncounter
                    {
                        ClaimAmount = CommonFunctions.TrimStringValue(18, (crossoverCPTCode.BillAmount * crossoverBillingUnits).ToString()),
                        ProcedureIdentifier = CommonFunctions.TrimStringValue(50, crossoverCPTCode.Code),
                        BillingUnits = CommonFunctions.TrimStringValue(15, crossoverBillingUnits.ToString()),
                        ServiceDate = claimDataMaster.EncounterDate,
                        IsTelehealth = claimDataMaster.IsTelehealth,
                        ClaimsStudent = student,
                        EncounterStudentId = claimDataMaster.EncounterStudentId,
                        EncounterStudentCptCodeId = claimDataMaster.Claim.Id,
                    };
                    FillClaimInfoForCaseLoad(claimDataMaster, newCrossoverClaim);
                    claimsEncountersToAdd.Add(newCrossoverClaim);
                }
            }
            else if (encounterSegments.Any())
            {
                var newClaim = new ClaimsEncounter
                {
                    ClaimAmount = CommonFunctions.TrimStringValue(18, (claimDataMaster.Claim.CptCode.BillAmount * CommonFunctions.GetBillingUnits(encounterSegments, minutes)).ToString()),
                    ProcedureIdentifier = CommonFunctions.TrimStringValue(50, claimDataMaster.Claim.CptCode.Code),
                    BillingUnits = CommonFunctions.TrimStringValue(15, CommonFunctions.GetBillingUnits(encounterSegments, minutes).ToString()),
                    ServiceDate = claimDataMaster.EncounterDate,
                    IsTelehealth = claimDataMaster.IsTelehealth,
                    ClaimsStudent = student,
                    EncounterStudentId = claimDataMaster.EncounterStudentId,
                    EncounterStudentCptCodeId = claimDataMaster.Claim.Id,
                };
                FillClaimInfoForCaseLoad(claimDataMaster, newClaim);
                claimsEncountersToAdd.Add(newClaim);
            }
        }

        private void GenerateClaimsEncounterWithoutServiceUnitRule(ClaimsDataMaster claimDataMaster, ClaimsStudent student, List<ClaimsEncounter> claimsEncountersToAdd, int? aggregateId)
        {
            var newClaim = new ClaimsEncounter
            {
                ClaimAmount = CommonFunctions.TrimStringValue(18, claimDataMaster.Claim.CptCode.BillAmount.ToString()),
                ProcedureIdentifier = CommonFunctions.TrimStringValue(50, claimDataMaster.Claim.CptCode.Code),
                BillingUnits = "1",
                ServiceDate = claimDataMaster.EncounterDate,
                IsTelehealth = claimDataMaster.IsTelehealth,
                ClaimsStudent = aggregateId > 0 ? null : student,
                EncounterStudentId = claimDataMaster.EncounterStudentId,
                AggregateId = aggregateId,
                EncounterStudentCptCodeId = claimDataMaster.Claim.Id,
            };
            FillClaimInfoForCaseLoad(claimDataMaster, newClaim);
            claimsEncountersToAdd.Add(newClaim);
        }

        private void FillClaimInfoForCaseLoad(ClaimsDataMaster claimDataMaster, ClaimsEncounter claim)
        {
            if (claimDataMaster.IsTreatment)
            {
                claim.PhysicianFirstName = CommonFunctions.TrimStringValue(35, claimDataMaster.Scripts?.OrderByDescending(script => script.ScriptId)?.FirstOrDefault(script => script.DiagnosisCode == claimDataMaster.CaseLoadDiagnosisCode)?.DoctorFirstName);
                claim.PhysicianLastName = CommonFunctions.TrimStringValue(60, claimDataMaster.Scripts?.OrderByDescending(script => script.ScriptId)?.FirstOrDefault(script => script.DiagnosisCode == claimDataMaster.CaseLoadDiagnosisCode)?.DoctorLastName);
                claim.PhysicianId = CommonFunctions.TrimStringValue(80, claimDataMaster.Scripts?.OrderByDescending(script => script.ScriptId)?.FirstOrDefault(script => script.DiagnosisCode == claimDataMaster.CaseLoadDiagnosisCode)?.Npi ?? null);
                claim.ReferringProviderFirstName = CommonFunctions.TrimStringValue(35, claimDataMaster.Scripts.Any() ? "" : claimDataMaster.ProviderFirstName);
                claim.ReferringProviderLastName = CommonFunctions.TrimStringValue(60, claimDataMaster.Scripts.Any() ? "" : claimDataMaster.ProviderLastName);
                claim.ReasonForServiceCode = CommonFunctions.TrimStringValue(50, claimDataMaster.CaseLoadDiagnosisCode).Replace(".", "");
                claim.ReferringProviderId = CommonFunctions.TrimStringValue(80, claimDataMaster.Scripts.Any() ? "" : claimDataMaster.ProviderNPI);
            }
            else
            {
                claim.PhysicianId = null;
                claim.ReferringProviderFirstName = claimDataMaster.ProviderFirstName;
                claim.ReferringProviderLastName = claimDataMaster.ProviderLastName;
                claim.ReasonForServiceCode = CommonFunctions.TrimStringValue(50, claimDataMaster.EncounterDiagnosisCode).Replace(".", "");
                claim.ReferringProviderId = claimDataMaster.ProviderNPI;
            }
            claim.ControlNumberPrefix = _serviceCodePrefix[claimDataMaster.ServiceCodeId];
        }

    }
}
