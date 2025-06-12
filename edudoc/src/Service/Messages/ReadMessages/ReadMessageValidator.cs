
using FluentValidation;
using Model;

namespace Service.Messages
{
    public class ReadMessageValidator : AbstractValidator<ReadMessage>
    {
        public ReadMessageValidator()
        {
        }
    }
}
