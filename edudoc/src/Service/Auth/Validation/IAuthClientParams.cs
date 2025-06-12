namespace Service.Auth.Validation
{
    /// <summary>
    ///      Interface for params that require AuthClient validation. Went with an interface as
    ///      opposed to an abstract base because it allows us to implement multiple in one class.
    /// </summary>
    public interface IAuthClientParams
    {
        int AuthClientId { get; set; }
        string AuthClientSecret { get; set; }
    }
}
