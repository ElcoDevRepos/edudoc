using System.Data.SqlClient;
using System.Data.SqlClient;

using System.Collections.Generic;

namespace Model.DTOs
{
    public class SelectOptions
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public bool Archived { get; set; }
    }

    public class SelectOptionsWithProviderId
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> ProviderIds { get; set; }
    }
}
