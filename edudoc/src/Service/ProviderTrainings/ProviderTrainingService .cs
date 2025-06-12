using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using Service.Utilities;
using System;
using System.Linq;
using System.Data.Entity;
using Model.Enums;
using System.Collections.Generic;
using Service.Messages;

namespace Service.ProviderTrainings
{
    public class ProviderTrainingService : CRUDBaseService, IProviderTrainingService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IMessageService _messageService;
        private readonly string _defaultEmailFrom;
        private readonly IConfigurationSettings _configurationSettings;

        public ProviderTrainingService( IPrimaryContext context,
                                        IEmailHelper emailHelper,
                                        IMessageService messageService,
                                        IConfigurationSettings configurationSettings
                                      ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _emailHelper = emailHelper;
            _messageService = messageService;
            _defaultEmailFrom = configurationSettings.GetDefaultEmailFrom();
            _configurationSettings = configurationSettings;
        }


        /// <summary>
        ///     Sends an email to a provider
        ///     to remind them that a training needs to be completed.
        /// </summary>
        /// <param name="providerTrainingId"></param>
        public void RemindProvider(int providerTrainingId)
        {
            var training = _context.ProviderTrainings
                                .Include(pt => pt.MessageLink)
                                .Include(pt => pt.MessageDocument)
                                .Include(pt => pt.Provider)
                                .Include(pt => pt.Provider.ProviderUser)
                                .FirstOrDefault(pt => pt.Id == providerTrainingId);

            training.LastReminder = DateTime.UtcNow;

            var description = training.MessageDocument != null ? training.MessageDocument.Description : training.MessageLink.Description;
            var providerEmail = training.Provider.ProviderUser.Email;

            ThrowIfNull(providerEmail);

            var message = $"This is a reminder that you have a pending training that is required for you to complete by {training.DueDate}.";
            var title = $"Training Reminder";
            var body = "Description: " + description + Environment.NewLine +
                        "Due Date: " + training.DueDate;

            Utilities.Models.EmailParams ep = new Utilities.Models.EmailParams()
            {
                From = _defaultEmailFrom,
                To = providerEmail,
                Subject = title,
                Body = body,
                IsHtml = false
                
            };
            _emailHelper.SendEmail(ep);

            _context.SaveChanges();
        }

        public void RemindAllProviders()
        {
            var trainings = _context.ProviderTrainings
                                .Include(pt => pt.MessageLink)
                                .Include(pt => pt.MessageDocument)
                                .Include(pt => pt.Provider)
                                .Include(pt => pt.Provider.ProviderUser)
                                .Where(pt => pt.DateCompleted == null &&
                                    !pt.Provider.Archived);

            foreach(var training in trainings)
            {
                var description = training.MessageDocument != null ? training.MessageDocument.Description : training.MessageLink.Description;
                var providerEmail = training.Provider.ProviderUser.Email;

                if (providerEmail == null)
                {
                    var message = $"This is a reminder that you have a pending training that is required for you to complete by {training.DueDate}.";
                    var title = $"Training Reminder";
                    var body = "Description: " + description + Environment.NewLine +
                               "Due Date: " + training.DueDate + Environment.NewLine;

                    Utilities.Models.EmailParams ep = new Utilities.Models.EmailParams()
                    {
                        From = _defaultEmailFrom,
                        To = providerEmail,
                        Subject = title,
                        Body = body,
                        IsHtml = false
                    };
                    _emailHelper.SendEmail(ep);

                    training.LastReminder = DateTime.UtcNow;
                }
            }

            _context.SaveChanges();
        }

        public void CreateNewPersonTrainings(AuthUser user)
        {
            int providerId = _context.Providers.FirstOrDefault(p => p.ProviderUser.AuthUserId == user.Id).Id;
            var messages = _context.MessageDocuments.Where(doc => doc.TrainingTypeId == (int)TrainingTypes.New_Person);
            var links = _context.MessageLinks.Where(link => link.TrainingTypeId == (int)TrainingTypes.New_Person);

            var allTrainings = new List<ProviderTraining>();
           
            foreach (var message in messages)
            {
                var newTraining = new ProviderTraining()
                {
                    ProviderId = providerId,
                    DueDate = DateTime.UtcNow.AddMonths(1),
                };

                newTraining.DocumentId = message.Id;

                allTrainings.Add(newTraining);
            };

            foreach(var link in links)
            {
                var newTraining = new ProviderTraining()
                {
                    ProviderId = providerId,
                    DueDate = DateTime.UtcNow.AddMonths(1),
                };

                newTraining.LinkId = link.Id;

                allTrainings.Add(newTraining);
            }

            _context.ProviderTrainings.AddRange(allTrainings);
            _context.AuthUsers.Attach(user);
            user.HasLoggedIn = true;
            _context.SetEntityState(user, EntityState.Modified);
            _context.SaveChanges();
        }

        public void CreateAnnualTrainings()
        {
            var messages = _context.MessageDocuments.Where(doc => doc.TrainingTypeId == (int)TrainingTypes.Yearly).ToList();
            var links = _context.MessageLinks.Where(link => link.TrainingTypeId == (int)TrainingTypes.Yearly).ToList();
            var dueDate = new DateTime(DateTime.UtcNow.Year, 10, 1);

            foreach (var message in messages)
            {
                message.DueDate = dueDate;
                _messageService.GenerateDocTrainings(message);
            };

            foreach (var link in links)
            {
                link.DueDate = dueDate;
                _messageService.GenerateLinkTrainings(link);
            }
        }
    }
}
