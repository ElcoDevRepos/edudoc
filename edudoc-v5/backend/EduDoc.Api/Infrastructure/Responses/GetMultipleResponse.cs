using FluentValidation.Results;

namespace EduDoc.Api.Infrastructure.Responses
{
    public class GetMultipleResponse<T>
    {
        public GetMultipleResponse()
        {
            Records = new List<T>();
            Errors = new List<ValidationError>();
        }

        public GetMultipleResponse(List<T> records)
        {
            this.Records = records;
        }

        public GetMultipleResponse(ValidationResult result)
        {
            this.Errors = result.Errors.ConvertAll(e =>
            new ValidationError()
            {
                ErrorCode = Enum.TryParse<ValidationError.EnumErrorCode>(e.ErrorCode, out var errorCode) 
                    ? errorCode 
                    : ValidationError.EnumErrorCode.NotSet,
                Message = e.ErrorMessage,
            });
        }

        public List<T> Records { get; set; } = new();

        public List<ValidationError> Errors { get; set; } = new();

        public int Count => Records.Count;

        public bool Success => this.Errors.Count == 0;
    }
} 