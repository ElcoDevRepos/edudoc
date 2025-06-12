using System.Text.RegularExpressions;

namespace Service.Utilities
{
    public static class PasswordHelper
    {
        /// <summary>
        ///      Tests password strength.
        /// </summary>
        /// <param name="pword"></param>
        /// <returns>Returns a bool indicating whether password is strong enough.</returns>
        public static bool BeAStrongPassword(string pword)
        {
            if (string.IsNullOrEmpty(pword)) return false;
            Regex rgx = new Regex(RegexPatterns.PasswordPattern);
            return rgx.IsMatch(pword);
        }
    }
}
