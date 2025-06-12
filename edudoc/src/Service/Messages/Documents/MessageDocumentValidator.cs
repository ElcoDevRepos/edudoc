
using FluentValidation;
using Model;

namespace Service.Messages.Documents
{
    public class MessageDocumentValidator : AbstractValidator<MessageDocument>
    {
        public MessageDocumentValidator()
        {
        }
    }
}
