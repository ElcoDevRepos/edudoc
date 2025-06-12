using Model;
using System.Collections.Generic;

namespace Service.Settings
{
    public interface ISettingsService
    {
        Setting GetSetting(int id);

        Setting GetSetting(string settingName);

        Setting GetSetting(Settings settingId);

        IEnumerable<Setting> GetSettings();

        void UpdateSetting(Setting setting);

        void UpdateSettings(IEnumerable<Setting> settings);
    }
}