namespace Service.Auth.Models
{
    public class UserDetailCustomOptions
    {
        public int RoleId { get; set; }

        public int UserTypeId { get; set; }

        public bool IsAssistant { get; set; }

        public bool IsSupervisor { get; set; }

        public bool VerifiedOrp { get; set; }

        public string Title { get; set; }

        public int UserAssociationId { get; set; }

        public int? ServiceCodeId { get; set; }

        public int? ImpersonatingUserId { get; set; }

        public int AuthUserId { get; set; }
    }
}
