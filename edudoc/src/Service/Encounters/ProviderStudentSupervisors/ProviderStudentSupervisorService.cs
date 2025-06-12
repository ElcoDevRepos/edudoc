using Model;
using System.Linq;
using System.Data.Entity;
using System;
using Service.Utilities;

namespace Service.Encounters.ProviderStudentSupervisors
{
    public class ProviderStudentSupervisorService : BaseService, IProviderStudentSupervisorService
    {
        public ProviderStudentSupervisorService(
            IPrimaryContext context
            ) : base(context)
        {
        }

        public ProviderStudentSupervisor AssignSupervisor(ProviderStudentSupervisor supervisor, int userId)
        {
            ThrowIfNull(supervisor);
            ValidateAndThrow(supervisor, new ProviderStudentSupervisorValidator(Context));

            supervisor.CreatedById = userId;
            supervisor.DateCreated = DateTime.UtcNow;

            var student = Context.Students
                                    .Include("SupervisorProviderStudentReferalSignOffs")
                                    .Include("CaseLoads")
                                    .Include("CaseLoads.StudentType")
                                    .Include("CaseLoads.ServiceCode")
                                    .FirstOrDefault((student) => student.Id == supervisor.StudentId);

            var provider = Context.Users
                .Include(user => user.Providers_ProviderUserId)
                .Include(user => user.Providers_ProviderUserId.Select(provider => provider.ProviderTitle))
                .FirstOrDefault(user => user.Id == userId).Providers_ProviderUserId.FirstOrDefault();

            var providerServiceAreaId = provider.ProviderTitle.ServiceCodeId;

            var today = DateTime.Now;
            var needsReferral =  provider.VerifiedOrp && provider.OrpApprovalDate != null ?
                !student.SupervisorProviderStudentReferalSignOffs.Any(referral =>    
                    (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                    referral.EffectiveDateFrom.HasValue &&
                    referral.EffectiveDateFrom.Value >= ((DateTime)provider.OrpApprovalDate).AddYears(-1) &&
                    referral.ServiceCodeId == providerServiceAreaId) &&
                student.CaseLoads.Any(caseLoad => caseLoad.StudentType.IsBillable && caseLoad.ServiceCode.NeedsReferral && !caseLoad.Archived)
                : false;

            if (needsReferral)
            {
                var existingUnsignedReferrals = student.SupervisorProviderStudentReferalSignOffs.Where(referral => referral.SignedOffById == null && referral.ServiceCodeId == providerServiceAreaId);
                Context.SupervisorProviderStudentReferalSignOffs.RemoveRange(existingUnsignedReferrals);

                Context.SupervisorProviderStudentReferalSignOffs.Add(new SupervisorProviderStudentReferalSignOff()
                {
                    CreatedById = userId,
                    DateCreated = DateTime.UtcNow,
                    SupervisorId = supervisor.SupervisorId,
                    StudentId = supervisor.StudentId,
                    ServiceCodeId = providerServiceAreaId,
                });
            }



            Context.ProviderStudentSupervisors.Add(supervisor);

            Context.SaveChanges();

            return Context.ProviderStudentSupervisors
                            .Include("Supervisor")
                            .Include("Supervisor.ProviderUser")
                            .FirstOrDefault(x => x.Id == supervisor.Id);

        }

        public ProviderStudentSupervisor AssignAssistant(ProviderStudentSupervisor assistant, int userId)
        {
            ThrowIfNull(assistant);
            ValidateAndThrow(assistant, new ProviderStudentSupervisorValidator(Context));

            assistant.CreatedById = userId;
            assistant.DateCreated = DateTime.UtcNow;

            Context.ProviderStudentSupervisors.Add(assistant);

            Context.SaveChanges();
            return Context.ProviderStudentSupervisors
                            .Include("Supervisor")
                            .Include("Supervisor.ProviderUser")
                            .Include("Assistant")
                            .Include("Assistant.ProviderUser")
                            .FirstOrDefault(x => x.Id == assistant.Id);

        }

        public ProviderStudentSupervisor UnassignProviderStudentSupervisor(int id, int userId)
        {
            var existingAssignment = Context.ProviderStudentSupervisors
                            .Include("Supervisor")
                            .Include("Supervisor.ProviderUser")
                            .Include("Assistant")
                            .Include("Assistant.ProviderUser")
                            .FirstOrDefault(s => s.Id == id);
            if (existingAssignment != null)
            {
                existingAssignment.EffectiveEndDate = DateTime.UtcNow;
                existingAssignment.ModifiedById = userId;
                existingAssignment.DateModified = DateTime.UtcNow;
            }

            Context.SaveChanges();

            return existingAssignment;
        }

        public ProviderStudentSupervisor UpdateProviderStudentSupervisor(ProviderStudentSupervisor pss, int userId)
        {
            var existingAssignment = Context.ProviderStudentSupervisors.FirstOrDefault(s => s.Id == pss.Id);
            ThrowIfNull(existingAssignment);

            Context.Entry(existingAssignment).CurrentValues.SetValues(pss);
            Context.SaveChanges();
            return existingAssignment;
        }
    }
}
