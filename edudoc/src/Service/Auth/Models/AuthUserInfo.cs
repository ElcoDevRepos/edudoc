namespace Service.Auth.Models
{
    public class UserDetails
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ProfileImagePath { get; set; }
        public UserDetailCustomOptions CustomOptions { get; set; }
    }
}
