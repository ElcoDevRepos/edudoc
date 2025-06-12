using Model;
using System.Collections.Generic;
using System.Linq;

namespace Service.Settings
{
    public class SettingsService : ISettingsService
    {
        protected IPrimaryContext Context;

        public SettingsService(IPrimaryContext ctx)
        {
            Context = ctx;
        }

        /// <summary>
        ///     Gets all Settings.
        /// </summary>
        /// <returns>Returns an IEnuermable of Settings.</returns>
        public IEnumerable<Setting> GetSettings()
        {
            return Context.Settings.AsEnumerable();
        }

        /// <summary>
        ///     Gets a Setting by name.
        /// </summary>
        /// <param name="settingName"></param>
        /// <returns>Returns the Setting.</returns>
        public Setting GetSetting(string settingName)
        {
            return Context.Settings.SingleOrDefault(s => s.Name == settingName);
        }

        /// <summary>
        ///     Gets a Setting by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Returns the Setting.</returns>
        public Setting GetSetting(int id)
        {
            return Context.Settings.SingleOrDefault(s => s.Id == id);
        }

        /// <summary>
        ///     Gets a Setting by Enum.
        /// </summary>
        /// <param name="settingId"></param>
        /// <returns>Returns the Setting.</returns>
        public Setting GetSetting(Settings settingId)
        {
            return GetSetting((int)settingId);
        }

        /// <summary>
        ///     Updates a Setting.
        /// </summary>
        /// <param name="setting"></param>
        public void UpdateSetting(Setting setting)
        {
            Context.Settings.Attach(setting);
            Context.Entry(setting).Property(s => s.Value).IsModified = true;
            Context.SaveChanges();
        }

        /// <summary>
        ///     Updates Settings.
        /// </summary>
        /// <param name="settings"></param>
        public void UpdateSettings(IEnumerable<Setting> settings)
        {
            foreach (var setting in settings)
            {
                Context.Settings.Attach(setting);
                Context.Entry(setting).Property(s => s.Value).IsModified = true;
            }
            Context.SaveChanges();
        }
    }
}