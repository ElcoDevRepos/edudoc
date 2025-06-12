namespace API.Auth.Models
{
    /// <summary>
    ///      Parameters for updating a Username.
    /// </summary>
    public class UpdateUsernameParams
    {
        public int AuthUserId { get; set; }
        public string Username { get; set; }
    }
}