using System.Configuration;

namespace Ui.Tests.Utilities
{
    public static class AppSettings
    {
        public static string GetAdminSite()
        {
            return GetAppSetting("AdminSite");
        }

        private static string GetAppSetting(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }
    }
}