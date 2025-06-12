using Model;
using Model.DTOs;
using System;
using System.Collections.Generic;

namespace Service.Encounters.StudentTherapies
{
    public interface IStudentTherapyScheduleService
    {
        IEnumerable<StudentTherapySchedule> BuildSchedulesFromStudentTherapy(StudentTherapy studentTherapy, int userId);
        void AddSchedulesToUpdatedTherapy(StudentTherapy studentTherapy, StudentTherapy existingSchedule, int userId);

        int SetDeviationReason(int[] studentTherapyScheduleIds, int deviationReasonId, DateTime deviationReasonDate);
        List<StudentTherapiesByDayDto> GetStudentTherapiesByDay(List<int> weekdays, int userId);
        bool FoundScheduleOverlap(StudentTherapy current);
        List<EncounterForCalendarDto> GetForCalendar(Model.Core.CRUDSearchParams csp, int userId);
        void ToggleArchived(List<int> scheduleIds);
    }
}
