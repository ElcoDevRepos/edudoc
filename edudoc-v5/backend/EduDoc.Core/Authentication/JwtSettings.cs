using System;

namespace EduDoc.Core.Authentication
{
    public class JwtSettings
    {
        public required string Key { get; set; }
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public int AccessMinutes { get; set; }

        // Constants matching actual JWT claims from live application
        public static class ClaimTypes
        {
            public const string AuthUserId = "mt_AuthUserId";
            public const string AuthUsername = "mt_AuthUsername";
            public const string AuthClientId = "mt_AuthClientId";
            public const string UserRoleId = "mt_UserRoleId";
            public const string UserRoleTypeId = "app_UserRoldTypeId";  // Note: typo in live app ("Rold")
            public const string UserId = "mt_UserId";
            public const string Ticks = "mt_Ticks";
        }
    }
} 