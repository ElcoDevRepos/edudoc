namespace EduDoc.Api.Infrastructure.Responses
{
    public class GetSingleResponse<T>
    {
        public GetSingleResponse(T record)
        {
            Record = record;
        }

        public T Record { get; set; }

        public List<ValidationError> Errors { get; set; } = new();
    }
}
