using FluentValidation;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace Service.Encounters.StudentTherapies
{
    public class StudentTherapyService : BaseService, IStudentTherapyService
    {
        private readonly IStudentTherapyScheduleService _studentTherapyScheduleService;
        private readonly IConfiguration _config;
        public StudentTherapyService(IPrimaryContext context, IStudentTherapyScheduleService studentTherapyScheduleService, IConfiguration config) : base(context)
        {
            _studentTherapyScheduleService = studentTherapyScheduleService;
            _config = config;
        }

        public int CreateWithSchedules(StudentTherapy studentTherapy, int userId)
        {
            ThrowIfNull(studentTherapy);
            ValidateAndThrow(studentTherapy, new StudentTherapyValidator());

            // Create new therapy group
            if (studentTherapy.TherapyGroup != null && string.IsNullOrEmpty(studentTherapy.TherapyGroup.Name ?? string.Empty))
            {
                studentTherapy.TherapyGroup.Name = CreateDefaultTherapyGroupName(studentTherapy);
            }

            studentTherapy.StudentTherapySchedules = _studentTherapyScheduleService.BuildSchedulesFromStudentTherapy(studentTherapy, userId).ToList();
            studentTherapy.CreatedById = userId;
            studentTherapy.DateCreated = DateTime.UtcNow;
            Context.StudentTherapies.Add(studentTherapy);
            Context.SaveChanges();

            if (studentTherapy.TherapyGroupId > 0) 
            {
                HandleDefaultTherapyGroupName((int)studentTherapy.TherapyGroupId);
            }

            return studentTherapy.Id;
        }

        public void DeleteSchedules(StudentTherapy data)
        {
            var existingSchedule = Context.StudentTherapies.FirstOrDefault(st => st.Id == data.Id);

            if (data.Archived)
            {
                existingSchedule.Archived = data.Archived;
                var schedules = Context.StudentTherapies
                    .Where(therapy => therapy.Id == data.Id)
                    .SelectMany(therapy => therapy.StudentTherapySchedules)
                    .Where(ts => !ts.EncounterStudents.Any());
                Context.StudentTherapySchedules.RemoveRange(schedules);
                Context.SaveChanges();

                if (data.TherapyGroupId > 0) 
                {
                    HandleDefaultTherapyGroupName((int)data.TherapyGroupId);
                }
            }

            if (data.StartDate > existingSchedule.StartDate)
            {
                var schedules = Context.StudentTherapies
                    .Where(therapy => therapy.Id == data.Id)
                    .SelectMany(therapy => therapy.StudentTherapySchedules)
                    .Where(ts =>
                        ts.ScheduleDate >= existingSchedule.StartDate &&
                        ts.ScheduleDate < data.StartDate &&
                        !ts.EncounterStudents.Any());
                Context.StudentTherapySchedules.RemoveRange(schedules);
                Context.SaveChanges();
            }

            if (data.EndDate < existingSchedule.EndDate)
            {
                var schedules = Context.StudentTherapies
                    .Where(therapy => therapy.Id == data.Id)
                    .SelectMany(therapy => therapy.StudentTherapySchedules)
                    .Where(ts =>
                        ts.ScheduleDate <= existingSchedule.EndDate &&
                        ts.ScheduleDate > data.EndDate &&
                        !ts.EncounterStudents.Any());
                Context.StudentTherapySchedules.RemoveRange(schedules);
                Context.SaveChanges();
            }

            var schedulesToArchive = Context.StudentTherapySchedules
            .Include(sts => sts.EncounterStudents)
            .Include(sts => sts.EncounterStudents.Select(es => es.Encounter))
            .Where(sts => sts.StudentTherapyId == data.Id && sts.EncounterStudents.All(es =>
                es.EncounterStatusId == (int)EncounterStatuses.OPEN_ENCOUNTER_READY_FOR_YOU));
                foreach (var schedule in schedulesToArchive)
                {
                    schedule.Archived = true;
                    // Archive all encounter and encounter students that have an archived student therapy schedule
                    foreach (var es in schedule.EncounterStudents)
                    {
                        es.Archived = true;
                        es.Encounter.Archived = true;
                    }
                }
            Context.SaveChanges();
        }

        public void UpdateSchedules(StudentTherapy data, int userId)
        {
            var existingSchedule = Context.StudentTherapies.FirstOrDefault(st => st.Id == data.Id);

            UpdateSchedules(Context, data, es => es.Archived);
                    
            _studentTherapyScheduleService.AddSchedulesToUpdatedTherapy(data, existingSchedule, userId);

            data.ModifiedById = userId;
            data.DateModified = DateTime.UtcNow;

            var existingIndividualSession = Context.StudentTherapies.First()?.SessionName;
            if (existingIndividualSession != data.SessionName)
            {
                existingIndividualSession = data.SessionName;
                Context.SaveChanges();
            }

            Context.SaveChanges();
        }

        private static void UpdateSchedules(IPrimaryContext context, StudentTherapy data, Func<EncounterStudent, bool> shouldUpdateEncounterStudent)
        {
            // Update time on student therapy schedules
            var schedules = context.StudentTherapies
                .Where(therapy => therapy.Id == data.Id)
                .SelectMany(therapy => therapy.StudentTherapySchedules)
                .Include(therapy => therapy.EncounterStudents)
                .Include(therapy => therapy.EncounterStudents.Select(es => es.Encounter));

            foreach (var schedule in schedules)
            {
                var newStartDate = data.StartDate;
                var newEndDate = data.EndDate;

                var dateOnSchedule = (DateTime)schedule.ScheduleDate;
                TimeZoneInfo tz = CommonFunctions.GetTimeZone();
                var startsInDst = tz.IsDaylightSavingTime(newStartDate);
                var endsInDst = tz.IsDaylightSavingTime(newEndDate);

                var startDateString = dateOnSchedule.ToString("MM/dd/yyyy") + " " + newStartDate.ToLongTimeString();
                var endDateString = dateOnSchedule.ToString("MM/dd/yyyy") + " " + newEndDate.ToLongTimeString();

                DateTime startDate;
                if (DateTime.TryParseExact(startDateString, "MM/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out startDate))
                {
                    startDate = CommonFunctions.ApplyDaylightSavingsOffset(startsInDst, startDate);
                }

                DateTime endDate;
                if (DateTime.TryParseExact(endDateString, "MM/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out endDate))
                {
                    endDate = CommonFunctions.ApplyDaylightSavingsOffset(endsInDst, endDate);
                }

                schedule.ScheduleStartTime = startDate.TimeOfDay;
                schedule.ScheduleEndTime = endDate.TimeOfDay;

                foreach (var encounter in schedule.EncounterStudents)
                {
                    if (shouldUpdateEncounterStudent(encounter))
                    {
                        encounter.EncounterStartTime = startDate.TimeOfDay;
                        encounter.EncounterEndTime = endDate.TimeOfDay;

                        encounter.Encounter.EncounterStartTime = startDate.TimeOfDay;
                        encounter.Encounter.EncounterEndTime = endDate.TimeOfDay;
                    }
                }
            }
        }

        public void UpdateTherapyGroup(StudentTherapy data, int userId)
        {
            var existingTherapyGroup = Context.TherapyGroups.FirstOrDefault(tg => tg.Id == data.TherapyGroupId);
            if (existingTherapyGroup != null)
            {
                existingTherapyGroup.StartDate = data.StartDate;
                existingTherapyGroup.EndDate = data.EndDate;
            }
            // Update other student therapies that share the same therapy group id
            var studentTherapies = Context.StudentTherapies.Where(st => st.TherapyGroupId == data.TherapyGroupId);
            foreach (var studentTherapy in studentTherapies)
            {
                studentTherapy.StartDate = data.StartDate;
                studentTherapy.EndDate = data.EndDate;
            }
            // Update time on student therapy schedules
            var therapySchedules = Context.StudentTherapySchedules.Where(ts => studentTherapies.Select(st => st.Id).Contains(ts.StudentTherapyId));
            foreach (var schedule in therapySchedules)
            {
                var newStartDate = data.StartDate;
                var newEndDate = data.EndDate;

                var dateOnSchedule = (DateTime)schedule.ScheduleDate;
                TimeZoneInfo tz = CommonFunctions.GetTimeZone();
                var inDst = tz.IsDaylightSavingTime(dateOnSchedule);

                var startDateString = dateOnSchedule.ToString("MM/dd/yyyy") + " " + newStartDate.ToLongTimeString();
                var startDate = CommonFunctions.ApplyDaylightSavingsOffset(inDst, DateTime.Parse(startDateString));
                var endDateString = dateOnSchedule.ToString("MM/dd/yyyy") + " " + newEndDate.ToLongTimeString();
                var endDate = CommonFunctions.ApplyDaylightSavingsOffset(inDst, DateTime.Parse(endDateString));

                schedule.ScheduleStartTime = startDate.TimeOfDay;
                schedule.ScheduleEndTime = endDate.TimeOfDay;
            }
            Context.SaveChanges();
        }

        private string CreateDefaultTherapyGroupName(StudentTherapy studentTherapy)
        {
            var therapyGroup = studentTherapy.TherapyGroup;
            var student = Context.CaseLoads.Where(c => c.Id == studentTherapy.CaseLoadId).Select(c => c.Student).FirstOrDefault();

            return $"{CommonFunctions.GetDefaultTherapyGroupDayString(therapyGroup)} - {CommonFunctions.GetDefaultTherapyGroupStudentName(student)}";
        }

        private void HandleDefaultTherapyGroupName(int therapyGroupId)
        {
            var therapyGroup = Context.TherapyGroups.FirstOrDefault(x => x.Id == therapyGroupId);
            if (CommonFunctions.IsDefaultTherapyGroupName(therapyGroup.Name))
            {
                therapyGroup.Name = GetDefaultTherapyGroupName(therapyGroup);
            }
            Context.SaveChanges();
        }

        private string GetDefaultTherapyGroupName(TherapyGroup therapyGroup)
        {
            var students = Context.StudentTherapies.Where(st => !st.Archived && st.TherapyGroupId == therapyGroup.Id)
                .Select(st => st.CaseLoad.Student)
                .OrderBy(s => s.LastName)
                .ThenBy(s => s.FirstName)
                .ToList();
            var names = new List<string>();
            foreach(var student in students)
            {
                names.Add(CommonFunctions.GetDefaultTherapyGroupStudentName(student));
            }

            return $"{CommonFunctions.GetDefaultTherapyGroupDayString(therapyGroup)} - {String.Join(", ", names)}";
        }
    }
}
