using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;

namespace API.Common.ApplicationInsights
{
    /// <summary>
    /// The purpose of this class is to enrich the logs we send to Application Insights with the traceId we give
    /// back in response.
    /// </summary>
    public class TraceIdTelemetryInitializer : ITelemetryInitializer
    {
        public void Initialize(ITelemetry telemetry)
        {
            var activity = System.Diagnostics.Activity.Current;
            if (activity != null)
            {
                telemetry.Context.Operation.Id = activity.TraceId.ToString();
                telemetry.Context.GlobalProperties["TraceId"] = activity.TraceId.ToString();
            }
        }
    }
}
