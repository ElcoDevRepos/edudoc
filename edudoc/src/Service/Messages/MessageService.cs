using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Service.Utilities;
using System;
using DTO;

namespace Service.Messages
{
    public class MessageService : CRUDBaseService, IMessageService
    {
        private readonly IPrimaryContext _context;
        private readonly IConfigurationSettings _configurationSettings;
        public MessageService(IPrimaryContext context, IEmailHelper emailHelper, IConfigurationSettings configurationSettings)
            : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _configurationSettings = configurationSettings;
        }
        public IEnumerable<LinkSelectorDTO> GetLinkSelections(string query, int? providerId = null)
        {
            return (_context.MessageDocuments
                    .Include(md => md.ProviderTrainings)
                    .Include(md => md.MessageFilterType)
                    .Where(
                        md =>
                         !md.Archived &&
                         md.Description.Contains(query) &&
                            (
                                (!md.Mandatory &&
                                    (providerId == null ||
                                    md.ProviderId == providerId ||
                                    md.ProviderTitle.Providers.Any(provider => provider.Id == providerId) ||
                                    md.SchoolDistrict.ProviderEscSchoolDistricts.Any(psd => psd.ProviderEscAssignment.ProviderId == providerId) ||
                                    md.Esc.ProviderEscAssignments.Any(psd => psd.ProviderId == providerId) ||
                                    md.MessageFilterTypeId == (int)MessageFilterTypes.Global)
                                ) ||
                                (
                                    md.Mandatory &&
                                    md.ProviderTrainings.Any(pt =>
                                        pt.ProviderId == providerId &&
                                        !pt.DateCompleted.HasValue
                                    )
                                )
                            )
                           && (md.ValidTill == null || md.ValidTill >= DateTime.UtcNow)
                    )
                    .AsEnumerable()
                    .Select(md => new LinkSelectorDTO()
                    {
                        Id = md.Id,
                        Name = md.MessageFilterType.Id != (int)MessageFilterTypes.Global ? $"({md.MessageFilterType.Name}) {md.Description}" : $"{md.Description}",
                        Link = $"{_configurationSettings.GetAdminSite()}/docs/{md.FilePath}",
                        LinkType = (int)LinkTypes.Document,
                        DateCreated = md.DateCreated,
                        ProviderTraining = md.ProviderTrainings.FirstOrDefault(pt => pt.ProviderId == providerId && pt.DateCompleted == null),
                        DueDate = md.DueDate,
                    }))

                    .Union
                         (_context.MessageLinks
                        .Include(ml => ml.ProviderTrainings)
                        .Include(ml => ml.MessageFilterType)
                        .Where(
                             ml => ml.Description.Contains(query) &&
                                (
                                    (
                                        !ml.Mandatory &&
                                        (providerId == null ||
                                        ml.ProviderId == providerId ||
                                        ml.ProviderTitle.Providers.Any(provider => provider.Id == providerId) ||
                                        ml.SchoolDistrict.ProviderEscSchoolDistricts.Any(psd => psd.ProviderEscAssignment.ProviderId == providerId) ||
                                        ml.Esc.ProviderEscAssignments.Any(psd => psd.ProviderId == providerId) ||
                                        ml.MessageFilterTypeId == (int)MessageFilterTypes.Global)
                                    ) ||
                                    (
                                        ml.Mandatory &&
                                        ml.ProviderTrainings.Any(pt =>
                                        pt.ProviderId == providerId &&
                                        !pt.DateCompleted.HasValue
                                    )
                                )
                            )
                            && (ml.ValidTill == null || ml.ValidTill >= DateTime.UtcNow)
                        )
                        .AsEnumerable()
                        .Select(ml => new LinkSelectorDTO()
                        {
                            Id = ml.Id,
                            Name = ml.MessageFilterType.Id != (int)MessageFilterTypes.Global ? $"({ml.MessageFilterType.Name}) {ml.Description}" : $"{ml.Description}",
                            Link = $"{ml.Url}",
                            LinkType = (int)LinkTypes.Link,
                            DateCreated = ml.DateCreated,
                            ProviderTraining = ml.ProviderTrainings.FirstOrDefault(pt => pt.ProviderId == providerId && pt.DateCompleted == null),
                            DueDate = ml.DueDate,
                        }))
                        .OrderByDescending(x => x.DueDate)
                        .ThenByDescending(x => x.DateCreated);

        }

