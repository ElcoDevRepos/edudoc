using System.Data.SqlClient;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(UserRoleMetaData))]
    public partial class UserRole : IBasicNameEntity
    {
        internal sealed class UserRoleMetaData
        {
            private UserRoleMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<AuthUser> AuthUsers { get; set; } // AuthUsers.FK_AuthUsers_UserRoles
        }
    }
}