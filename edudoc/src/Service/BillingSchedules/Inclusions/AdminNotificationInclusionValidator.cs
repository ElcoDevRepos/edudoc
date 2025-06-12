using FluentValidation;
using Model;

namespace Service.BillingSchedules
{
    public class AdminNotificationInclusionValidator : AbstractValidator<BillingScheduleAdminNotification>
    {
        public AdminNotificationInclusionValidator()
        {
        }
    }
}
