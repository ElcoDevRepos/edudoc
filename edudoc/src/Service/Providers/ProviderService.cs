using Service.Core.Utilities;
using Service.Core.Utilities;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using Model.DTOs;
using BreckServiceBase.Utilities.Interfaces;
using Service.Utilities;
using Microsoft.Extensions.Configuration;
using Model.Enums;
using System.Data.Entity.Migrations;
using FluentValidation;

namespace Service.Providers
{
    public class ProviderService : BaseService, IProviderService
    {
        private IEmailHelper _emailHelper;
        IConfigurationSettings _configurationSettings;
        IConfiguration _configuration;

        public ProviderService(
            IPrimaryContext context,
            IEmailHelper emailHelper,
            IConfigurationSettings configurationSettings,
            IConfiguration configuration
            )
            : base(context)
        {
            _emailHelper = emailHelper;
            _configurationSettings = configurationSettings;
            _configuration = configuration;
        }

        public ServiceCodes GetServiceCode(int userId) {
            return (ServiceCodes)Context.Providers.Where(p => p.ProviderUserId == userId).Select(p => p.ProviderTitle.ServiceCodeId).First();
        }

        public void ChangeProviderAccessStatus(Provider provider, bool isBlocked, int? doNotBillReason = null, string otherReason = null)
        {
            ThrowIfNull(provider);
            ThrowIfNull(provider.ProviderUser);
            ThrowIfNull(provider.ProviderUser.AuthUser);
            var existingProvider = Context.Providers.Single(p => p.Id == provider.Id);
            existingProvider.Archived = isBlocked;
            existingProvider.DoNotBillReasonId = doNotBillReason;
            existingProvider.BlockedReason = otherReason;
            var existingUser = Context.Users.Single(u => u.Id == provider.ProviderUserId);
            existingUser.Archived = isBlocked;
            var existingAuthUser = Context.AuthUsers.Single(au => au.Id == provider.ProviderUser.AuthUserId);
            existingAuthUser.HasAccess = !isBlocked;
            // End all active assignments if access is getting revoked
            if (isBlocked)
            {
                foreach (var assignment in provider.ProviderEscAssignments)
                {
                    if (assignment.EndDate == null)
                    {
                        assignment.EndDate = DateTime.UtcNow;
                    }
                }
            }
            Context.SaveChanges();
        }

        public Provider GetByUserId(int userId)
        {
            return Context.Providers.Where(x => x.ProviderUserId == userId).FirstOrDefault();
        }

        public int GetReferralsCount(int providerId)
        {
            var provider = Context.Providers.Include(p => p.ProviderTitle).FirstOrDefault(p => p.Id == providerId);
            int providerServiceAreaId = provider.ProviderTitle.ServiceCodeId;
            var orpDate = provider.OrpApprovalDate != null ? ((DateTime)provider.OrpApprovalDate).AddYears(-1) : new DateTime();

            var today = DateTime.Now;
            var results = Context.Students.Where(student =>
                !student.Archived &&
                student.ProviderStudents.Any(ps => ps.ProviderId == providerId) &&
                !student.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                        (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                        referral.EffectiveDateFrom.HasValue &&
                        referral.EffectiveDateFrom.Value >= orpDate &&
                        referral.ServiceCodeId == providerServiceAreaId) &&
                student.CaseLoads.Any(c =>
                    c.StudentType.IsBillable &&
                    !c.Archived &&
                    c.ServiceCodeId == providerServiceAreaId
                ) &&
                student.SchoolDistrict.ProviderEscSchoolDistricts.Any(x =>
                                    x.ProviderEscAssignment.ProviderId == provider.Id && !x.ProviderEscAssignment.Archived &&
                                    (x.ProviderEscAssignment.EndDate == null || x.ProviderEscAssignment.EndDate >= today)
                        )
            );

            return results.Count();
        }

        public IEnumerable<SelectOptions> GetSupervisorOptions(int providerId)
        {

            return Context.Providers.Where(provider => provider.Id == providerId)
                                    .SelectMany(provider => provider.ProviderEscAssignments
                                        .SelectMany(providerEsc => providerEsc.ProviderEscSchoolDistricts)
                                            .Select(providerEscSchoolDistrict => providerEscSchoolDistrict.SchoolDistrict)
                                                .SelectMany(schoolDistrict => schoolDistrict.ProviderEscSchoolDistricts.Where(providerEscSchoolDistrict => providerEscSchoolDistrict.ProviderEscAssignment.EndDate == null || providerEscSchoolDistrict.ProviderEscAssignment.EndDate > DateTime.Now)
                                                    .Select(providerEscSchoolDistrict => providerEscSchoolDistrict.ProviderEscAssignment)
                                                        .Select(providerEsc => providerEsc.Provider)
                                                            .Where(supervisor => supervisor.TitleId == provider.ProviderTitle.SupervisorTitleId && !supervisor.Archived)))
                                                .GroupBy(provider => provider.ProviderUserId)
                                                .Select(grp => grp.FirstOrDefault())
                                    .Select(option =>
                                               new SelectOptions
                                               {
                                                   Id = option.Id,
                                                   Name = option.ProviderUser.FirstName + " " + option.ProviderUser.LastName,
                                                   Archived = option.Archived
                                               }).AsEnumerable();

        }

