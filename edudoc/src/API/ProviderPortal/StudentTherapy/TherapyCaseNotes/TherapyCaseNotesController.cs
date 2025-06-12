using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Collections.Generic;
using System.Linq;
using API.ControllerBase;
using System;
using Service.Encounters.StudentTherapies.TherapyCaseNotes;
using Microsoft.Net.Http.Headers;

namespace API.ProviderPortal.StudentTherapies.TherapyCaseNotes
{
    [Route("api/v1/therapy-case-notes")]
    [Restrict(ClaimTypes.CreateTherapyEncounter, ClaimValues.FullAccess)]
    public class TherapyCaseNotesController : CrudBaseController<TherapyCaseNote>
    {
        private readonly ITherapyCaseNoteService _therapyCaseNoteService;
        public TherapyCaseNotesController(ICRUDService crudService, ITherapyCaseNoteService therapyCaseNoteService): base(crudService)
        {
            _therapyCaseNoteService = therapyCaseNoteService;
        }

        [HttpPut]
        [Route("update")]
        public IActionResult Update([FromBody] IEnumerable<TherapyCaseNote> notes)
        {

                return ExecuteValidatedAction(() =>
                {
                    _therapyCaseNoteService.Update(notes, this.GetUserId());
                    return Ok();
                });


        }

        [HttpGet]
        [Route("has-migration-history")]
        public IActionResult HasMigrationHistory()
        {
            return Ok(_therapyCaseNoteService.HasMigrationHistory(this.GetUserId()));
        }

        [HttpGet]
        [Route("download-migration-history")]
        public IActionResult GetMigrationHistoryFile()
        {
            var file = _therapyCaseNoteService.GetMigrationHistoryFile(this.GetUserId());
            return new FileStreamResult(file, new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            {
                FileDownloadName = "CaseNotesHistory.xlsx"
            };
        }

        public override IActionResult Create([FromBody] TherapyCaseNote data)
        {
            data.ProviderId = Crudservice.GetById<User>(this.GetUserId(), new[] { "Providers_ProviderUserId" }).Providers_ProviderUserId.FirstOrDefault().Id;
            return base.Create(data);
        }

        public override IActionResult GetAll()
        {
            var userId = this.GetUserId();
            var csp = new Model.Core.CRUDSearchParams();
            var cspFull = new Model.Core.CRUDSearchParams<TherapyCaseNote>(csp) {
                order = "Notes",
                AddedWhereClause = new List<System.Linq.Expressions.Expression<Func<TherapyCaseNote, bool>>>
                {
                    n => n.Provider.ProviderUserId == userId,
                }
            };
            return Ok(BaseSearch(cspFull));
        }
  
    }

}
