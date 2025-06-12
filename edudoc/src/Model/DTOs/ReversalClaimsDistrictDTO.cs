using System.Data.SqlClient;
using System.Data.SqlClient;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Model.DTOs
{
    public class ReversalClaimsDistrictDTO
    {
        public string IdentificationCode { get; set; } // IdentificationCode (length: 80)

        public string DistrictOrganizationName { get; set; } // DistrictOrganizationName (length: 60)

        public string Address { get; set; } // Address (length: 55)

        public string City { get; set; } // City (length: 30)

        public string State { get; set; } // State (length: 2)

        public string PostalCode { get; set; } // PostalCode (length: 15)

        public string EmployerId { get; set; } // EmployerId (length: 50)

        public List<int> ClaimsDistrictIds { get; set; }
    }
}
