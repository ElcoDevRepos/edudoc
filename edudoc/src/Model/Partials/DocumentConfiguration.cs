using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model
{
    public partial class DocumentConfiguration
    {
        partial void InitializePartial()
        {
            HasOptional(a => a.User)
                .WithMany(b => b.Documents_UploadedBy)
                .HasForeignKey(c => c.UploadedBy)
                .WillCascadeOnDelete(false); // need to specify this to create db dynamically in testing
        }
    }
}