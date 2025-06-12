using System.Text.RegularExpressions;

namespace Service.Base.Validation
{
    public static class RegexHelper
    {
        public static Regex GetAllDigitsRegex(int exactLength)
        {
            return new Regex($"^\\d{{{exactLength},{exactLength}}}$");
        }
    }
}
