namespace API.Auth.Models
{
    /// <summary>
    ///      Interface for use in packaging a LoginResult along with an entity or other information.
    ///      For use in derived AuthControllers when overriding RequestToken and RequestRefresh.
    /// </summary>
    public interface ILoginResultDto
    {
        LoginResult LoginResult { get; set; }
    }
}