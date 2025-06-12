using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class LinkSelectorDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public int LinkType { get; set; }
        public DateTime DateCreated { get; set; }
        public ProviderTraining ProviderTraining { get; set; }
        public DateTime? DueDate { get; set; }

    }
}
