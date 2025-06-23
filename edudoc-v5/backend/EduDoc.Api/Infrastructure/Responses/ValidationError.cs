namespace EduDoc.Api.Infrastructure.Responses
{

    public enum  ErrorCode
    {
        NotSet,
    }


    public class ValidationError
    {
        public string Message { get; set; } = string.Empty;

        public ErrorCode ErrorCode { get; set; } = ErrorCode.NotSet;
    }
}
