using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class MergeDTO
    {
        public SchoolDistrictRoster Roster
        {
            get;
            set;
        }

        public Student Student
        {
            get;
            set;
        }

        public Student StudentMergeInto
        {
            get;
            set;
        }

        public int? ParentalConsentTypeID
        {
            get;
            set;
        }

        public int? MergingIntoStudentId
        {
            get;
            set;
        }

        public DateTime? ParentalConsentEffectiveDate
        {
            get;
            set;
        }

        public List<int> StudentIds { get; set; }

    }
}
