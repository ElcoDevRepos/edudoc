using FluentValidation;
using Model;
using Model.DTOs;
using Model.Enums;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.Encounters
{
    public class EncounterStudentLibrary : BaseService, IEncounterStudentLibrary
    {
        private readonly IPrimaryContext _context;

        public EncounterStudentLibrary(
            IPrimaryContext context
            ) : base(context)
        {
            _context = context;
        }

        public void PrependZeros(EncounterStudent encounterStudent, int districtId)
        {
            if (districtId == 0)
            {
                int schoolId = _context.Students.FirstOrDefault(s => s.Id == encounterStudent.StudentId).SchoolId;
                if (schoolId > 1)
                {
                    districtId = _context.SchoolDistrictsSchools.FirstOrDefault(s => s.SchoolId == schoolId).SchoolDistrictId;
                }
            }
            var zero = new String('0', 3 - districtId.ToString().Length);
            encounterStudent.EncounterNumber = String.Concat(encounterStudent.EncounterNumber, zero, districtId.ToString());

            // Append date claim entered into system into Encounter Number
            encounterStudent.EncounterNumber = String.Concat(encounterStudent.EncounterNumber, DateTime.Now.ToString("MMddyy"));

            var id = encounterStudent.Id.ToString();
            var idString = id.Length > 4 ? id.Substring(id.Length - 4) : id;
            var zeroString = id.Length < 4 ? new String('0', (4 - encounterStudent.Id.ToString().Length)) : "";

            encounterStudent.EncounterNumber = String.Concat(encounterStudent.EncounterNumber, zeroString, idString);
        }

        public List<EncounterStudentCptCode> BuildCptCodesFromSchedule(StudentTherapySchedulesData schedule, StudentTherapyProviderData provider, int userId, List<CptCodeAssocation> associations, bool isGroup)
        {
            var newEncounterCptCodes = new List<EncounterStudentCptCode>();

            string providerTitle = provider.ProviderTitleName.ToLower();
            bool isLpn = providerTitle.Contains("lpn") || providerTitle.Contains("licensed practical nurse");
            bool isRn = providerTitle.Contains("rn") || providerTitle.Contains("registered nurse");

            foreach (var code in schedule.CptCodes)
            {
                if (!code.Archived && associations.Any(association => association.CptCodeId == code.CptCodeId && association.IsGroup == isGroup))
                {
                    newEncounterCptCodes.Add(
                        new EncounterStudentCptCode
                        {
                            CptCodeId = code.CptCodeId,
                            CreatedById = userId,
                            DateCreated = DateTime.UtcNow,
                        }
                    );
                }
            }

            if (isLpn || isRn)
            {
                var defaultAssociations = associations.Where(association =>
                    !newEncounterCptCodes.Any(cptCode => cptCode.CptCodeId == association.CptCodeId) &&
                        (
                            (isLpn && association.CptCode.LpnDefault) ||
                            (isRn && association.CptCode.RnDefault)
                        ));

                foreach (var association in defaultAssociations)
                {
                    newEncounterCptCodes.Add(
                        new EncounterStudentCptCode
                        {
                            CptCodeId = association.CptCodeId,
                            CreatedById = userId,
                            DateCreated = DateTime.UtcNow,
                        }
                    );
                }
            }

            // set default group cpt codes if group encounter
            if (isGroup)
            {
                var groupDefaultCptCodes = _context.CptCodeAssocations
                    .Where(association =>
                        association.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy &&
                        !association.Archived && association.Default &&
                        association.ServiceCodeId == provider.ServiceCodeId &&
                        association.ProviderTitleId == provider.ProviderTitleId)
                    .GroupBy(c => c.CptCodeId);
                var x = groupDefaultCptCodes.ToList();
                foreach (var code in groupDefaultCptCodes)
                {
                    var codeId = code.FirstOrDefault().CptCodeId;
                    if (!newEncounterCptCodes.Any(cptCode => cptCode.CptCodeId == codeId))
                    {
                        newEncounterCptCodes.Add(
                            new EncounterStudentCptCode
                            {
                                CptCodeId = codeId,
                                CreatedById = userId,
                                DateCreated = DateTime.UtcNow,
                            }
                        );
                    }
                }
            }
            if(newEncounterCptCodes.Count == 1) {
                newEncounterCptCodes[0].Minutes = (int)(schedule.EndTime - schedule.StartTime).TotalMinutes;
            }
            return newEncounterCptCodes;
        }

        public List<EncounterStudentGoal> BuildGoalsFromSchedule(StudentTherapySchedulesData schedule, StudentTherapyProviderData provider, int userId)
        {
            var newEncounterGoals = new List<EncounterStudentGoal>();

            if (provider.ServiceCodeId == (int)ServiceCodes.Nursing)
            {
                Goal medicationGoal = _context.Goals.FirstOrDefault(g => g.Description == "Medication");
                List<CaseLoadScriptGoal> goals = GetCaseLoadScriptGoals(schedule.CaseloadId, (DateTime)schedule.ScheduleDate);

                foreach (var goal in goals)
                {
                    newEncounterGoals.Add(
                        new EncounterStudentGoal
                        {
                            GoalId = goal.GoalId,
                            CreatedById = userId,
                            DateCreated = DateTime.UtcNow,
                        }
                    );
                }
            }
            else
            {
                var caseLoadGoals = _context.CaseLoadGoals.Where(clg => clg.CaseLoadId == schedule.CaseloadId && !clg.Archived
                    && clg.Goal.ServiceCodes.Any(sc => sc.Id == provider.ServiceCodeId));
                foreach (var goal in caseLoadGoals)
                {
                    newEncounterGoals.Add(
                        new EncounterStudentGoal
                            {
                                GoalId = goal.GoalId,
                                CreatedById = userId,
                                DateCreated = DateTime.UtcNow,
                            });
                }
            }

            return newEncounterGoals;
        }

        public List<EncounterStudentMethod> BuildMethodsFromSchedule(StudentTherapySchedulesData schedule, int userId)
        {
            var newEncounterMethods = new List<EncounterStudentMethod>();

            foreach (var method in schedule.Methods.Where(clm => !clm.Archived))
            {
                newEncounterMethods.Add(
                    new EncounterStudentMethod
                    {
                        MethodId = method.MethodId,
                        CreatedById = userId,
                        DateCreated = DateTime.UtcNow,
                    }
                );
            }

            return newEncounterMethods;
        }

        public CaseLoad GetStudentCaseLoad(DateTime encounterDate, int studentId, int serviceCodeId)
        {
            var caseLoad  = _context.CaseLoads
                            .Include(caseLoad => caseLoad.StudentType)
                            .Include(caseLoad => caseLoad.Student)
                            .Include(caseLoad => caseLoad.Student.School)
                            .Include(caseLoad => caseLoad.Student.School.SchoolDistrictsSchools)
                            .Include(caseLoad => caseLoad.Student.School.SchoolDistrictsSchools.Select(sds => sds.SchoolDistrict))
                            .OrderByDescending(caseload => caseload.DateCreated)
                            .FirstOrDefault(cl =>   !cl.Archived &&
                                                    cl.StudentId == studentId &&
                                                    cl.ServiceCodeId == serviceCodeId
                                                    );

            return caseLoad;
        }

        public List<EncounterStudentCptCode> BuildCptCodesFromCaseLoad(CaseLoad caseload, int serviceTypeId, int providerId, bool isGroup, int userId)
        {
            var newEncounterCptCodes = new List<EncounterStudentCptCode>();
            var caseLoadCptCodes = _context.CaseLoadCptCodes.Where(clcc => clcc.CaseLoadId == caseload.Id && !clcc.Archived);
            var associations = _context.CptCodeAssocations.Include(association => association.CptCode).Where(association => association.ServiceTypeId == serviceTypeId && !association.Archived).ToList();

            var provider = _context.Providers.Include(provider => provider.ProviderTitle).FirstOrDefault(provider => provider.Id == providerId);
            var providerTitle = provider.ProviderTitle.Name.ToLower();
            var isLpn = providerTitle.Contains("lpn") || providerTitle.Contains("licensed practical nurse");
            var isRn = providerTitle.Contains("rn") || providerTitle.Contains("registered nurse");

            foreach (var code in caseLoadCptCodes)
            {
                if (associations.Any(association => association.CptCodeId == code.CptCodeId && (association.IsGroup == isGroup)))
                {
                    newEncounterCptCodes.Add(
                        new EncounterStudentCptCode
                        {
                            CptCodeId = code.CptCodeId,
                            CreatedById = userId,
                            DateCreated = DateTime.UtcNow,
                        }
                    );
                }
            }

            if (isLpn || isRn)
            {
                var defaultAssociations = associations.Where(association =>
                    !newEncounterCptCodes.Any(cptCode => cptCode.CptCodeId == association.CptCodeId) &&
                        (
                            (isLpn && association.CptCode.LpnDefault) ||
                            (isRn && association.CptCode.RnDefault)
                        ));

                foreach (var association in defaultAssociations)
                {
                    newEncounterCptCodes.Add(
                        new EncounterStudentCptCode
                        {
                            CptCodeId = association.CptCodeId,
                            CreatedById = userId,
                            DateCreated = DateTime.UtcNow,
                        }
                    );
                }
            }

            // set default group cpt codes if group encounter
            if (isGroup)
            {
                var groupDefaultCptCodes = _context.CptCodeAssocations
                    .Where(association =>
                        association.ServiceTypeId == serviceTypeId &&
                        !association.Archived && association.Default &&
                        association.ServiceCodeId == provider.ProviderTitle.ServiceCodeId &&
                        association.ProviderTitleId == provider.ProviderTitle.Id)
                    .GroupBy(c => c.CptCodeId);
                var x = groupDefaultCptCodes.ToList();
                foreach (var code in groupDefaultCptCodes)
                {
                    var codeId = code.FirstOrDefault().CptCodeId;
                    if (!newEncounterCptCodes.Any(cptCode => cptCode.CptCodeId == codeId))
                    {
                        newEncounterCptCodes.Add(
                            new EncounterStudentCptCode
                            {
                                CptCodeId = codeId,
                                CreatedById = userId,
                                DateCreated = DateTime.UtcNow,
                            }
                        );
                    }
                }
            }
            return newEncounterCptCodes;
        }

        public List<EncounterStudentGoal> BuildGoalsFromCaseLoad(CaseLoad caseload, DateTime encounterDate, int userId)
        {
            var newEncounterGoals = new List<EncounterStudentGoal>();
            var serviceCodeId = _context.Providers.Include(p => p.ProviderTitle)
                .Where(p => p.ProviderUserId == userId).Select(p => p.ProviderTitle.ServiceCodeId).FirstOrDefault();

            if (serviceCodeId == (int)ServiceCodes.Nursing)
            {
                var medicationGoal = _context.Goals.FirstOrDefault(g => g.Description == "Medication");
                var goals = GetCaseLoadScriptGoals(caseload.Id, encounterDate);
                foreach (var goal in goals)
                {
                    // Add Medication goal twice, otherwise only add other goals once
                    if ((medicationGoal != null && goal.GoalId == medicationGoal.Id) || newEncounterGoals.FirstOrDefault(eg => eg.GoalId == goal.GoalId) == null)
                    {
                        newEncounterGoals.Add(
                            new EncounterStudentGoal
                            {
                                GoalId = goal.GoalId,
                                CreatedById = userId,
                                DateCreated = DateTime.UtcNow,
                                CaseLoadScriptGoalId = goal.Id
                            }
                        );
                    }
                }
            }
            else
            {
                var caseLoadGoals = _context.CaseLoadGoals.Where(clg => clg.CaseLoadId == caseload.Id && !clg.Archived
                    && clg.Goal.ServiceCodes.Any(sc => sc.Id == serviceCodeId));

                foreach (var goal in caseLoadGoals)
                {
                    newEncounterGoals.Add(
                        new EncounterStudentGoal
                        {
                            GoalId = goal.GoalId,
                            CreatedById = userId,
                            DateCreated = DateTime.UtcNow,
                        }
                    );
                }
            }

            return newEncounterGoals;
        }

        private List<CaseLoadScriptGoal> GetCaseLoadScriptGoals(int caseLoadId, DateTime encounterDate)
        {
            return _context.CaseLoadScripts.Where((script) => !script.Archived && script.CaseLoadId == caseLoadId &&
                                (DbFunctions.TruncateTime(script.InitiationDate) <= DbFunctions.TruncateTime(encounterDate) || script.InitiationDate == null) &&
                                (DbFunctions.TruncateTime(script.ExpirationDate) >= DbFunctions.TruncateTime(encounterDate) || script.ExpirationDate == null))
                            .SelectMany((script) => script.CaseLoadScriptGoals)
                            .Where((clsg) => !clsg.Archived)
                            .Include(script => script.CaseLoadScript)
                            .ToList();
        }

        public List<EncounterStudentMethod> BuildMethodsFromCaseLoad(CaseLoad caseload, int userId)
        {
            var newEncounterMethods = new List<EncounterStudentMethod>();
            var caseLoadMethods = _context.CaseLoadMethods.Where(clm => clm.CaseLoadId == caseload.Id && !clm.Archived);

            foreach (var method in caseLoadMethods)
            {
                newEncounterMethods.Add(
                    new EncounterStudentMethod
                    {
                        MethodId = method.MethodId,
                        CreatedById = userId,
                        DateCreated = DateTime.UtcNow,
                    }
                );
            }

            return newEncounterMethods;
        }

        public int GetEncounterStudentStatus(CaseLoad caseLoad, Encounter encounter)
        {
            switch (encounter.ServiceTypeId)
            {
                case (int)ServiceTypes.Non_Billable:
                    return (int)EncounterStatuses.NON_MSP_SERVICE;
                case (int)ServiceTypes.Evaluation_Assessment:
                    {
                        if (caseLoad != null && !caseLoad.StudentType.IsBillable)
                        {
                            return (int)EncounterStatuses.NON_IEP;
                        }
                        else
                        {
                            return (int)EncounterStatuses.PENDING_EVALUATION_ASSESSMENT;
                        }
                    }
                case (int)ServiceTypes.Treatment_Therapy:
                    {
                        if (caseLoad != null && !caseLoad.StudentType.IsBillable)
                        {
                            return (int)EncounterStatuses.NON_IEP;
                        }
                        else
                        {
                            return (int)EncounterStatuses.PENDING_TREATMENT_THERAPY;
                        }
                    }
                default:
                    return (int)EncounterStatuses.New;
            }
        }

    }

}
