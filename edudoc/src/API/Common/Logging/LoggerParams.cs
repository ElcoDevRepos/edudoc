namespace API.Logging
{
    public class LoggerParams
    {
        public LoggerRowParams[] stack { get; set; }
        public string message { get; set; }
    }

    public class LoggerRowParams
    {
        public string functionName { get; set; }
        public string fileName { get; set; }
        public int lineNumber { get; set; }
        public int columnNumber { get; set; }
        public string source { get; set; }
    }
}
