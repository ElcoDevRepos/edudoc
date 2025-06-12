
using FluentValidation;
using Model;

namespace Service.Messages.Links
{
    public class MessageLinkValidator : AbstractValidator<MessageLink>
    {
        public MessageLinkValidator()
        {
        }
    }
}
