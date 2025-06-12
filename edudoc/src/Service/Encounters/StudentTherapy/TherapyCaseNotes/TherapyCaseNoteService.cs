using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using ClosedXML.Excel;

namespace Service.Encounters.StudentTherapies.TherapyCaseNotes
{
    public class TherapyCaseNoteService : CRUDBaseService, ITherapyCaseNoteService
    {
        private readonly IPrimaryContext context;

        public TherapyCaseNoteService(IPrimaryContext context, IEmailHelper emailHelper) : base(context, new ValidationService(context, emailHelper))
        {
            this.context = context;
        }

        public void Update(IEnumerable<TherapyCaseNote> notes, int userId)
        {
            var providerId = GetById<User>(userId, new[] { "Providers_ProviderUserId" }).Providers_ProviderUserId.FirstOrDefault().Id;

            var updated = notes.Select(n => {
                n.CreatedById = userId;
                n.ProviderId = providerId;
                n.DateCreated = DateTime.UtcNow;
                return n;
            });

            var csp = new Model.Core.CRUDSearchParams<TherapyCaseNote> {
                order = "Id",
                AddedWhereClause = new List<System.Linq.Expressions.Expression<Func<TherapyCaseNote, bool>>>
                {
                    n => n.Provider.ProviderUserId == userId,
                }
            };
            var existingNotes = GetAll(csp);
            BaseContext.Merge<TherapyCaseNote>()
                .SetExisting(existingNotes)
                .SetUpdates(updated)
                .MergeBy((e, u) => e.Id == u.Id)
                .MapUpdatesBy((e, u) =>
                {
                    e.Notes = u.Notes;
                })
                .Merge();
            BaseContext.SaveChanges();
        }

        public bool HasMigrationHistory(int userId)
        {
            return context.MigrationProviderCaseNotesHistories.Any(x => x.Provider.ProviderUserId == userId);
        }

        public Stream GetMigrationHistoryFile(int userId)
        {
            var columns = new List<CaseNotesHistoryColumn>()
            {
                new CaseNotesHistoryColumn("Encounter #", x => x.EncounterNumber),
                new CaseNotesHistoryColumn("Student", x => x.StudentName),
                new CaseNotesHistoryColumn("Encounter Date", x => x.EncounterDate.Date.ToString("yyyy-MM-dd")),
                new CaseNotesHistoryColumn("Start Time", x => x.StartTime.ToString("yyyy-MM-dd HH:mm:ss")),
                new CaseNotesHistoryColumn("End Time", x => x.EndTime.ToString("yyyy-MM-dd HH:mm:ss")),
                new CaseNotesHistoryColumn("Notes", x => x.ProviderNotes)
            };
            var history = context.MigrationProviderCaseNotesHistories.Where(x => x.Provider.ProviderUserId == userId).Select(x => new CaseNotesHistoryInfo()
            {
                EncounterNumber = x.EncounterNumber,
                StudentName = x.Student.FirstName + " " + x.Student.LastName,
                EncounterDate = x.EncounterDate,
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                ProviderNotes = x.ProviderNotes
            }).ToList();
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Case Notes");
            for (var j = 0; j < columns.Count; ++j)
            {
                worksheet.Cell(1, j + 1).Value = columns[j].ColumnName;
            }
            for (var i = 0; i < history.Count; ++i)
            {
                for (var j = 0; j < columns.Count; ++j)
                {
                    worksheet.Cell(i + 2, j + 1).Value = columns[j].GetValue.Invoke(history[i]);
                }
            }
            var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;
            return stream;
        }

        private class CaseNotesHistoryInfo
        {
            public string EncounterNumber { get; set; }
            public string StudentName { get; set; }
            public DateTime EncounterDate { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public string ProviderNotes { get; set; }
        }

        private class CaseNotesHistoryColumn
        {
            public CaseNotesHistoryColumn(string columnName, Func<CaseNotesHistoryInfo, object> getValue)
            {
                ColumnName = columnName;
                GetValue = getValue;
            }

            public string ColumnName { get; }
            public Func<CaseNotesHistoryInfo, object> GetValue { get; }
        }
    }
}
