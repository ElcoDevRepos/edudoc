namespace EduDoc.Api.Infrastructure.Formatters
{
    public interface ISearchFormatter
    {
        string Format(string input);
    }

    public class SearchFormatter : ISearchFormatter
    {
        public string Format(string input)
        {
            return input == null ? string.Empty : input.Trim();
        }
    }
}