        public IEnumerable<MessageDto> GetProviderMessages(int userId)
        {
            return _context.Messages
                    .Where(
                        m => !m.Archived && (m.Provider.ProviderUserId == userId ||
                                m.ProviderTitle.Providers.Any(provider => provider.ProviderUserId == userId) ||
                                m.SchoolDistrict.ProviderEscSchoolDistricts.Any(psd => psd.ProviderEscAssignment.Provider.ProviderUserId == userId) ||
                                m.Esc.ProviderEscAssignments.Any(psd => psd.Provider.ProviderUserId == userId) ||
                                m.MessageFilterTypeId == (int)MessageFilterTypes.Global)
                            && (m.ValidTill == null || m.ValidTill >= DateTime.UtcNow)

                    )
                    .Include(x => x.ReadMessages)
                    .OrderBy(m => m.ReadMessages.Any(rm => rm.ReadById == userId))
                    .ThenByDescending(m => m.DateCreated)
                    .AsEnumerable()
                    .Select(m => new MessageDto
                    {
                        Description = m.Description,
                        Body = m.Body,
                        Id = m.Id,
                        IsRead = m.ReadMessages.Any(rm => rm.ReadById == userId)
                    });

        }

        public IEnumerable<MessageDto> GetDistrictAdminMessages(int userId)
        {
            return _context.Messages
                    .Where(
                        m => !m.Archived && m.ForDistrictAdmins &&
                                (m.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) ||
                                m.Esc.EscSchoolDistricts.Any(esd => esd.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId)) ||
                                m.MessageFilterTypeId == (int)MessageFilterTypes.Global) &&
                                (m.ValidTill == null || m.ValidTill >= DateTime.UtcNow)

                    )
                    .Include(x => x.ReadMessages)
                    .OrderBy(m => m.ReadMessages.Any(rm => rm.ReadById == userId))
                    .ThenByDescending(m => m.DateCreated)
                    .AsEnumerable()
                    .Select(m => new MessageDto
                    {
                        Description = m.Description,
                        Body = m.Body,
                        Id = m.Id,
                        IsRead = m.ReadMessages.Any(rm => rm.ReadById == userId)
                    });

        }

        public int CreateLink(MessageLink messageLink)
        {
            _context.MessageLinks.Add(messageLink);
            _context.SaveChanges();

            if (messageLink.Mandatory && messageLink.TrainingTypeId == (int)TrainingTypes.Updated)
            {
                GenerateLinkTrainings(messageLink);
            }
            return messageLink.Id;
        }

        public void GenerateLinkTrainings(MessageLink messageLink)
        {
            switch (messageLink.MessageFilterTypeId)
            {
                case (int)MessageFilterTypes.ESC:
                    {
                        GenerateTrainings(PoolESCRecipients((int)messageLink.EscId), true, messageLink.Id, messageLink.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.Global:
                    {
                        GenerateTrainings(PoolGlobalRecipients(), true, messageLink.Id, messageLink.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.Providers:
                    {
                        GenerateTrainings(PoolProviderRecipients((int)messageLink.ProviderId), true, messageLink.Id, messageLink.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.ProviderTitle:
                    {
                        GenerateTrainings(PoolProviderTitleRecipients((int)messageLink.ProviderTitleId), true, messageLink.Id, messageLink.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.SchoolDistricts:
                    {
                        GenerateTrainings(PoolSchoolDistrictRecipients((int)messageLink.SchoolDistrictId), true, messageLink.Id, messageLink.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.ServiceCode:
                    {
                        GenerateTrainings(PoolServiceCodeRecipients((int)messageLink.ServiceCodeId), true, messageLink.Id, messageLink.DueDate.GetValueOrDefault());
                        break;
                    }
                default:
                    break;
            }
        }

        public int CreateDocument(MessageDocument messageDoc)
        {
            _context.MessageDocuments.Add(messageDoc);
            _context.SaveChanges();

            if (messageDoc.Mandatory && messageDoc.TrainingTypeId == (int)TrainingTypes.Updated)
            {
                GenerateDocTrainings(messageDoc);
            }
            return messageDoc.Id;
        }

        public void GenerateDocTrainings(MessageDocument messageDoc)
        {
            switch (messageDoc.MessageFilterTypeId)
            {
                case (int)MessageFilterTypes.ESC:
                    {
                        GenerateTrainings(PoolESCRecipients((int)messageDoc.EscId), false, messageDoc.Id, messageDoc.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.Global:
                    {
                        GenerateTrainings(PoolGlobalRecipients(), false, messageDoc.Id, messageDoc.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.Providers:
                    {
                        GenerateTrainings(PoolProviderRecipients((int)messageDoc.ProviderId), false, messageDoc.Id, messageDoc.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.ProviderTitle:
                    {
                        GenerateTrainings(PoolProviderTitleRecipients((int)messageDoc.ProviderTitleId), false, messageDoc.Id, messageDoc.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.SchoolDistricts:
                    {
                        GenerateTrainings(PoolSchoolDistrictRecipients((int)messageDoc.SchoolDistrictId), false, messageDoc.Id, messageDoc.DueDate.GetValueOrDefault());
                        break;
                    }
                case (int)MessageFilterTypes.ServiceCode:
                    {
                        GenerateTrainings(PoolServiceCodeRecipients((int)messageDoc.ServiceCodeId), false, messageDoc.Id, messageDoc.DueDate.GetValueOrDefault());
                        break;
                    }
                default:
                    break;
            }
        }

        private IEnumerable<int> PoolESCRecipients(int escId)
        {
            return _context.Providers.Where(provider => provider.ProviderEscAssignments.Any(pea => pea.EscId == escId)).Select(p => p.Id);
        }

        private IEnumerable<int> PoolGlobalRecipients()
        {
            return _context.Providers.Select(p => p.Id);
        }

        private IEnumerable<int> PoolProviderRecipients(int providerId)
        {
            return new List<int>() { providerId };
        }

        private IEnumerable<int> PoolProviderTitleRecipients(int titleId)
        {
            return _context.Providers.Where(provider => provider.TitleId == titleId).Select(p => p.Id);

        }

        private IEnumerable<int> PoolSchoolDistrictRecipients(int schoolDistrictId)
        {
            return _context.Providers.Where(provider => provider.ProviderEscAssignments.Any(pea => pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == schoolDistrictId))).Select(p => p.Id);
        }

        private IEnumerable<int> PoolServiceCodeRecipients(int serviceCodeId)
        {
            return _context.Providers.Where(provider => provider.ProviderTitle.ServiceCodeId == serviceCodeId).Select(p => p.Id);
        }

        private int GenerateTrainings(IEnumerable<int> providerIds, bool isLink, int entityId, DateTime dueDate)
        {
            var allTrainings = new List<ProviderTraining>();
            foreach (var id in providerIds)
            {
                var newTraining = new ProviderTraining()
                {
                    ProviderId = id,
                    DueDate = dueDate > DateTime.MinValue ? dueDate : DateTime.UtcNow,
                };

                if (isLink)
                {
                    newTraining.LinkId = entityId;
                }
                else
                {
                    newTraining.DocumentId = entityId;
                }

                allTrainings.Add(newTraining);
            }

            _context.ProviderTrainings.AddRange(allTrainings);
            return _context.SaveChanges();
        }

        public void CompleteTraining(ProviderTraining providerTraining)
        {
            var training = _context.ProviderTrainings.FirstOrDefault(pt => pt.Id == providerTraining.Id);
            training.DateCompleted = DateTime.UtcNow;
            _context.SaveChanges();
        }

        public void UpdateDocument(MessageDocument messageDocument, int userId)
        {
            var cso = new CRUDServiceOptions { currentuserid = userId };

            Update(messageDocument, cso);

            var providerTrainings = _context.ProviderTrainings.Where(pt => pt.DocumentId == messageDocument.Id);

            foreach (var training in providerTrainings)
            {
                messageDocument.Archived = training.Archived;
                training.DueDate = messageDocument.DueDate;
            }
            _context.SaveChanges();
        }

        public void UpdateLink(MessageLink messageLink, int userId)
        {
            var cso = new CRUDServiceOptions { currentuserid = userId };

            Update(messageLink, cso);

            var providerTrainings = _context.ProviderTrainings.Where(pt => pt.LinkId == messageLink.Id);

            foreach (var training in providerTrainings)
            {
                training.DueDate = messageLink.DueDate;
            }

            _context.SaveChanges();
        }
        public IEnumerable<MessageDto> GetLoginMessages()
        {
            return _context.Messages
                .Where(m => !m.Archived && m.MessageFilterTypeId == (int)MessageFilterTypes.Login &&
                    (m.ValidTill == null || m.ValidTill >= DateTime.UtcNow))
                .Select(m => new MessageDto
                {
                    Description = m.Description,
                    Body = m.Body,
                    Id = m.Id,
                });
        }

        public void DeleteMessages(int messageId)
        {
            // delete read messages if any
            var readMessages = _context.ReadMessages.Where(m => m.MessageId == messageId);
            _context.ReadMessages.RemoveRange(readMessages);
            var message = _context.Messages.FirstOrDefault(m => m.Id == messageId);
            ThrowIfNull(message);
            _context.Messages.Remove(message);
            _context.SaveChanges();
        }

        public IEnumerable<LinkSelectorDTO> GetDistrictAdminDocumentsAndLinks(int districtAdminId)
        {
            var schoolDistrictIds = _context.Users.Where(u => u.Id == districtAdminId).SelectMany(u => u.SchoolDistricts_DistrictId).Select(sd => sd.Id).ToList();
            return _context.MessageDocuments
                    .Where(
                        md =>
                            schoolDistrictIds.Contains(md.SchoolDistrictId.Value)
                           && (md.ValidTill == null || md.ValidTill >= DateTime.UtcNow)
                           && !md.Archived
                    )
                    .AsEnumerable()
                    .Select(md => new LinkSelectorDTO()
                    {
                        Id = md.Id,
                        Name = $"{md.Description}",
                        Link = $"{_configurationSettings.GetAdminSite()}/docs/{md.FilePath}",
                        LinkType = (int)LinkTypes.Document,
                        DateCreated = md.DateCreated,
                        DueDate = md.DueDate,
                    })

                    .Union
                         (_context.MessageLinks
                        .Where(
                             ml =>
                            schoolDistrictIds.Contains(ml.SchoolDistrictId.Value)
                            && (ml.ValidTill == null || ml.ValidTill >= DateTime.UtcNow)
                           && !ml.Archived
                        )
                        .AsEnumerable()
                        .Select(ml => new LinkSelectorDTO()
                        {
                            Id = ml.Id,
                            Name =  $"{ml.Description}",
                            Link = $"{ml.Url}",
                            LinkType = (int)LinkTypes.Link,
                            DateCreated = ml.DateCreated,
                            DueDate = ml.DueDate,
                        }))
                        .OrderByDescending(x => x.DueDate)
                        .ThenByDescending(x => x.DateCreated);

        }
    }

}
