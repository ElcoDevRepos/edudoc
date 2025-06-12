using System.Data.SqlClient;
using System.Data.SqlClient;

using System;

namespace Model.Custom
{
    public class ActivityReportFilters
    {
        public int districtId = 0;
        public int serviceAreaId = 0;
        public int providerId = 0;
        public int studentId = 0;
        public int serviceTypeId = 0;
        public int month = 0;
        public int year = 0;
        public bool monthSelected = false;
        public DateTime? startDate = null;
        public DateTime? endDate = null;
        public bool isAdmin = false;
        public bool isCompleted = false;
    }
}