        public IEnumerable<SelectOptions> GetAssistantOptions(int providerId)
        {

            return Context.Providers.Where(provider => provider.Id == providerId)
                                    .SelectMany(provider => provider.ProviderEscAssignments
                                        .SelectMany(providerEsc => providerEsc.ProviderEscSchoolDistricts)
                                            .Select(providerEscSchoolDistrict => providerEscSchoolDistrict.SchoolDistrict)
                                                .SelectMany(schoolDistrict => schoolDistrict.ProviderEscSchoolDistricts
                                                    .Select(providerEscSchoolDistrict => providerEscSchoolDistrict.ProviderEscAssignment)
                                                        .Select(providerEsc => providerEsc.Provider)
                                                    .Where(assistant => assistant.ProviderTitle.SupervisorTitleId == provider.TitleId && !assistant.Archived)))
                                                .GroupBy(provider => provider.ProviderUserId)
                                                .Select(grp => grp.FirstOrDefault())
                                    .Select(option =>
                                               new SelectOptions
                                               {
                                                   Id = option.Id,
                                                   Name = option.ProviderUser.FirstName + " " + option.ProviderUser.LastName,
                                                   Archived = option.Archived
                                               }).AsEnumerable();

        }

        public bool IsProviderAcknowledgmentUpdated(int userId)
        {
            var logs = Context.ProviderAcknowledgmentLogs.Where(pl => pl.Provider.ProviderUserId == userId).ToList();
            if (logs.Any())
            {
                DateTime schoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();
                return logs.SingleOrDefault(pl => pl.DateAcknowledged > schoolYearStart) != null;
            }
            else
            {
                return false;
            }
        }

        public void UpdateProviderAcknowledgment(int userId)
        {
            var providerId = Context.Providers.SingleOrDefault(p => p.ProviderUserId == userId).Id;
            ProviderAcknowledgmentLog pl = new ProviderAcknowledgmentLog
            {
                DateAcknowledged = DateTime.UtcNow,
                ProviderId = providerId
            };
            Context.ProviderAcknowledgmentLogs.Add(pl);
            Context.SaveChanges();
        }

        public int RequestProviderApproval(int providerId)
        {
            var provider = Context.Providers.Include(provider => provider.ProviderUser).FirstOrDefault(provider => provider.Id == providerId);
            provider.VerifiedOrp = true;

            var emailBypass = _configuration["EmailBypass"] == "True";

            if (!emailBypass)
            {
                // Send email
                SendApprovalRequest(provider);
            }

            return Context.SaveChanges();
        }

        private void SendApprovalRequest(Provider provider)
        {
            var env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (!string.IsNullOrWhiteSpace(env) && env != "Development")
            {
                var adminEmails = String.Join(", ", Context.Users
                                            .Where(u => u.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.Admin && !u.Archived)
                                            .Select(u => u.Email));

                _emailHelper.SendEmail(new Utilities.Models.EmailParams()
                {
                    From = _configurationSettings.GetDefaultEmailFrom(),
                    To = adminEmails,
                    Subject = "Provider Medicaid Approval Request",
                    Body = "Provider Id: " + provider.Id + Environment.NewLine +
                            "Provider Name: " + $"{provider.ProviderUser.LastName}, {provider.ProviderUser.FirstName}",
                    IsHtml = false

                });
            }
        }

        public int UpdateBasicInfo(Provider provider)
        {
            var providerToUpdate = Context.Providers.FirstOrDefault(p => p.Id == provider.Id);
            providerToUpdate = provider;
            Context.Providers.AddOrUpdate(providerToUpdate);
            var authUserToUpdate = Context.AuthUsers.FirstOrDefault(u => u.Id == provider.ProviderUserId);
            if (authUserToUpdate != null)
            {
                authUserToUpdate.Username = provider.ProviderUser.AuthUser.Username;
            }
            Context.SaveChanges();
            return provider.Id;
        }

        public void RemoveProviderReferrals(int providerUserId)
        {
            var schoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();
            var referrals = Context.SupervisorProviderStudentReferalSignOffs
                .Where(r => r.SignedOffById == providerUserId && r.EffectiveDateFrom >= schoolYearStart);
            Context.SupervisorProviderStudentReferalSignOffs.RemoveRange(referrals);
            Context.SaveChanges();
        }

        public void UpdateProviderUsername(AuthUser authUser, string username)
        {
            var authUserToUpdate = Context.AuthUsers.FirstOrDefault(au => au.Id == authUser.Id);
            if (!Context.AuthUsers.Any(au => au.Username == username && au.Id != authUser.Id))
            {
                authUserToUpdate.Username = username;
            }
            else
            {
                throw new ValidationException("Username has been taken");
            }
            Context.SaveChanges();
        }
    }
}
