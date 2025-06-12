namespace API.UserRoles.Models
{
    public class UserRoleSearchParams
    {
        public string Query { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
        public int[] ClaimTypeIds { get; set; }
    }
}
