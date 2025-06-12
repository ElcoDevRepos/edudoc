using Model;
using Model.Enums;
using Service.HealthCareClaims;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Service.Utilities
{
    public static class CommonFunctions
    {
        const int MAR = (int)Months.Mar;
        const int MAY = (int)Months.May;
        const int JUL = (int)Months.Jul;
        const int SEP = (int)Months.Sep;
        const int NOV = (int)Months.Nov;
        const int DEC = (int)Months.Dec;
        const int FIRST_OF_MONTH = 1;
        const int THIRTY_FIRST_OF_MONTH = 31;


        public static string[] SplitTerms(string query)
        {
            return query
               .Replace(',', ' ')
               .Split(' ')
               .Select(tt => tt.Trim())
               .ToArray();
        }

        public static bool IsBlankSearch(string query)
        {
            return string.IsNullOrWhiteSpace(query) || query == "*";
        }

        public static IQueryable<t> OrderByDynamic<t>(this IQueryable<t> query, string sortColumn, bool descending)
        {
            // Dynamically creates a call like this: query.OrderBy(p =&gt; p.SortColumn)
            var parameter = Expression.Parameter(typeof(t), "p");

            string command = "OrderBy";

            if (descending)
            {
                command = "OrderByDescending";
            }

            Expression resultExpression = null;

            var property = typeof(t).GetProperty(sortColumn);
            // this is the part p.SortColumn
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);

            // this is the part p =&gt; p.SortColumn
            var orderByExpression = Expression.Lambda(propertyAccess, parameter);

            // finally, call the "OrderBy" / "OrderByDescending" method with the order by lamba expression
            resultExpression = Expression.Call(typeof(Queryable), command, new Type[] { typeof(t), property.PropertyType },
               query.Expression, Expression.Quote(orderByExpression));

            return query.Provider.CreateQuery<t>(resultExpression);
        }

        /// <summary>
        /// Get a list of ints from the extra params.
        ///
        /// Usage example from UserRolesController:
        /// var extraParamLists = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "typeids");
        /// var typeIdList = extraParamLists["typeids"];
        /// cspFull.AddedWhereClause.Add(role => typeIdList.Contains(role.UserTypeId));
        /// </summary>
        /// <param name="extraParams">String of extra params to parse from</param>
        /// <param name="fieldNames">Field names to include</param>
        /// <returns>Dictionary mapping field name to list of integer values to search against for that field</returns>
        public static Dictionary<string, List<int>> GetIntListFromExtraParams(string extraParams, params string[] fieldNames)
        {
            return GetListFromExtraParams(extraParams, Int32.Parse, fieldNames);
        }

        public static Dictionary<string, List<bool>> GetBoolListFromExtraParams(string extraParams, params string[] fieldNames)
        {
            return GetListFromExtraParams(extraParams, (queryVal) => (queryVal == "1"), fieldNames);
        }

        private static Dictionary<string, List<T>> GetListFromExtraParams<T>(string extraParams, Func<string, T> selector, params string[] fieldNames)
        {
            var nvc = HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraParams));
            var result = new Dictionary<string, List<T>>();
            foreach (string fieldName in fieldNames)
            {
                if (nvc[fieldName] != null)
                {
                    result.Add(fieldName, nvc[fieldName].Split(',').Select(selector).ToList());
                }
                else
                {
                    result.Add(fieldName, new List<T>());
                }
            }
            return result;
        }

        public static string PadStringValue(int minLength, bool numeric, string paddedString)
        {
            return minLength > paddedString?.Length ? (numeric ? new StringBuilder(new string('0', minLength - paddedString.Length)).Append(paddedString).ToString() : new StringBuilder(new string(' ', minLength - paddedString.Length)).Append(paddedString).ToString()) : paddedString;
        }

        public static string TrimStringValue(int maxLength, string bloatedString)
        {

            return bloatedString?.Length > maxLength ? bloatedString.ReverseString().Substring(bloatedString.Length - maxLength).ReverseString() : bloatedString;
        }

        public static string ReverseString(this string s)
        {
            char[] array = new char[s.Length];
            int forward = 0;
            for (int i = s.Length - 1; i >= 0; i--)
            {
                array[forward++] = s[i];
            }
            return new string(array);
        }


        public static IEnumerable<(T item, int index)> WithIndex<T>(this IEnumerable<T> source)
        {
            return source.Select((item, index) => (item, index));
        }

        // public static IEnumerable<T[]> Chunk<T>(this IEnumerable<T> items, int size)
        // {
        //     T[] array = items as T[] ?? items.ToArray();

        //     for (int i = 0; i < array.Length; i += size)
        //     {
        //         T[] chunk = new T[Math.Min(size, array.Length - i)];
        //         Array.Copy(array, i, chunk, 0, chunk.Length);
        //         yield return chunk;
        //     }
        // }

        public static DataTable ToDataTable<T>(this IList<T> data)
        {
            PropertyDescriptorCollection properties =
                TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            foreach (T item in data)
            {
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                table.Rows.Add(row);
            }
            return table;
        }

        public class StringComparer : EqualityComparer<string>
        {
            public override bool Equals(string x, string y)
            {
                return x.ToLower().Trim() == y.ToLower().Trim();
            }

            public override int GetHashCode(string obj)
            {
                return obj.GetHashCode();
            }
        }

        public class NumberComparer : EqualityComparer<int>
        {
            public override bool Equals(int x, int y)
            {
                return x == y;
            }

            public override int GetHashCode(int obj)
            {
                return obj.GetHashCode();
            }
        }

        #region School and Fiscal Year
        public static DateTime GetCurrentSchoolYearStart()
        {
            var now = DateTime.Now;
            int subYear = now.Month >= JUL ? 0 : 1;
            return new DateTime(now.Year - subYear, JUL, 1);
        }

        public static DateTime GetFiscalYearStart()
        {
            var now = DateTime.Now;
            int subYear = now.Month >= SEP ? 0 : 1;
            return new DateTime(now.Year - subYear, SEP, FIRST_OF_MONTH);
        }

        public static DateTime GetFiscalYearEnd()
        {
            var now = DateTime.Now;
            int subYear = now.Month <= MAR ? 0 : 1;
            return new DateTime(now.Year + subYear, MAR, THIRTY_FIRST_OF_MONTH);
        }

        public static (DateTime Start, DateTime End) GetFiscalYearDateRange(int year)
        {
            (DateTime Start, DateTime End) fiscalRange = (Start: new DateTime(year - 1, SEP, FIRST_OF_MONTH), End: new DateTime(year, MAR, THIRTY_FIRST_OF_MONTH));
            return fiscalRange;
        }
        #endregion

        #region Billing
        public static IList<int> GetBillableServiceCodes()
        {
            return new List<int>{
                (int)ServiceCodes.Audiology,
                (int)ServiceCodes.Counseling_Social_Work,
                (int)ServiceCodes.Nursing,
                (int)ServiceCodes.Occupational_Therapy,
                (int)ServiceCodes.Physical_Therapy,
                (int)ServiceCodes.Psychology,
                (int)ServiceCodes.Speech_Therapy
            };
        }

        public static IList<(string, int)> GetBillableServiceCodesString()
        {
            return new List<(string, int)>{
                ("Audiology", 8),
                ("Counseling/Social Work", 7),
                ("Nursing", 5),
                ("Occupational Therapy", 3),
                ("Physical Therapy", 4),
                ("Psychology", 2),
                ("Speech Therapy", 1),
                ("Unknown", 0)
            };
        }

        public static IList<int> GetServiceCodesWithReferrals()
        {
            return new List<int>{
                (int)ServiceCodes.Audiology,
                (int)ServiceCodes.Occupational_Therapy,
                (int)ServiceCodes.Physical_Therapy,
                (int)ServiceCodes.Speech_Therapy
            };
        }

        public static IList<int> GetServiceCodesRequiringNPI()
        {
            return new List<int>{
                (int)ServiceCodes.Speech_Therapy,
                (int)ServiceCodes.Occupational_Therapy,
                (int)ServiceCodes.Physical_Therapy,
                (int)ServiceCodes.Non_Msp_Service,
                (int)ServiceCodes.Audiology,
            };
        }

        public static IList<int> GetInvoicedEncounterStatuses()
        {
            return new List<int>{
                (int)EncounterStatuses.Invoiced,
                (int)EncounterStatuses.Invoiced_and_Denied,
                (int)EncounterStatuses.Invoiced_and_Paid,
                (int)EncounterStatuses.Invoice_0_service_units
            };
        }

        // List of Error Codes that should be marked as Invoiced and Paid even if Paid Amount is 0
        public static IList<string> GetEDIErrorCodeExceptions()
        {
            return new List<string>{ "2", "45", "76" };
        }

        public static Dictionary<string, int> GetServiceCodeIdForVouchers()
        {
            return new Dictionary<string, int> {
                { "Counseling/Social Work", (int)ServiceCodes.Counseling_Social_Work },
                { "Nursing", (int)ServiceCodes.Nursing },
                { "Occupational Therapy", (int)ServiceCodes.Occupational_Therapy },
                { "Physical Therapy", (int)ServiceCodes.Physical_Therapy },
                { "Speech Therapy", (int)ServiceCodes.Speech_Therapy },
                { "Psychology", (int)ServiceCodes.Psychology },
                { "Audiology", (int)ServiceCodes.Audiology },
                { "Unknown", 0 },
            };
        }

        public static bool IsBillableServiceCode(string code)
        {
            return new List<string> { "HCC", "HCN", "HCO", "HCP", "HCS", "HCY", "HCA" }.Contains(code);
        }

        public static int GetBillingUnits(IEnumerable<ServiceUnitTimeSegment> encounterSegments, int? minutes)
        {
            var segment = encounterSegments.FirstOrDefault(segment => (segment.StartMinutes <= minutes && minutes <= segment.EndMinutes) || segment.EndMinutes == null);
            return segment != null ? segment.UnitDefinition : 1;
        }
        #endregion

        #region Time
        public static TimeSpan ConvertTimeSpanToUtc(TimeSpan time)
        {
            var response = new DateTime(time.Ticks);
            return response.ToUniversalTime().TimeOfDay;
        }

        public static TimeSpan ConvertTimeSpanForDate(TimeSpan time, DateTime scheduledDate)
        {
            var offsetMinutes = GetTimeZone().GetUtcOffset(scheduledDate).TotalMinutes;
            return scheduledDate.Date.AddMinutes(time.TotalMinutes).AddMinutes(-offsetMinutes).TimeOfDay;
        }

        public static TimeSpan ConvertTimeSpanWithOffset(TimeSpan time, DateTime scheduledDate, int offset)
        {
            if (offset > 0)
            {
                return ApplyDaylightSavingsOffset(scheduledDate, new DateTime(time.Ticks).AddMinutes(offset)).TimeOfDay;
            }
            else
            {
                var date = DateTime.MaxValue.Date.AddTicks(time.Ticks);
                return ApplyDaylightSavingsOffset(scheduledDate, date.AddMinutes(offset)).TimeOfDay;
            }
        }

        public static DateTime ApplyDaylightSavingsOffset(DateTime scheduledDate, DateTime responseDate)
        {
            TimeZoneInfo tz = GetTimeZone();
            bool todayInDst = tz.IsDaylightSavingTime(DateTime.Now.ToUniversalTime());
            var date = new DateTime(scheduledDate.Year, scheduledDate.Month, scheduledDate.Day,
                scheduledDate.Hour, scheduledDate.Minute, scheduledDate.Second);
            bool scheduledInDst = tz.IsDaylightSavingTime(date.ToUniversalTime());
            if (!todayInDst && scheduledInDst)
                return responseDate.AddHours(-1);
            if (todayInDst && !scheduledInDst)
                return responseDate.AddHours(1);
            return responseDate;
        }

        public static DateTime ApplyDaylightSavingsOffset(bool startsInDst, DateTime scheduleDate)
        {
            DateTime utc = scheduleDate.ToUniversalTime();
            TimeZoneInfo tz = GetTimeZone();
            bool scheduledInDst = tz.IsDaylightSavingTime(utc);
            if (startsInDst && !scheduledInDst)
                return scheduleDate.AddHours(1);
            if (!startsInDst && scheduledInDst)
                return scheduleDate.AddHours(-1);
            return scheduleDate;
        }

        public static TimeZoneInfo GetTimeZone()
        {
            return TimeZoneInfo.FindSystemTimeZoneById("US Eastern Standard Time");
        }

        public static DateTime NowInEasternTime() {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, GetTimeZone());
        }
        #endregion

        #region Therapy Schedules
        public static bool IsDefaultTherapyGroupName(string name)
        {
            // Default group names have the pattern of: DaysOfWeek - LastName.FirstNameInitial, ...
            return Regex.IsMatch(name, @"[a-zA-Z]+\s\-\s([a-zA-Z']+\.[a-zA-Z])(\,\s[a-zA-Z']+\.[a-zA-Z])*$");
        }
        public static string GetDefaultTherapyGroupDayString(TherapyGroup therapyGroup)
        {
            var days = "";
            if (therapyGroup.Monday) days += "M";
            if (therapyGroup.Tuesday) days += "T";
            if (therapyGroup.Wednesday) days += "W";
            if (therapyGroup.Thursday) days += "Th";
            if (therapyGroup.Friday) days += "F";
            return days;
        }

        public static string GetDefaultTherapyGroupStudentName(Student student)
        {
            return $"{student.LastName}.{student.FirstName.Substring(0, 1)}";
        }
        #endregion
    }
}
