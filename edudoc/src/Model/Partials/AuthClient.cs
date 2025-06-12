using System.Data.SqlClient;
using System.Data.SqlClient;
using System.ComponentModel.DataAnnotations.Schema;

namespace Model
{
    public partial class AuthClient : IVerifiable
    {
        [NotMapped]
        public byte[] Password
        {
            get { return Secret; }
            set { Secret = value; }
        }
    }
}