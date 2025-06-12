
using FluentValidation;
using Model;

namespace Service.Messages
{
    public class MessageValidator : AbstractValidator<Message>
    {
        public MessageValidator()
        {
        }
    }
}
