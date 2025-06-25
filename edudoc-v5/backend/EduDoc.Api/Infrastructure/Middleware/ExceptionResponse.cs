using System;

namespace EduDoc.Api.Infrastructure.Middleware
{
    public class ExceptionResponse
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public string TraceId { get; set; }

        public string StackTrace { get; set; }
        public DateTime TimestampUtc { get; set; }
    }

}
