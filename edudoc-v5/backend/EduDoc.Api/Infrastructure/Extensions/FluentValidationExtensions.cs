using EduDoc.Api.Infrastructure.Responses;
using FluentValidation;

namespace EduDoc.Api.Infrastructure.Extensions
{
    public static class FluentValidationExtensions
    {
        public static IRuleBuilderOptions<T, TProperty> WithErrorCode<T, TProperty>(
            this IRuleBuilderOptions<T, TProperty> rule,
            ValidationError.EnumErrorCode errorCode)
        {
            return rule.WithErrorCode(errorCode.ToString());
        }
    }
}
