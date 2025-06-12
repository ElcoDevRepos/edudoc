namespace Templator.Utilities
{
    public class HtmlUtil
    {
        public static string NewLineToBr(string input)
        {
            return input
                .Replace("\r\n", "<br />")
                .Replace("\r", "<br />")
                .Replace("\n", "<br />");
        }
    }
}
