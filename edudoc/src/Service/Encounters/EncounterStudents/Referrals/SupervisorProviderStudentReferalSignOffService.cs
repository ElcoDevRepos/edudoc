using Service.Core.Utilities;
using Service.Core.Utilities;
using Model;
using System.Linq;
using System;
using System.Data.Entity;
using BreckServiceBase.Utilities.Interfaces;
using Service.Utilities;
using Model.DTOs;
using Service.BillingFailureServices;
using FluentValidation;
using Model.Enums;

namespace Service.Encounters.Referrals
{
    public class SupervisorProviderStudentReferalSignOffService : BaseService, ISupervisorProviderStudentReferalSignOffService
    {
        private readonly IEmailHelper _emailHelper;
        private readonly string _defaultEmailFrom;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IPrimaryContext _context;
        private readonly IBillingFailureService _billingFailureService;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;

        public SupervisorProviderStudentReferalSignOffService(
            IEmailHelper emailHelper,
            IPrimaryContext context,
            IConfigurationSettings configurationSettings,
            IBillingFailureService billingFailureService,
            IEncounterStudentStatusService encounterStudentStatusService
            ) : base(context)
        {
            _context = context;
            _emailHelper = emailHelper;
            _defaultEmailFrom = configurationSettings.GetDefaultEmailFrom();
            _configurationSettings = configurationSettings;
            _billingFailureService = billingFailureService;
            _encounterStudentStatusService = encounterStudentStatusService;
        }

        public int SignReferral(ReferralSignOffRequest referralSignOffRequest, int userId)
        {
            var providerServiceAreaId = _context.Users
                                        .Include(user => user.Providers_ProviderUserId)
                                        .Include(user => user.Providers_ProviderUserId.Select(provider => provider.ProviderTitle))
                                        .FirstOrDefault(user => user.Id == userId).Providers_ProviderUserId
                                        .FirstOrDefault().ProviderTitle.ServiceCodeId;

            var latestSignedReferral = Context.SupervisorProviderStudentReferalSignOffs.FirstOrDefault(r => r.StudentId == referralSignOffRequest.StudentId && r.EffectiveDateTo == null && r.ServiceCodeId == providerServiceAreaId);
            if (latestSignedReferral != null)
            {
                latestSignedReferral.EffectiveDateTo = referralSignOffRequest.EffectiveStartDate;
                ValidateAndThrow(latestSignedReferral, new SupervisorProviderStudentReferalSignOffValidator(_context));
            }

            int referralId;

            var existingUnsignedReferral = Context.SupervisorProviderStudentReferalSignOffs.FirstOrDefault(r => r.StudentId == referralSignOffRequest.StudentId && r.SignOffDate == null && r.ServiceCodeId == providerServiceAreaId);
            if (existingUnsignedReferral != null)
            {
                existingUnsignedReferral.SupervisorId = Context.Providers.FirstOrDefault((provider) => provider.ProviderUserId == userId).Id;
                existingUnsignedReferral.EffectiveDateFrom = referralSignOffRequest.EffectiveStartDate;
                existingUnsignedReferral.SignedOffById = userId;
                existingUnsignedReferral.SignOffDate = DateTime.UtcNow;
                existingUnsignedReferral.SignOffText = referralSignOffRequest.SignOffText;
                existingUnsignedReferral.ServiceCodeId = providerServiceAreaId;
                existingUnsignedReferral.ModifiedById = userId;
                existingUnsignedReferral.DateModified = DateTime.UtcNow;
                ValidateAndThrow(existingUnsignedReferral, new SupervisorProviderStudentReferalSignOffValidator(_context));
                Context.SaveChanges();
                _billingFailureService.CheckForReferralResolution(referralSignOffRequest.StudentId, userId);
                referralId =  existingUnsignedReferral.Id;
            }
            else
            {
                var newReferral = new SupervisorProviderStudentReferalSignOff()
                {
                    SupervisorId = Context.Providers.FirstOrDefault((provider) => provider.ProviderUserId == userId).Id,
                    SignedOffById = userId,
                    EffectiveDateFrom = referralSignOffRequest.EffectiveStartDate,
                    SignOffText = referralSignOffRequest.SignOffText,
                    SignOffDate = DateTime.UtcNow,
                    StudentId = referralSignOffRequest.StudentId,
                    ServiceCodeId = providerServiceAreaId,
                    CreatedById = userId,
                    DateCreated = DateTime.UtcNow,
                };
                ValidateAndThrow(newReferral, new SupervisorProviderStudentReferalSignOffValidator(_context));
                Context.SupervisorProviderStudentReferalSignOffs.Add(newReferral);
                Context.SaveChanges();
                _billingFailureService.CheckForReferralResolution(referralSignOffRequest.StudentId, userId);
                referralId = newReferral.Id;
            }

            _encounterStudentStatusService.CheckEncounterStudentStatusByStatusAndServiceArea(referralSignOffRequest.StudentId, (int)EncounterStatuses.NO_REFFERAL, providerServiceAreaId, userId);
            return referralId;
        }

