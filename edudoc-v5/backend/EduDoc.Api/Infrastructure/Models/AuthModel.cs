namespace EduDoc.Api.Infrastructure.Models
{
    public class AuthModel
    {
        public int UserId { get; set; }
        public required string Username { get; set; }
        public int UserRoleId { get; set; }
        public int UserRoleTypeId { get; set; }

    }
}
