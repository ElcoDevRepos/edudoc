using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class StudentTherapyScheduleDeviationReasonDto
    {
        public int[] StudentTherapyScheduleIds { get; set; }
        public int DeviationReasonId { get; set; }
        public DateTime DeviationReasonDate { get; set; }
    }

}
