using DTO;
using Model;
using Model.DTOs;
using System.Collections.Generic;

namespace Service.Messages
{
    public interface IMessageService
    {
        IEnumerable<LinkSelectorDTO> GetLinkSelections(string query, int? providerId = null);
        IEnumerable<MessageDto> GetProviderMessages(int userId);
        IEnumerable<MessageDto> GetDistrictAdminMessages(int userId);
        int CreateLink(MessageLink messageLink);
        void GenerateLinkTrainings(MessageLink messageLink);
        int CreateDocument(MessageDocument messageDocument);
        void GenerateDocTrainings(MessageDocument messageDocument);
        void CompleteTraining(ProviderTraining providerTraining);
        void UpdateDocument(MessageDocument messageDocument, int userId);
        void UpdateLink(MessageLink messageLink, int userId);
        IEnumerable<MessageDto> GetLoginMessages();
        void DeleteMessages(int messageId);
        IEnumerable<LinkSelectorDTO> GetDistrictAdminDocumentsAndLinks(int districtAdminId);
    }
}
