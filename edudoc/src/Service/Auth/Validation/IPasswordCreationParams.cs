namespace Service.Auth.Validation
{
    /// <summary>
    ///      Interface for parameters that require basic password regex validation. For use when
    ///      creating a new password.
    /// </summary>
    public interface IPasswordCreationParams
    {
        string Password { get; set; }
    }
}
