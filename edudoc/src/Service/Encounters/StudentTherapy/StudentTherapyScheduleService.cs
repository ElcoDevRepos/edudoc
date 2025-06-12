using FluentValidation;
using Model;
using Model.DTOs;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Globalization;
using Model.Enums;
using System.Net;

namespace Service.Encounters.StudentTherapies
{

    static class ScheduleData {
        public static ScheduleData<T> Create<T>(DateTime date, DateTime? dateEsigned, int encounterId, TimeSpan startTime, TimeSpan endTime, T items) {
            return new ScheduleData<T> {
                date = date,
                dateEsigned = dateEsigned,
                encounterId = encounterId,
                startTime = startTime,
                endTime = endTime,
                items = items
            };
        }
    }

    record struct ScheduleData<T> {
        public DateTime date;
        public DateTime? dateEsigned;
        public int encounterId;
        public TimeSpan startTime;
        public TimeSpan endTime;

        public T items;

    }


    public class StudentTherapyScheduleService : IStudentTherapyScheduleService
    {
        private readonly IPrimaryContext _context;
        public StudentTherapyScheduleService(IPrimaryContext context)
        {
            _context = context;
        }

        public IEnumerable<StudentTherapySchedule> BuildSchedulesFromStudentTherapy(StudentTherapy studentTherapy, int userId)
        {
            var selectedWeekdays = GetSelectedWeekdays(studentTherapy);
            var allDates = Enumerable.Range(0, int.MaxValue)
                .Select(x => studentTherapy.StartDate.AddDays(x))
                .TakeWhile(x => x.Date <= studentTherapy.EndDate.Date);
            TimeZoneInfo tz = CommonFunctions.GetTimeZone();
            var startsInDst = tz.IsDaylightSavingTime(allDates.FirstOrDefault());
            var endsInDst = tz.IsDaylightSavingTime(allDates.LastOrDefault());
            const int DATE_OFFSET = 240;
            return allDates.Where(day => selectedWeekdays.Contains(day.DayOfWeek))
                .Select(d =>
                {
                    var startDate = CommonFunctions.ApplyDaylightSavingsOffset(startsInDst, d);

                    var endDateString = d.ToString("MM-dd-yyyy", CultureInfo.InvariantCulture) + " " + studentTherapy.EndDate.ToString("HH:mm:ss", CultureInfo.InvariantCulture);

                    DateTime endDate;
                    if (!DateTime.TryParseExact(endDateString, "MM-dd-yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out endDate))
                    {
                        throw new FormatException($"Failed to parse endDateString: {endDateString}");
                    }

                    endDate = CommonFunctions.ApplyDaylightSavingsOffset(endsInDst, endDate);

                    var schedule = new StudentTherapySchedule
                    {
                        ScheduleStartTime = startDate.TimeOfDay,
                        ScheduleEndTime = endDate.TimeOfDay,
                        // Adding time to Date to handle UTC Offset for FE
                        ScheduleDate = startDate.Date.AddMinutes(DATE_OFFSET),
                        CreatedById = userId,
                        DateCreated = DateTime.UtcNow
                    };
                    return schedule;
                });
        }


        public bool FoundScheduleOverlap(StudentTherapy current)
        {
            var studentId = _context.CaseLoads
                .Where(c => c.Id == current.CaseLoadId)
                .Select(c => c.StudentId)
                .Single();

            // get potential conflicts with overlapping date range and day of week selection
            var othersQuery = _context.StudentTherapies
                .Where(s => !current.Archived)
                .Where(s => s.Id != current.Id)
                // We only want to check for provider's schedule overlap
                .Where(s => s.ProviderId == current.ProviderId)
                .Where(s => !s.Archived)
                .Where(s => (current.Monday && s.Monday) ||
                    (current.Tuesday && s.Tuesday) ||
                    (current.Wednesday && s.Wednesday) ||
                    (current.Thursday && s.Thursday) ||
                    (current.Friday && s.Friday)
                )
                .Where(s => DbFunctions.TruncateTime(s.StartDate) <= current.EndDate.Date && current.StartDate.Date <= DbFunctions.TruncateTime(s.EndDate));
            if (current.TherapyGroupId.HasValue)
            {
                othersQuery = othersQuery.Where(s => s.TherapyGroupId == null || s.TherapyGroupId.Value != current.TherapyGroupId.Value);
            }
            var others = othersQuery.ToList();

            var tz = CommonFunctions.GetTimeZone();
            var currentStartDst = tz.IsDaylightSavingTime(current.StartDate);
            var currentEndDst = tz.IsDaylightSavingTime(current.EndDate);
            var currentSelectedDays = new HashSet<DayOfWeek>(GetSelectedWeekdays(current));

            return others
                // find the date range where the other StudentTherapy overlaps with the current one
                .Select(other => new
                {
                    IntersectionRange = new
                    {
                        Start = other.StartDate > current.StartDate ? other.StartDate : current.StartDate,
                        End = other.EndDate < current.EndDate ? other.EndDate : current.EndDate
                    },
                    StudentTherapy = other
                })
                .Where(other => other.IntersectionRange.Start.Date <= other.IntersectionRange.End.Date)
                // compute the start and end times of both StudentTherapies on the same day so they can be compared to check for overlap.
                // that same day is arbitrarily chosen as the start of the intersection range.
                .Select(other => new
                {
                    other.IntersectionRange,
                    other.StudentTherapy,
                    MeetingTimes = new
                    {
                        Current = new
                        {
                            Start = CommonFunctions.ApplyDaylightSavingsOffset(
                                currentStartDst,
                                DateTime.Parse($"{other.IntersectionRange.Start:MM/dd/yyyy} {current.StartDate.ToLongTimeString()}")
                            ).TimeOfDay,
                            End = CommonFunctions.ApplyDaylightSavingsOffset(
                                currentEndDst,
                                DateTime.Parse($"{other.IntersectionRange.Start:MM/dd/yyyy} {current.EndDate.ToLongTimeString()}")
                            ).TimeOfDay
                        },
                        Other = new
                        {
                            Start = CommonFunctions.ApplyDaylightSavingsOffset(
                                tz.IsDaylightSavingTime(other.StudentTherapy.StartDate),
                                DateTime.Parse($"{other.IntersectionRange.Start:MM/dd/yyyy} {other.StudentTherapy.StartDate.ToLongTimeString()}")
                            ).TimeOfDay,
                            End = CommonFunctions.ApplyDaylightSavingsOffset(
                                tz.IsDaylightSavingTime(other.StudentTherapy.EndDate),
                                DateTime.Parse($"{other.IntersectionRange.Start:MM/dd/yyyy} {other.StudentTherapy.EndDate.ToLongTimeString()}")
                            ).TimeOfDay
                        }
                    }
                })
                .Where(x => x.MeetingTimes.Current.Start < x.MeetingTimes.Other.End && x.MeetingTimes.Other.Start < x.MeetingTimes.Current.End)
                // check if any day of the week selections common to both StudentTherapies fall within the overlapping date range
                .Select(other => new
                {
                    IntersectionDays = GetSelectedWeekdays(other.StudentTherapy)
                        .Where(day => currentSelectedDays.Contains(day))
                        .Select(day => GetNextWeekday(other.IntersectionRange.Start, day))
                        .Where(day => day.Date <= other.IntersectionRange.End.Date)
                        .ToList()
                })
                .Where(other => other.IntersectionDays.Count > 0)
                // anything still here has same time of day and at least one specific day was found where both meetings are scheduled
                .Any();
        }


        public void AddSchedulesToUpdatedTherapy(StudentTherapy studentTherapy, StudentTherapy existingSchedule, int userId)
        {
            var selectedWeekdays = GetSelectedWeekdays(studentTherapy);
            var allDates = Enumerable.Range(0, int.MaxValue)
                .Select(x => studentTherapy.StartDate.AddDays(x))
                .TakeWhile(x => x.Date <= studentTherapy.EndDate.Date);
            TimeZoneInfo tz = CommonFunctions.GetTimeZone();
            var startsInDst = tz.IsDaylightSavingTime(allDates.FirstOrDefault());
            var endsInDst = tz.IsDaylightSavingTime(allDates.LastOrDefault());
            const int DATE_OFFSET = 300;
            _context.StudentTherapySchedules.AddRange(allDates.Where(day => selectedWeekdays.Contains(day.DayOfWeek))
                .Select(d =>
                {
                    var startDate = CommonFunctions.ApplyDaylightSavingsOffset(startsInDst, d);

                    // Construct endDateString using explicit format
                    var endDateString = d.ToString("MM-dd-yyyy", CultureInfo.InvariantCulture) + " " + studentTherapy.EndDate.ToString("HH:mm:ss", CultureInfo.InvariantCulture);

                    DateTime endDate;
                    if (!DateTime.TryParseExact(endDateString, "MM-dd-yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out endDate))
                    {
                        // Handle parsing failure
                        throw new FormatException($"Failed to parse endDateString: {endDateString}");
                    }

                    endDate = CommonFunctions.ApplyDaylightSavingsOffset(endsInDst, endDate);

                    var schedule = new StudentTherapySchedule
                    {
                        ScheduleStartTime = startDate.TimeOfDay,
                        ScheduleEndTime = endDate.TimeOfDay,
                        StudentTherapyId = studentTherapy.Id,
                        // Adding time to Date to handle UTC Offset for FE
                        ScheduleDate = startDate.Date.AddMinutes(DATE_OFFSET),
                        CreatedById = userId,
                        DateCreated = DateTime.UtcNow
                    };
                    return schedule;
                }));
        }


        public int SetDeviationReason(int[] studentTherapyScheduleIds, int deviationReasonId, DateTime deviationReasonDate)
        {
            foreach (var id in studentTherapyScheduleIds)
            {
                var sts = _context.StudentTherapySchedules.FirstOrDefault(sts => sts.Id == id);
                if (sts != null)
                {
                    sts.DeviationReasonId = deviationReasonId;
                    sts.DeviationReasonDate = deviationReasonDate;
                }
            }
            _context.SaveChanges();
            return deviationReasonId;
        }

        private List<DayOfWeek> GetSelectedWeekdays(StudentTherapy st)
        {
            var selectedDays = new List<DayOfWeek>();
            if (st.Monday) selectedDays.Add(DayOfWeek.Monday);
            if (st.Tuesday) selectedDays.Add(DayOfWeek.Tuesday);
            if (st.Wednesday) selectedDays.Add(DayOfWeek.Wednesday);
            if (st.Thursday) selectedDays.Add(DayOfWeek.Thursday);
            if (st.Friday) selectedDays.Add(DayOfWeek.Friday);
            return selectedDays;
        }

        private static DateTime GetNextWeekday(DateTime start, DayOfWeek day)
        {
            // The (... + 7) % 7 ensures we end up with a value in the range [0, 6]
            int daysToAdd = ((int)day - (int)start.DayOfWeek + 7) % 7;
            return start.AddDays(daysToAdd);
        }

        public List<StudentTherapiesByDayDto> GetStudentTherapiesByDay(List<int> weekdays, int userId)
        {
            var result = new List<StudentTherapiesByDayDto>();
            var schedules = _context.StudentTherapies
                .Include("StudentTherapySchedules")
                .Include("CaseLoad")
                .Include("CaseLoad.Student")
                .Include("TherapyGroup")
                .Where(st => !st.Archived && st.CreatedById == userId &&
                    !st.StudentTherapySchedules.FirstOrDefault().EncounterStudents.Any(e => !e.Archived));

            foreach (var day in weekdays)
            {
                foreach (var s in schedules)
                {
                    if (CheckWeekday(day, s))
                    {
                        result.Add(new StudentTherapiesByDayDto
                        {
                            Weekday = day,
                            StudentId = s.CaseLoad.Student.Id,
                            StartTime = s.StartDate,
                            EndTime = s.EndDate,
                            FirstName = s.CaseLoad.Student.FirstName,
                            LastName = s.CaseLoad.Student.LastName,
                            SessionName = s.TherapyGroupId != null ? s.TherapyGroup.Name : s.SessionName ?? "",
                        });
                    }
                }
            }
            return result.OrderBy(r => r.Weekday)
                .ThenBy(r => r.StartTime.ToLocalTime().TimeOfDay)
                .ThenBy(r => r.StartTime.Date)
                .ThenBy(r => r.LastName).ToList();
        }

        private bool CheckWeekday(int weekday, StudentTherapy st)
        {
            switch (weekday)
            {
                case 1: return st.Monday;
                case 2: return st.Tuesday;
                case 3: return st.Wednesday;
                case 4: return st.Thursday;
                case 5: return st.Friday;
                default: return false;
            }
        }

        public List<EncounterForCalendarDto> GetForCalendar(Model.Core.CRUDSearchParams csp, int userId)
        {
            var encounterStatusesToInclude = new List<int>
            {
                (int)EncounterStatuses.Returned_BySupervisor_Encounter,
                (int)EncounterStatuses.Returned_ByAdmin_Encounter,
            };
            var startDate = new DateTime();
            var endDate = new DateTime();
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(
                    WebUtility.UrlDecode(csp.extraparams)
                );
                if (extras["StartDate"] != null)
                {
                    startDate = DateTime.Parse(extras["StartDate"]).Date;
                }
                if (extras["EndDate"] != null)
                {
                    endDate = DateTime.Parse(extras["EndDate"]).Date;
                }
            }
            var result = new List<EncounterForCalendarDto>();

            var today = DateTime.Now.Date;

            var encounters = _context
                .Encounters.Where(e =>
                    e.Provider.ProviderUserId == userId
                    && DbFunctions.TruncateTime(e.EncounterDate)
                        >= DbFunctions.TruncateTime(startDate)
                    && DbFunctions.TruncateTime(e.EncounterDate)
                        <= DbFunctions.TruncateTime(endDate)
                )
                .Where(e =>
                    (
                        e.FromSchedule
                        && e.EncounterStudents.All(es =>
                            es.Archived && !es.StudentTherapySchedule.Archived
                        )
                    )
                    || e.EncounterStudents.Any(es =>
                        !es.Archived
                        && (
                            es.StudentTherapyScheduleId > 0
                            || es.ESignedById != null
                            || encounterStatusesToInclude.Contains(es.EncounterStatusId)
                        )
                    )
                )
                .SelectMany(e => e.EncounterStudents)
                .Select(es => new
                {
                    es.EncounterDate,
                    es.EncounterId,
                    es.ESignedById,
                    es.StudentDeviationReasonId,
                    es.StudentTherapyScheduleId,
                    es.EncounterStartTime,
                    es.EncounterEndTime,
                    es.EncounterStatusId,
                    es.DateESigned,
                    es.StudentTherapySchedule.StudentTherapy.TherapyGroupId,
                    es.StudentTherapySchedule.StudentTherapy.SessionName,
                    StudentFirstName = es.Student.FirstName,
                    StudentLastName = es.Student.LastName,
                    EncounterIsGroup = es.Encounter.IsGroup,
                    TherapyGroupName = es.StudentTherapySchedule.StudentTherapy.TherapyGroup.Name,
                    EncounterServiceTypeId = es.Encounter.ServiceTypeId,
                })
                .AsEnumerable();

            // evaluations don't show as a single entry if they have different times,
            // so we have to process treatments and evals separately.

            var treatments = encounters
                .Where(e => e.EncounterServiceTypeId != (int)ServiceTypes.Evaluation_Assessment)
                .GroupBy(es => new
                {
                    date = es.EncounterDate.Date,
                    dateEsigned = es.DateESigned?.Date,
                    encounterId = es.EncounterId,
                })
                .Select(grp =>
                    ScheduleData.Create(
                        date: grp.Key.date,
                        dateEsigned: grp.Key.dateEsigned,
                        encounterId: grp.Key.encounterId,
                        startTime: grp.Min(s => s.EncounterStartTime),
                        endTime: grp.Max(s => s.EncounterEndTime),
                        items: grp.AsEnumerable()
                    )
                );
            var evals = encounters
                .Where(e => e.EncounterServiceTypeId == (int)ServiceTypes.Evaluation_Assessment)
                .GroupBy(es => new
                {
                    date = es.EncounterDate.Date,
                    dateEsigned = es.DateESigned?.Date,
                    encounterId = es.EncounterId,
                    startTime = es.EncounterStartTime,
                    endTime = es.EncounterEndTime,
                })
                .Select(grp =>
                    ScheduleData.Create(
                        grp.Key.date,
                        grp.Key.dateEsigned,
                        grp.Key.encounterId,
                        grp.Key.startTime,
                        grp.Key.endTime,
                        grp.AsEnumerable()
                    )
                );

            var encounterDtos = treatments
                .Concat(evals)
                .Select(grp => new
                {
                    EncounterId = grp.encounterId,
                    IsEsigned = grp.items.All(es => es.ESignedById != null)
                        || grp.items.Any(es =>
                            encounterStatusesToInclude.Contains(es.EncounterStatusId)
                        ),
                    IsDeviated = grp.items.All(es => es.StudentDeviationReasonId != null),
                    IsSchedule = grp.items.FirstOrDefault().StudentTherapyScheduleId != null,
                    IsGroup = grp.items.FirstOrDefault().EncounterIsGroup,
                    EncounterDate = (DateTime)grp.date,
                    StartTime = grp.startTime,
                    EndTime = grp.endTime,
                    DateESigned = grp.dateEsigned,
                    EncounterStatusId = grp.items.FirstOrDefault()?.EncounterStatusId ?? 0,
                    Students = grp
                        .items.OrderBy(es => es.StudentLastName)
                        .Select(es => new
                        {
                            FirstName = es.StudentFirstName,
                            LastName = es.StudentLastName,
                        }),
                    StudentTherapyScheduleId = grp.items.FirstOrDefault().StudentTherapyScheduleId
                        ?? 0,
                    TherapyGroupId = grp.items.FirstOrDefault().TherapyGroupId ?? 0,
                    TherapyGroupName = grp.items.FirstOrDefault().StudentTherapyScheduleId != null
                    && grp.items.FirstOrDefault().TherapyGroupId > 0
                        ? grp.items.FirstOrDefault().TherapyGroupName
                        : "",
                    ScheduleSessionName = grp.items.FirstOrDefault().StudentTherapyScheduleId
                    != null
                        ? grp.items.FirstOrDefault().SessionName
                        : "",
                    EncounterServiceTypeId = grp.items.FirstOrDefault().EncounterServiceTypeId,
                })
                .OrderBy(es => es.IsEsigned)
                .OrderBy(es => es.StartTime)
                .Select(es => new EncounterForCalendarDto
                {
                    EncounterId = es.EncounterId,
                    IsEsigned = es.IsEsigned,
                    IsDeviated = es.IsDeviated,
                    IsSchedule = es.IsSchedule,
                    IsGroup = es.IsGroup,
                    IsFuture = false,
                    EncounterDate = es.EncounterDate,
                    StartTime = DateTime.Parse((es.EncounterDate + es.StartTime).ToString("g")),
                    EndTime = DateTime.Parse((es.EncounterDate + es.EndTime).ToString("g")),
                    DateESigned = es.DateESigned ?? DateTime.UnixEpoch,
                    EncounterStatusId = es.EncounterStatusId,
                    Students = es
                        .Students.OrderBy(s => s.LastName)
                        .ThenBy(s => s.FirstName)
                        .Select(s => $"{s.LastName}, {s.FirstName}"),
                    StudentTherapyScheduleId = es.StudentTherapyScheduleId,
                    TherapyGroupId = es.TherapyGroupId,
                    SessionName = string.IsNullOrEmpty(es.TherapyGroupName)
                        ? es.ScheduleSessionName
                        : es.TherapyGroupName,
                    EncounterServiceTypeId = es.EncounterServiceTypeId,
                });

            result.AddRange(encounterDtos);

            var futureSchedules = _context
                .StudentTherapySchedules.Where(sts =>
                    !sts.EncounterStudents.Any()
                    && DbFunctions.TruncateTime(sts.ScheduleDate)
                        >= DbFunctions.TruncateTime(startDate)
                    && DbFunctions.TruncateTime(sts.ScheduleDate)
                        <= DbFunctions.TruncateTime(endDate)
                    && sts.StudentTherapy.CreatedById == userId
                    && !sts.StudentTherapy.CaseLoad.Archived
                    && !sts.Archived
                    && !sts.StudentTherapy.Archived
                )
                .Select(sts => new
                {
                    sts.Id,
                    sts.StudentTherapy.TherapyGroupId,
                    sts.ScheduleDate,
                    sts.ScheduleStartTime,
                    sts.ScheduleEndTime,
                    sts.DeviationReasonId,
                    StudentFirstName = sts.StudentTherapy.CaseLoad.Student.FirstName,
                    StudentLastName = sts.StudentTherapy.CaseLoad.Student.LastName,
                    TherapyGroupName = sts.StudentTherapy.TherapyGroup.Name,
                    sts.StudentTherapy.SessionName,
                })
                .GroupBy(s => new
                {
                    date = DbFunctions.TruncateTime(s.ScheduleDate),
                    groupId = s.TherapyGroupId > 0 ? s.TherapyGroupId : -s.Id,
                })
                .AsEnumerable()
                .Select(grp => new
                {
                    EncounterId = 0,
                    IsEsigned = false,
                    IsDeviated = grp.All(sts => sts.DeviationReasonId != null),
                    IsSchedule = true,
                    IsGroup = grp.Key.groupId > 0,
                    EncounterDate = (DateTime)grp.Key.date,
                    StartTime = grp.Min(sts => sts.ScheduleStartTime),
                    EndTime = grp.Max(es => es.ScheduleEndTime),
                    Students = grp.OrderBy(s => s.StudentLastName)
                        .Select(s => new
                        {
                            FirstName = s.StudentFirstName,
                            LastName = s.StudentLastName,
                        }),
                    StudentTherapyScheduleId = grp.FirstOrDefault().Id,
                    TherapyGroupId = grp.Key.groupId > 0 ? grp.Key.groupId : 0,
                    TherapyGroupName = grp.FirstOrDefault().TherapyGroupId > 0
                        ? grp.FirstOrDefault().TherapyGroupName
                        : "",
                    ScheduleSessionName = grp.FirstOrDefault().SessionName ?? "",
                    EncounterServiceTypeId = ServiceTypes.Treatment_Therapy,
                })
                .OrderBy(sts => sts.IsEsigned)
                .OrderBy(sts => sts.StartTime)
                .Select(sts => new EncounterForCalendarDto
                {
                    EncounterId = sts.EncounterId,
                    IsEsigned = sts.IsEsigned,
                    IsDeviated = sts.IsDeviated,
                    IsSchedule = sts.IsSchedule,
                    IsGroup = sts.IsGroup,
                    IsFuture = true,
                    EncounterDate = sts.EncounterDate,
                    StartTime = DateTime.Parse(
                        (sts.EncounterDate + (TimeSpan)sts.StartTime).ToString("g")
                    ),
                    EndTime = DateTime.Parse(
                        (sts.EncounterDate + (TimeSpan)sts.EndTime).ToString("g")
                    ),
                    Students = sts
                        .Students.OrderBy(s => s.LastName)
                        .ThenBy(s => s.FirstName)
                        .Select(s => $"{s.LastName}, {s.FirstName}"),
                    StudentTherapyScheduleId = sts.StudentTherapyScheduleId,
                    TherapyGroupId = (int)sts.TherapyGroupId,
                    SessionName = string.IsNullOrEmpty(sts.TherapyGroupName)
                        ? sts.ScheduleSessionName
                        : sts.TherapyGroupName,
                    EncounterServiceTypeId = (int)sts.EncounterServiceTypeId,
                })
                .ToList();

            result.AddRange(futureSchedules);
            return result;
        }

        public void ToggleArchived(List<int> scheduleIds) {
            var schedules = _context.StudentTherapySchedules.Include(sts => sts.EncounterStudents).Where(sts => scheduleIds.Contains(sts.Id)).ToList();
            foreach(var sched in schedules) {
                sched.Archived = !sched.Archived;
                foreach(var encounterStudent in sched.EncounterStudents) {
                    encounterStudent.Archived = sched.Archived;
                }
            }

            _context.SaveChanges();
        }
    }
}
