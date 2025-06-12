namespace Service.Auth.Validation
{
    /// <summary>
    ///      Interface for all parameters that require a Password to match a Confirmation.
    /// </summary>
    public interface IPasswordConfirmer : IPasswordCreationParams
    {
        string Confirmation { get; set; }
    }
}