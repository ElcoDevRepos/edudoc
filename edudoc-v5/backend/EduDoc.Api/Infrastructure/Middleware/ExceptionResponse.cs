using System;

namespace EduDoc.Api.Infrastructure.Middleware
{
    public class ExceptionResponse
    {
        public int Status { get; set; }
        public required string Message { get; set; }
        public required string TraceId { get; set; }

        public required string StackTrace { get; set; }
        public DateTime TimestampUtc { get; set; }
    }

}
