using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduDoc.Api.Infrastructure.Middleware
{
    /// <summary>
    /// The purpose of this middleware is to log the entire request and response if the header X-LOG-REQUEST is passed
    /// </summary>
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<RequestResponseLoggingMiddleware> logger;

        public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            bool logRequestAndResponse = context.Request.Headers.ToList()
                .Any(h => string.Equals(h.Key, "X-LOG-REQUEST", StringComparison.OrdinalIgnoreCase));

            if (!logRequestAndResponse)
            {
                await next(context);
                return;
            }

            context.Request.EnableBuffering();

            // Capture request body
            string requestBody = string.Empty;
            using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true))
            {
                requestBody = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;
            }

            // Capture headers
            var headers = context.Request.Headers
                .Select(h => $"{h.Key}: {string.Join(",", h.Value)}")
                .ToArray();

            var originalBodyStream = context.Response.Body;
            var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            try
            {
                await next(context);

                context.Response.Body.Seek(0, SeekOrigin.Begin);
                string responseText = await new StreamReader(context.Response.Body).ReadToEndAsync();
                context.Response.Body.Seek(0, SeekOrigin.Begin);

                logger.LogInformation(
                    "HTTP Request and Response:\nHeaders: {Headers}\nRequest Body: {RequestBody}\nResponse Body: {ResponseBody}",
                    string.Join(" | ", headers),
                    requestBody,
                    responseText
                );

                await responseBody.CopyToAsync(originalBodyStream);
            }
            finally
            {
                context.Response.Body = originalBodyStream;
                responseBody.Dispose();
            }
        }
    }

}