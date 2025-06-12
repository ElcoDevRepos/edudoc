using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model.DTOs
{
    public class ProviderCaseUploadPreviewDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string DateOfBirth { get; set; }
        public string School { get; set; }
        public string ProviderName { get; set; }
        public string ProviderTitle { get; set; }
        public string Grade { get; set; }
    }
}