        /// <summary>
        ///     Sends an email to an assigned supervisor
        ///     to remind them that a referral needs to be signed off.
        /// </summary>
        /// <param name="providerId"></param>
        /// <param name="studentId"></param>
        /// <param name="userId"></param>
        public void SendReferralReminder(int providerId, int studentId, int userId)
        {
            var supervisorEmail = Context.ProviderStudentSupervisors
                                            .Where(s => s.StudentId == studentId
                                                     && s.AssistantId == providerId
                                                     && s.Assistant.ProviderUserId == userId
                                                     && (s.EffectiveEndDate == null || s.EffectiveEndDate > DateTime.Now))
                                            .OrderByDescending(s => s.EffectiveStartDate)
                                            .Select(x => x.Supervisor.ProviderUser.Email)
                                            .FirstOrDefault();
            if (supervisorEmail == null)
            {
                throw new ValidationException("Reminder email cannot be sent. There is no supervisor assigned to student.");
            }

            var headerMessage = "Hello!";
            var message = $"This is a reminder that you have a pending referral that requires an esignature.<br/>Click the button below to see the referral.";
            var link = CreateStudentReferralLink(studentId);
            var buttonText = $"See Student";
            var title = $"Referral Reminder";
            var body = GetButtonLinkEmailBody(headerMessage, message, link, buttonText);

            Utilities.Models.EmailParams ep = new Utilities.Models.EmailParams()
            {
                From = _defaultEmailFrom,
                To = supervisorEmail,
                Subject = title,
                Body = body
            };
            _emailHelper.SendEmail(ep);

        }

        private string CreateStudentReferralLink(int studentId)
        {
            var adminSite = _configurationSettings.GetAdminSite();
            var providerSite = "/#/provider";
            var endpoint = "/case-load/student/";
            var href = $"{adminSite}{providerSite}{endpoint}{studentId}";
            return href;
        }

        private static string GetButtonLinkEmailBody(string headerMessage, string message, string link, string buttonText)
        {
            string bodyHTML = @"<div width=""546"" valign=""top"" style=""font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important;border-collapse:collapse"">
	                                <div style=""max-width:600px;margin:0 auto"">
		                                <h2 style=""color:#3c8ed7;line-height:30px;margin-bottom:12px;margin:0 0 12px"">{0}</h2>
		                                <p style=""font-size:20px;line-height:26px;margin:0 0 16px"">
			                                {1}
		                                </p>
		                                <span style=""display:inline-block;border-radius:4px;background:#004AA0;border-bottom:2px solid #004AA0"">
				                                <a href=""{2}"" style=""color:white;font-weight:normal;text-decoration:none;word-break:break-word;font-size:20px;line-height:26px;border-top:14px solid;border-bottom:14px solid;border-right:32px solid;border-left:32px solid;background-color:#3c8ed7;border-color:#3c8ed7;display:inline-block;letter-spacing:1px;min-width:80px;text-align:center;border-radius:4px"" target=""_blank"">
					                                {3}
				                                </a>
		                                </span>
	                                </div>
                                </div>";
            return string.Format(bodyHTML, headerMessage, message, link, buttonText);
        }

    }
}
