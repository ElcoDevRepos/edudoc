using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Settings;
using System.Collections.Generic;

namespace API.Settings
{
    [Route("api/v1/settings")]
    [Restrict(ClaimTypes.AppSettings, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class SettingsController : ApiControllerBase
    {
        private readonly ISettingsService _service;

        public SettingsController(ISettingsService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("")]
        [Bypass(true)] // company settings need to be retrievable by all
        public IEnumerable<Setting> GetSettings()
        {
            return _service.GetSettings();
        }

        [HttpGet]
        [Route("{settingId:int}")]

        public IActionResult GetSettingById(int settingId)
        {
            return GetById(settingId, _service.GetSetting);
        }

        [HttpPut]
        [Route("")]
        [Restrict(ClaimTypes.AppSettings, ClaimValues.FullAccess)]
        public IActionResult PutSetting([FromBody]Setting setting)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.UpdateSetting(setting);
                return Ok();
            });
        }

        [HttpPut]
        [Route("batch")]
        [Restrict(ClaimTypes.AppSettings, ClaimValues.FullAccess)]
        public IActionResult BatchPutSettings([FromBody] IEnumerable<Setting> settings)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.UpdateSettings(settings);
                return Ok();
            });
        }
    }
}
