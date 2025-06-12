using System.Data.SqlClient;
using System.Data.SqlClient;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Model.DTOs
{
    public class ReversalClaimsStudentDTO
    {
        public string LastName { get; set; } // LastName (length: 60)

        public string FirstName { get; set; } // FirstName (length: 35)

        public string IdentificationCode { get; set; } // IdentificationCode (length: 12)

        public string Address { get; set; } // Address (length: 55)

        public string City { get; set; } // City (length: 30)

        public string State { get; set; } // State (length: 2)

        public string PostalCode { get; set; } // PostalCode (length: 15)

        public string InsuredDateTimePeriod { get; set; } // InsuredDateTimePeriod (length: 35)

        public List<int> ClaimsDistrictIds { get; set; }
        public List<int> ClaimsStudentIds { get; set; }
    }
}
