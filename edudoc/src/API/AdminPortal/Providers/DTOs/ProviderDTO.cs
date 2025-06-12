using Model;
using Model.DTOs;

namespace API.Providers.DTOs
{
    public class ProviderDTO
    {
        public User User
        {
            get; set;
        }

        public AuthUserDTO AuthUser
        {
            get; set;
        }

        public Provider Provider
        {
            get; set;
        }

        public int OldEmploymentTypeId
        {
            get; set;
        }

        public int UserTypeId
        {
            get; set;
        }

        public bool? SendEmail
        {
            get; set;
        }
    }
}
