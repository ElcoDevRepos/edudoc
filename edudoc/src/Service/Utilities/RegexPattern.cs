namespace Service.Utilities
{
    public static class RegexPatterns
    {
        public const string PasswordPattern = @"^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$";

        public const string PasswordErrorMsg =
            "Password too weak. Must be at least 8 characters. Must have a captial letter and number.";

        public const string UsernamePattern = @"^[a-zA-Z0-9_]{3,}$";
        public const string UsernameErrorMsg = "Bad username.";
        public const string EmailErrorMsg = "Bad email.";
    }
}
