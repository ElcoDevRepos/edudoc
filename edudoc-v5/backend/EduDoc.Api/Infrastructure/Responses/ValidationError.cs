namespace EduDoc.Api.Infrastructure.Responses
{



    public class ValidationError
    {
        public enum EnumErrorCode
        {
            NotSet,
            Required,
            MinLength,
        }


        public string Message { get; set; } = string.Empty;

        public EnumErrorCode ErrorCode { get; set; } = EnumErrorCode.NotSet;
    }
}
