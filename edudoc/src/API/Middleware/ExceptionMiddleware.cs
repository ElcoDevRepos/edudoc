using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace API.Middleware
{
    /// <summary>
    /// The purpose of this middleware is to return a nice JSON response when we have exceptions that contains the traceID.
    /// If we're in development we include the stack trace as well. 
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionMiddleware> logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                var d = System.Diagnostics.Activity.Current;
                var traceId = System.Diagnostics.Activity.Current?.TraceId.ToString() ?? "unknown";
                var utcNow = DateTime.UtcNow;

                logger.LogError(ex, "Unhandled exception occurred. TraceId: {TraceId} at {UtcTime}", traceId, utcNow);

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                ExceptionResponse exceptionResponse = new ExceptionResponse
                {
                    Status = 500,
                    Message = $"An unexpected error occurred.",
                    TraceId = traceId,
                    TimestampUtc = utcNow,
                    StackTrace = $"{(environment == "Development" ? ex.ToString() : "")}"

                };

                await context.Response.WriteAsJsonAsync(exceptionResponse);
            }
        }
    }
}
