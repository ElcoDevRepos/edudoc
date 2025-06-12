using Model;
using System.Collections.Generic;
using System.IO;

namespace Service.Encounters.StudentTherapies.TherapyCaseNotes
{
    public interface ITherapyCaseNoteService
    {
        void Update(IEnumerable<TherapyCaseNote> notes, int userId);
        bool HasMigrationHistory(int userId);
        Stream GetMigrationHistoryFile(int userId);
    }
}
