using Model;
using System.Linq;
using System.Data.Entity;
using System.Collections.Generic;
using Model.Enums;
using System;

namespace Service.CaseLoads
{
    public class CaseLoadService : BaseService, ICaseLoadService
    {
        public CaseLoadService(IPrimaryContext context) : base(context)
        {
        }

        /// <summary>
        /// Gets the list of case loads for a student based on the logged in provider and selected student
        /// </summary>
        /// <param name="studentId"></param>
        /// <param name="userId">Used for security measure</param>
        /// <returns></returns>
        public List<CaseLoad> GetCaseLoadsByStudentId(int studentId, int userId)
        {
            var user = Context.Users
                        .Include(user => user.Providers_ProviderUserId)
                        .Include(user => user.Providers_ProviderUserId.Select(provider => provider.ProviderTitle))
                        .Include(user => user.AuthUser)
                        .Include(user => user.AuthUser.UserRole)
                        .FirstOrDefault(user => user.Id == userId);


            int providerServiceAreaId = 0;

            if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.Provider)
                providerServiceAreaId = user.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.ServiceCodeId;

            return Context.CaseLoads
                        .Include(y => y.CaseLoadMethods.Select(z => z.Method))
                        .Include(y => y.CaseLoadGoals.Select(z => z.Goal))
                        .Include(y => y.CaseLoadCptCodes.Select(z => z.CptCode))
                        .Include(y => y.CaseLoadCptCodes.Select(z => z.CptCode.CptCodeAssocations))
                        .Include(y => y.CaseLoadScripts)
                        .Include(y => y.CaseLoadScripts.Select(z => z.CaseLoadScriptGoals))
                        .Include(y => y.Student)
                        .Include(y => y.StudentType)
                        .Where(x => x.StudentId == studentId &&
                                    !x.Archived &&
                                    x.ServiceCodeId == providerServiceAreaId
                                )
                        .OrderByDescending(x => x.Id)
                        .ToList();
        }

        /// <summary>
        /// Gets the list of case loads for a student based on the logged in provider and selected StudentTherapySchedule
        /// </summary>
        /// <param name="therapyScheduleId"></param>
        /// <param name="userId">Used for security measure</param>
        /// <returns></returns>
        public CaseLoad GetCaseLoadByTherapyScheduleId(int therapyScheduleId, int userId)
        {
            return Context.CaseLoads
                    .Include(y => y.CaseLoadMethods.Select(z => z.Method))
                    .Include(y => y.CaseLoadGoals.Select(z => z.Goal))
                    .Include(y => y.CaseLoadCptCodes.Select(z => z.CptCode))
                    .Include(y => y.CaseLoadCptCodes.Select(z => z.CptCode.CptCodeAssocations))
                    .Include(y => y.CaseLoadScripts)
                    .Include(y => y.CaseLoadScripts.Select(z => z.CaseLoadScriptGoals))
                    .Include(y => y.StudentType)
                    .Where(x => x.StudentTherapies.Any(st => st.StudentTherapySchedules.Any(s => s.Id == therapyScheduleId) && st.Provider.ProviderUserId == userId))
                    .OrderByDescending(x => x.Id)
                    .FirstOrDefault();
        }

        public int RemoveStudentFromCaseload(int studentId, int userId)
        {
            // Define the statuses to remove if not e-signed
            var statusesToRemove = new List<int>
            {
                (int)EncounterStatuses.New,
                (int)EncounterStatuses.OPEN_ENCOUNTER_READY_FOR_YOU,
                (int)EncounterStatuses.PENDING_TREATMENT_THERAPY,
                (int)EncounterStatuses.PENDING_EVALUATION_ASSESSMENT,
                (int)EncounterStatuses.NON_IEP,
                (int)EncounterStatuses.NON_MSP_SERVICE
            };

            // Get all pending encounters that are not e-signed and are in the specified statuses
            var encounterStudentsToDelete = Context.Students
                .Where(s => s.Id == studentId)
                .SelectMany(s => s.EncounterStudents
                    .Where(es => es.ESignedById == null
                        && es.StudentId == studentId
                        && es.Encounter.Provider.ProviderUserId == userId
                        && statusesToRemove.Contains(es.EncounterStatusId)))
                .ToList();

            var esIds = encounterStudentsToDelete.Select(es => es.Id).ToList();

            // Remove records from BillingFailures for encounters in the specified statuses
            var billingFailuresToDelete = Context.BillingFailures
                .Where(bf => esIds.Contains(bf.EncounterStudentId))
                .ToList();
            Context.BillingFailures.RemoveRange(billingFailuresToDelete);

            // Remove related data from dependent tables
            var encounterStudentsCptCodes = Context.EncounterStudentCptCodes.Where(cc => esIds.Contains(cc.EncounterStudentId));
            Context.EncounterStudentCptCodes.RemoveRange(encounterStudentsCptCodes);

            var encounterStudentsGoals = Context.EncounterStudentGoals.Where(g => esIds.Contains(g.EncounterStudentId));
            Context.EncounterStudentGoals.RemoveRange(encounterStudentsGoals);

            var encounterStudentMethods = Context.EncounterStudentMethods.Where(m => esIds.Contains(m.EncounterStudentId));
            Context.EncounterStudentMethods.RemoveRange(encounterStudentMethods);

            var encounterStudentStatus = Context.EncounterStudentStatus.Where(ess => esIds.Contains(ess.EncounterStudentId));
            Context.EncounterStudentStatus.RemoveRange(encounterStudentStatus);

            Context.EncounterStudents.RemoveRange(encounterStudentsToDelete);

            // Update or remove StudentTherapies and related schedules
            var studentTherapies = Context.StudentTherapies
                .Where(st => st.Provider.ProviderUserId == userId && st.CaseLoad.StudentId == studentId);
            var studentTherapyIds = studentTherapies.Select(st => st.Id).ToList();
            var studentTherapySchedules = Context.StudentTherapySchedules.Where(sts => studentTherapyIds.Contains(sts.StudentTherapyId));
            var studentTherapyScheduleIds = studentTherapySchedules.Select(sts => sts.Id).ToList();
            var relatedEncounterStudents = Context.EncounterStudents.Where(es => studentTherapyScheduleIds.Contains(es.StudentTherapyScheduleId.Value));

            foreach (var encounterStudent in relatedEncounterStudents)
            {
                encounterStudent.StudentTherapyScheduleId = null;
                encounterStudent.StudentTherapySchedule = null;
            }

            Context.StudentTherapySchedules.RemoveRange(studentTherapySchedules);
            Context.StudentTherapies.RemoveRange(studentTherapies);

            // Remove encounters that are not e-signed and match the statuses
            var encounters = Context.Encounters
                .Where(e => e.Provider.ProviderUserId == userId
                    && e.EncounterStudents.Count > 0
                    && e.EncounterStudents.All(es => esIds.Contains(es.Id))
                    && e.EncounterStudents.All(es => es.ESignedById == null));
            Context.Encounters.RemoveRange(encounters);

            // Remove the student from the provider's caseload if they exist
            var providerStudent = Context.ProviderStudents
                .FirstOrDefault(ps => ps.StudentId == studentId && ps.Provider.ProviderUserId == userId);

            if (providerStudent != null)
            {
                Context.ProviderStudents.Remove(providerStudent);
                Context.ProviderStudentHistories.Add(new ProviderStudentHistory()
                {
                    StudentId = providerStudent.StudentId,
                    ProviderId = providerStudent.ProviderId,
                    DateArchived = DateTime.Now
                });
            }

            return Context.SaveChanges();
        }
    }
}
