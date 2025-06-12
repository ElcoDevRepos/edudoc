using FluentValidation;
using Model;
using Model.DTOs;
using Model.Enums;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.Students.Merge
{
    public class MergeStudentsService : BaseService, IMergeStudentsService
    {

        public MergeStudentsService(IPrimaryContext context) : base(context)
        {
        }

        /// <summary>
        /// Takes a MergeDTO and assigns the property values to the associated student record.
        /// </summary>
        /// <param name="mergeDTO"></param>
        ///
        public void MergeStudent(MergeDTO mergeDTO)
        {
            if (!mergeDTO.StudentIds.Any())
                return;

            // Check if any IEPServices reference the students being removed
            var ieServicesReferencingStudents = Context.IepServices
                .Where(iep => mergeDTO.StudentIds.Contains(iep.StudentId))
                .ToList();

            // Remove IEPServices referencing the students
            Context.IepServices.RemoveRange(ieServicesReferencingStudents);

            // Retrieve the student being merged into (the target student)
            var studentToUpdate = Context.Students
                .Include(s => s.CaseLoads)
                .Include(s => s.CaseLoads.Select(c => c.CaseLoadCptCodes))
                .Include(s => s.CaseLoads.Select(c => c.CaseLoadGoals))
                .Include(s => s.CaseLoads.Select(c => c.CaseLoadMethods))
                .Include(s => s.CaseLoads.Select(c => c.CaseLoadScripts))
                .FirstOrDefault(s => s.Id == mergeDTO.MergingIntoStudentId);

            var studentToUpdateCaseloads = studentToUpdate.CaseLoads.ToList();

            var caseloadsToRemove = new List<CaseLoad>();
            var codesToRemove = new List<CaseLoadCptCode>();
            var goalsToRemove = new List<CaseLoadGoal>();
            var methodsToRemove = new List<CaseLoadMethod>();

            // Iterate over each student ID to be merged
            foreach (var studentId in mergeDTO.StudentIds)
            {
                // Retrieve the student being merged (the source student)
                var studentToMerge = Context.Students
                    .Include(s => s.CaseLoads)
                    .Include(s => s.CaseLoads.Select(c => c.CaseLoadCptCodes))
                    .Include(s => s.CaseLoads.Select(c => c.CaseLoadGoals))
                    .Include(s => s.CaseLoads.Select(c => c.CaseLoadMethods))
                    .Include(s => s.CaseLoads.Select(c => c.CaseLoadScripts))
                    .Include(s => s.EncounterStudents)
                    .Include(s => s.StudentParentalConsents)
                    .FirstOrDefault(s => s.Id == studentId);

                if (studentToMerge == null) { continue; }

                // Grab all caseloads from students that are merging into the main student
                // things to update: studenttherapies, caseload goals, methods, scripts and encounterstudent
                var caseLoadsToMerge = studentToMerge.CaseLoads.ToList();
                var encounterStudentsToMerge = studentToMerge.EncounterStudents.ToList();
                var parentalConsentsToMerge = studentToMerge.StudentParentalConsents.ToList();

                foreach (var caseLoad in caseLoadsToMerge)
                {
                    var matchingCaseload = studentToUpdateCaseloads
                        .FirstOrDefault(cl => cl.StudentId == studentToUpdate.Id && !cl.Archived
                            && cl.ServiceCodeId == caseLoad.ServiceCodeId && cl.StudentTypeId == caseLoad.StudentTypeId);

                    if (matchingCaseload != null)
                    {
                        var existingCodes = matchingCaseload.CaseLoadCptCodes?.Select(cc => cc.CptCodeId).ToList();
                        Context.CaseLoadCptCodes.Where(cc => cc.CaseLoadId == caseLoad.Id && !existingCodes.Contains(cc.CptCodeId))
                            .ToList()
                            .ForEach(code =>
                            {
                                code.CaseLoadId = matchingCaseload.Id;
                                code.DateModified = DateTime.UtcNow;
                            });
                        var duplicateCodes = Context.CaseLoadCptCodes.Where(cc => cc.CaseLoadId == caseLoad.Id &&
                            existingCodes.Contains(cc.CptCodeId)).ToList();
                        codesToRemove.AddRange(duplicateCodes);

                        var existingGoals = matchingCaseload.CaseLoadGoals?.Select(g => g.GoalId).ToList();
                        Context.CaseLoadGoals.Where(g => g.CaseLoadId == caseLoad.Id && !existingGoals.Contains(g.GoalId))
                            .ToList()
                            .ForEach(goal =>
                            {
                                goal.CaseLoadId = matchingCaseload.Id;
                                goal.DateModified = DateTime.UtcNow;
                            });
                        var duplicateGoals = Context.CaseLoadGoals.Where(g => g.CaseLoadId == caseLoad.Id
                            && existingGoals.Contains(g.GoalId)).ToList();
                        goalsToRemove.AddRange(duplicateGoals);

                        var existingMethods = matchingCaseload.CaseLoadMethods?.Select(g => g.MethodId).ToList();
                        Context.CaseLoadMethods.Where(g => g.CaseLoadId == caseLoad.Id && !existingMethods.Contains(g.MethodId))
                            .ToList()
                            .ForEach(method =>
                            {
                                method.CaseLoadId = matchingCaseload.Id;
                                method.DateModified = DateTime.UtcNow;
                            });
                        var duplicateMethods = Context.CaseLoadMethods.Where(g => g.CaseLoadId == caseLoad.Id
                            && existingMethods.Contains(g.MethodId)).ToList();
                        methodsToRemove.AddRange(duplicateMethods);

                        // Update CaseLoadScripts caseload Id
                        Context.CaseLoadScripts
                            .Where(cls => cls.CaseLoadId == caseLoad.Id)
                            .ToList()
                            .ForEach(cls=> { cls.CaseLoadId = matchingCaseload.Id; cls.DateModified = DateTime.UtcNow; });

                        // Update StudentTherapies caseload Id
                        Context.StudentTherapies
                            .Where(st => st.CaseLoadId == caseLoad.Id && !matchingCaseload.StudentTherapies.Any(s => s.Id == st.Id))
                            .ToList()
                            .ForEach(st =>
                            {
                                st.CaseLoadId = matchingCaseload.Id;
                                st.DateModified = DateTime.UtcNow;
                            });

                        // Update EncounterStudents's old caseload id to matching caseload
                        encounterStudentsToMerge.Where(es => es.CaseLoadId == caseLoad.Id)
                            .ToList()
                            .ForEach(es =>
                            {
                                es.CaseLoadId = matchingCaseload.Id;
                                es.StudentId = studentToUpdate.Id;
                                es.DateModified = DateTime.UtcNow;
                            });

                        matchingCaseload.IepStartDate = null;
                        matchingCaseload.IepEndDate = null;
                        matchingCaseload.DateModified = DateTime.UtcNow;

                        caseloadsToRemove.Add(caseLoad);
                    }
                    else
                    {
                        Context.CaseLoads.Where(cl => cl.Id == caseLoad.Id).ToList()
                            .ForEach(cl => { cl.StudentId = studentToUpdate.Id; cl.DateModified = DateTime.UtcNow; });

                        encounterStudentsToMerge.Where(es => es.CaseLoadId == caseLoad.Id)
                            .ToList().ForEach(es => { es.StudentId = studentToUpdate.Id; es.DateModified = DateTime.UtcNow; });

                        studentToUpdateCaseloads.Add(caseLoad);
                    }
                }

                // Update rest of encounter students that have not been reassigned yet
                encounterStudentsToMerge.Where(es => es.StudentId == studentId)
                    .ToList().ForEach(es => { es.StudentId = studentToUpdate.Id; es.DateModified = DateTime.UtcNow; });

                studentToUpdate.AddressId = studentToUpdate.AddressId == null && studentToMerge.AddressId != null ?
                    studentToMerge.AddressId : studentToUpdate.AddressId;

                // Fetch and group sign-offs as before
                var mostRecentSignOffs = Context.SupervisorProviderStudentReferalSignOffs
                    .Where(signOff => signOff.StudentId == studentId)
                    .AsEnumerable() // Consider AsEnumerable() if you're manipulating data in-memory after this point
                    .GroupBy(signOff => signOff.SupervisorId)
                    .Select(group => group.OrderByDescending(signOff => signOff.EffectiveDateFrom).FirstOrDefault())
                    .ToList();

                // Now, iterate over these sign-offs to update them
                mostRecentSignOffs.ForEach(signOff =>
                {
                    if (signOff != null) // Ensure the signOff is not null
                    {
                        signOff.StudentId = studentToUpdate.Id;
                        signOff.DateModified = DateTime.UtcNow;
                    }
                });
            }

            // Point existing supervisors to new student id
            Context.ProviderStudentSupervisors.Where(pss => mergeDTO.StudentIds.Contains((int)pss.StudentId))
                .ToList()
                .ForEach(pss => { pss.StudentId = studentToUpdate.Id; pss.DateModified = DateTime.UtcNow; });

            // Point existing Provider Caseloads to new student id
            Context.ProviderStudents.Where(ps => mergeDTO.StudentIds.Contains((int)ps.StudentId))
                .ToList()
                .ForEach(ps => { ps.StudentId = studentToUpdate.Id; });

            // Point existing merged students to new student id
            Context.MergedStudents.Where(ms => mergeDTO.StudentIds.Contains(ms.MergedToStudentId))
                .ToList()
                .ForEach(ms => ms.MergedToStudentId = studentToUpdate.Id);

            // Point existing RosterValidationStudent to new student id
            Context.RosterValidationStudents.Where(rv => mergeDTO.StudentIds.Contains(rv.StudentId))
                .ToList()
                .ForEach(rv => rv.StudentId = studentToUpdate.Id);

            // Point existing school district rosters to new student id
            Context.SchoolDistrictRosters.Where(sdr => mergeDTO.StudentIds.Contains((int)sdr.StudentId))
                .ToList()
                .ForEach(sdr => { sdr.StudentId = studentToUpdate.Id; sdr.HasDuplicates = false; sdr.DateModified = DateTime.UtcNow; });

            // Point existing school district withdrawals to new student id
            Context.StudentDistrictWithdrawals.Where(sdw => mergeDTO.StudentIds.Contains((int)sdw.StudentId))
                .ToList()
                .ForEach(sdw => { sdw.StudentId = studentToUpdate.Id; sdw.DateModified = DateTime.UtcNow; });

            // Point existing provider case upload to new student id
            Context.ProviderCaseUploads.Where(pcu => mergeDTO.StudentIds.Contains((int)pcu.StudentId))
                .ToList()
                .ForEach(pcu => { pcu.StudentId = studentToUpdate.Id; pcu.DateModified = DateTime.UtcNow; });

            Context.ClaimsStudents.Where(cs => mergeDTO.StudentIds.Contains(cs.StudentId))
                .ToList()
                .ForEach(cs => cs.StudentId = studentToUpdate.Id);

            Context.PendingReferrals.Where(pr => mergeDTO.StudentIds.Contains(pr.StudentId))
                .ToList()
                .ForEach(pr => pr.StudentId = studentToUpdate.Id);

            Context.ProviderStudentHistories.Where(psh => mergeDTO.StudentIds.Contains(psh.StudentId))
                .ToList()
                .ForEach(psh => psh.StudentId = studentToUpdate.Id);

            Context.ProgressReports.Where(psh => mergeDTO.StudentIds.Contains(psh.StudentId))
                .ToList()
                .ForEach(psh => psh.StudentId = studentToUpdate.Id);

            Context.StudentDisabilityCodes.Where(sdc => mergeDTO.StudentIds.Contains(sdc.StudentId))
                .ToList()
                .ForEach(sdc => sdc.StudentId = studentToUpdate.Id);

            Context.CaseLoadCptCodes.RemoveRange(codesToRemove);
            Context.CaseLoadGoals.RemoveRange(goalsToRemove);
            Context.CaseLoadMethods.RemoveRange(methodsToRemove);
            Context.CaseLoads.RemoveRange(caseloadsToRemove);

            // Update parental consents
            Context.StudentParentalConsents.Where(spc => mergeDTO.StudentIds.Contains(spc.StudentId))
                .ToList()
                .ForEach(spc => spc.StudentId = studentToUpdate.Id);

            // Add old students to MergedStudents Table
            var oldStudents = Context.Students
                .Where(s => mergeDTO.StudentIds.Contains(s.Id))
                .ToList();

            var mergedStudent = MapStudentsToMergedStudent(oldStudents.ToList(), studentToUpdate.Id);
            Context.MergedStudents.AddRange(mergedStudent);

            // Remove old students from the Students table
            Context.Students.RemoveRange(oldStudents);

            // Save changes to the database
            Context.SaveChanges();
        }


        private List<MergedStudent> MapStudentsToMergedStudent(List<Student> students, int studentId)
        {
            var mergedStudents = new List<MergedStudent>();
            foreach (var student in students)
            {
                mergedStudents.Add(new MergedStudent
                {
                    FirstName = student.FirstName,
                    MiddleName = student.MiddleName,
                    LastName = student.LastName,
                    StudentCode = student.StudentCode ?? "",
                    Grade = student.Grade ?? "",
                    DateOfBirth = student.DateOfBirth,
                    AddressId = student.AddressId,
                    SchoolId = student.SchoolId,
                    MergedToStudentId = studentId,
                });
            }
            return mergedStudents;
        }

    }
}
